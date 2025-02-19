-- Create profile_photos table
CREATE TABLE IF NOT EXISTS profile_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies
ALTER TABLE profile_photos ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own photos and photos of other profiles
CREATE POLICY "Users can view any profile photos"
    ON profile_photos
    FOR SELECT
    USING (true);

-- Allow users to insert their own photos
CREATE POLICY "Users can insert their own photos"
    ON profile_photos
    FOR INSERT
    WITH CHECK (profile_id IN (
        SELECT id FROM profiles
        WHERE id = auth.uid()
    ));

-- Allow users to update their own photos
CREATE POLICY "Users can update their own photos"
    ON profile_photos
    FOR UPDATE
    USING (profile_id IN (
        SELECT id FROM profiles
        WHERE id = auth.uid()
    ));

-- Allow users to delete their own photos
CREATE POLICY "Users can delete their own photos"
    ON profile_photos
    FOR DELETE
    USING (profile_id IN (
        SELECT id FROM profiles
        WHERE id = auth.uid()
    ));

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profile_photos_updated_at
    BEFORE UPDATE ON profile_photos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
