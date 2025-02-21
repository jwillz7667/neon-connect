-- Drop all tables and types safely
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    -- Disable row level security first to avoid any conflicts
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'ALTER TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' DISABLE ROW LEVEL SECURITY;';
    END LOOP;

    -- Drop all tables
    DROP TABLE IF EXISTS public.verification_attempts CASCADE;
    DROP TABLE IF EXISTS public.verification_requests CASCADE;
    DROP TABLE IF EXISTS public.profile_photos CASCADE;
    DROP TABLE IF EXISTS public.subscriptions CASCADE;
    DROP TABLE IF EXISTS public.posts CASCADE;
    DROP TABLE IF EXISTS public.follows CASCADE;
    DROP TABLE IF EXISTS public.profiles CASCADE;

    -- Drop custom types
    DROP TYPE IF EXISTS public.verification_status CASCADE;
    DROP TYPE IF EXISTS public.user_role CASCADE;
    DROP TYPE IF EXISTS public.subscription_tier CASCADE;
    DROP TYPE IF EXISTS public.subscription_status CASCADE;

    -- Drop functions
    DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
    DROP FUNCTION IF EXISTS public.check_verification_attempts(UUID, INET) CASCADE;
    DROP FUNCTION IF EXISTS public.record_verification_attempt(UUID, INET, BOOLEAN, TEXT) CASCADE;
    DROP FUNCTION IF EXISTS public.check_suspicious_patterns(UUID) CASCADE;
END $$; 