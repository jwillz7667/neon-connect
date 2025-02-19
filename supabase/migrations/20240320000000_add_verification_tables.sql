-- Enable pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum for verification status
DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected', 'expired');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create verification_requests table if it doesn't exist
CREATE TABLE IF NOT EXISTS verification_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status verification_status DEFAULT 'pending',
    documents JSONB,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewer_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create verification_attempts table if it doesn't exist
CREATE TABLE IF NOT EXISTS verification_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ip_address INET,
    attempt_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    success BOOLEAN DEFAULT FALSE,
    failure_reason TEXT
);

-- Create function to check verification attempts
CREATE OR REPLACE FUNCTION check_verification_attempts(p_user_id UUID, p_ip_address INET)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    daily_attempts INTEGER;
    monthly_attempts INTEGER;
BEGIN
    -- Check daily attempts (max 3 per day)
    SELECT COUNT(*)
    INTO daily_attempts
    FROM verification_attempts
    WHERE user_id = p_user_id
    AND attempt_date > NOW() - INTERVAL '24 hours';

    IF daily_attempts >= 3 THEN
        RETURN FALSE;
    END IF;

    -- Check monthly attempts (max 10 per month)
    SELECT COUNT(*)
    INTO monthly_attempts
    FROM verification_attempts
    WHERE user_id = p_user_id
    AND attempt_date > NOW() - INTERVAL '30 days';

    IF monthly_attempts >= 10 THEN
        RETURN FALSE;
    END IF;

    -- Check IP-based attempts (max 5 per day per IP)
    SELECT COUNT(*)
    INTO daily_attempts
    FROM verification_attempts
    WHERE ip_address = p_ip_address
    AND attempt_date > NOW() - INTERVAL '24 hours';

    IF daily_attempts >= 5 THEN
        RETURN FALSE;
    END IF;

    RETURN TRUE;
END;
$$;

-- Create function to record verification attempt
CREATE OR REPLACE FUNCTION record_verification_attempt(
    p_user_id UUID,
    p_ip_address INET,
    p_success BOOLEAN,
    p_failure_reason TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO verification_attempts (
        user_id,
        ip_address,
        success,
        failure_reason
    ) VALUES (
        p_user_id,
        p_ip_address,
        p_success,
        p_failure_reason
    );
END;
$$;

-- Create function to check for suspicious patterns
CREATE OR REPLACE FUNCTION check_suspicious_patterns(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    suspicious BOOLEAN := FALSE;
BEGIN
    -- Check for multiple failed attempts
    SELECT EXISTS (
        SELECT 1
        FROM verification_attempts
        WHERE user_id = p_user_id
        AND success = FALSE
        AND attempt_date > NOW() - INTERVAL '24 hours'
        GROUP BY user_id
        HAVING COUNT(*) >= 3
    ) INTO suspicious;

    IF suspicious THEN
        RETURN TRUE;
    END IF;

    -- Check for multiple IPs
    SELECT EXISTS (
        SELECT 1
        FROM verification_attempts
        WHERE user_id = p_user_id
        AND attempt_date > NOW() - INTERVAL '24 hours'
        GROUP BY user_id
        HAVING COUNT(DISTINCT ip_address) >= 3
    ) INTO suspicious;

    RETURN suspicious;
END;
$$;

-- Add RLS policies
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_attempts ENABLE ROW LEVEL SECURITY;

-- Users can only view their own verification requests
CREATE POLICY "Users can view own verification requests"
    ON verification_requests FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Users can only insert their own verification requests
CREATE POLICY "Users can insert own verification requests"
    ON verification_requests FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Only admins can update verification requests
CREATE POLICY "Admins can update verification requests"
    ON verification_requests FOR UPDATE
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_verification_requests_user_id ON verification_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_requests_status ON verification_requests(status);
CREATE INDEX IF NOT EXISTS idx_verification_attempts_user_id ON verification_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_attempts_ip_address ON verification_attempts(ip_address);
CREATE INDEX IF NOT EXISTS idx_verification_attempts_date ON verification_attempts(attempt_date);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_verification_requests_updated_at ON verification_requests;
CREATE TRIGGER update_verification_requests_updated_at
    BEFORE UPDATE ON verification_requests
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column(); 