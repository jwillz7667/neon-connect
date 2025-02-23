-- Create enum for navigation types if it doesn't exist
DO $$ BEGIN
    CREATE TYPE nav_type AS ENUM ('primary', 'secondary');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create states table
CREATE TABLE states (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    abbreviation CHAR(2) NOT NULL UNIQUE,
    path VARCHAR(100) NOT NULL UNIQUE,
    provider_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create navigation items table
CREATE TABLE navigation_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    label VARCHAR(50) NOT NULL,
    path VARCHAR(100) NOT NULL,
    nav_type nav_type NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_highlighted BOOLEAN DEFAULT false,
    sort_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create categories table
CREATE TABLE categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) NOT NULL UNIQUE,
    provider_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Insert all US states
INSERT INTO states (name, abbreviation, path) VALUES
('Alabama', 'AL', 'alabama'),
('Alaska', 'AK', 'alaska'),
('Arizona', 'AZ', 'arizona'),
('Arkansas', 'AR', 'arkansas'),
('California', 'CA', 'california'),
('Colorado', 'CO', 'colorado'),
('Connecticut', 'CT', 'connecticut'),
('Delaware', 'DE', 'delaware'),
('Florida', 'FL', 'florida'),
('Georgia', 'GA', 'georgia'),
('Hawaii', 'HI', 'hawaii'),
('Idaho', 'ID', 'idaho'),
('Illinois', 'IL', 'illinois'),
('Indiana', 'IN', 'indiana'),
('Iowa', 'IA', 'iowa'),
('Kansas', 'KS', 'kansas'),
('Kentucky', 'KY', 'kentucky'),
('Louisiana', 'LA', 'louisiana'),
('Maine', 'ME', 'maine'),
('Maryland', 'MD', 'maryland'),
('Massachusetts', 'MA', 'massachusetts'),
('Michigan', 'MI', 'michigan'),
('Minnesota', 'MN', 'minnesota'),
('Mississippi', 'MS', 'mississippi'),
('Missouri', 'MO', 'missouri'),
('Montana', 'MT', 'montana'),
('Nebraska', 'NE', 'nebraska'),
('Nevada', 'NV', 'nevada'),
('New Hampshire', 'NH', 'new-hampshire'),
('New Jersey', 'NJ', 'new-jersey'),
('New Mexico', 'NM', 'new-mexico'),
('New York', 'NY', 'new-york'),
('North Carolina', 'NC', 'north-carolina'),
('North Dakota', 'ND', 'north-dakota'),
('Ohio', 'OH', 'ohio'),
('Oklahoma', 'OK', 'oklahoma'),
('Oregon', 'OR', 'oregon'),
('Pennsylvania', 'PA', 'pennsylvania'),
('Rhode Island', 'RI', 'rhode-island'),
('South Carolina', 'SC', 'south-carolina'),
('South Dakota', 'SD', 'south-dakota'),
('Tennessee', 'TN', 'tennessee'),
('Texas', 'TX', 'texas'),
('Utah', 'UT', 'utah'),
('Vermont', 'VT', 'vermont'),
('Virginia', 'VA', 'virginia'),
('Washington', 'WA', 'washington'),
('West Virginia', 'WV', 'west-virginia'),
('Wisconsin', 'WI', 'wisconsin'),
('Wyoming', 'WY', 'wyoming');

-- Insert navigation items
INSERT INTO navigation_items (label, path, nav_type, sort_order, is_highlighted) VALUES
('ESCORTS', '/escorts', 'primary', 1, false),
('MASSAGE', '/massage', 'primary', 2, false),
('AFFAIRS', '/affairs', 'primary', 3, false),
('LIVE ESCORTS', '/live', 'primary', 4, false),
('SEARCH', '/search', 'secondary', 1, false),
('POST AD', '/post', 'secondary', 2, true);

-- Insert categories
INSERT INTO categories (name, slug) VALUES
('All Escorts', 'all-escorts'),
('What''s New', 'whats-new'),
('VIP', 'vip'),
('XXX Stars', 'xxx-stars'),
('Visiting', 'visiting'),
('Available Now', 'available-now'),
('Super Busty', 'super-busty'),
('Mature', 'mature'),
('College Girls', 'college-girls'),
('Video', 'video');

-- Create RLS policies
ALTER TABLE states ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public read access for states" ON states
    FOR SELECT USING (true);
    
CREATE POLICY "Public read access for navigation" ON navigation_items
    FOR SELECT USING (true);
    
CREATE POLICY "Public read access for categories" ON categories
    FOR SELECT USING (true); 