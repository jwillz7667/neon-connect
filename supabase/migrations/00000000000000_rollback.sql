-- Remove RLS policies
DO $$ 
BEGIN
    -- Drop policies if they exist
    IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Public profiles are viewable by everyone') THEN
        DROP POLICY "Public profiles are viewable by everyone" ON profiles;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can insert their own profile') THEN
        DROP POLICY "Users can insert their own profile" ON profiles;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can update own profile') THEN
        DROP POLICY "Users can update own profile" ON profiles;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'posts' AND policyname = 'Posts are viewable by everyone') THEN
        DROP POLICY "Posts are viewable by everyone" ON posts;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'posts' AND policyname = 'Users can insert their own posts') THEN
        DROP POLICY "Users can insert their own posts" ON posts;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'posts' AND policyname = 'Users can update own posts') THEN
        DROP POLICY "Users can update own posts" ON posts;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'posts' AND policyname = 'Users can delete own posts') THEN
        DROP POLICY "Users can delete own posts" ON posts;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'subscriptions' AND policyname = 'Users can view own subscriptions') THEN
        DROP POLICY "Users can view own subscriptions" ON subscriptions;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'subscriptions' AND policyname = 'Only system can manage subscriptions') THEN
        DROP POLICY "Only system can manage subscriptions" ON subscriptions;
    END IF;
END $$;

-- Disable RLS on tables if they exist
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'posts') THEN
        ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'subscriptions') THEN
        ALTER TABLE subscriptions DISABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Remove triggers and functions if they exist
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at') THEN
        DROP TRIGGER update_profiles_updated_at ON profiles;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_posts_updated_at') THEN
        DROP TRIGGER update_posts_updated_at ON posts;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_subscriptions_updated_at') THEN
        DROP TRIGGER update_subscriptions_updated_at ON subscriptions;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at') THEN
        DROP FUNCTION update_updated_at();
    END IF;
END $$;

-- Remove JSON constraints if tables exist
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        ALTER TABLE profiles
        DROP CONSTRAINT IF EXISTS contact_info_valid,
        DROP CONSTRAINT IF EXISTS rates_valid,
        ALTER COLUMN contact_info SET DATA TYPE json USING contact_info::json,
        ALTER COLUMN rates SET DATA TYPE json USING rates::json;
    END IF;
END $$;

-- Remove indexes if they exist
DROP INDEX IF EXISTS idx_profiles_role;
DROP INDEX IF EXISTS idx_profiles_verification;
DROP INDEX IF EXISTS idx_profiles_location;
DROP INDEX IF EXISTS idx_profiles_provider_status;
DROP INDEX IF EXISTS idx_posts_user_time;
DROP INDEX IF EXISTS idx_posts_created_at;
DROP INDEX IF EXISTS idx_subscriptions_user;
DROP INDEX IF EXISTS idx_subscriptions_status;
DROP INDEX IF EXISTS idx_subscriptions_tier;
DROP INDEX IF EXISTS idx_subscriptions_period;

-- Remove audit fields if tables exist
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        ALTER TABLE profiles
        DROP COLUMN IF EXISTS created_by,
        DROP COLUMN IF EXISTS updated_by;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'posts') THEN
        ALTER TABLE posts
        DROP COLUMN IF EXISTS created_by,
        DROP COLUMN IF EXISTS updated_by;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'subscriptions') THEN
        ALTER TABLE subscriptions
        DROP COLUMN IF EXISTS created_by,
        DROP COLUMN IF EXISTS updated_by;
    END IF;
END $$; 