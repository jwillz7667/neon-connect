-- Create role enum type
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'provider', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create or update profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    birthdate DATE,
    email TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'user',
    verification_status verification_status DEFAULT 'pending',
    bio TEXT,
    city TEXT,
    contact_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Add RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Everyone can view profiles
CREATE POLICY "Anyone can view profiles"
    ON profiles FOR SELECT
    USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Create trigger for updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 