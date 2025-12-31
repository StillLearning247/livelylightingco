-- LivelyLightingCo CMS Database Schema
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. SITE CONTENT TABLE
-- Stores all editable text content
-- ============================================
CREATE TABLE IF NOT EXISTS site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page VARCHAR(50) NOT NULL,
  section VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id),
  UNIQUE(page, section)
);

-- ============================================
-- 2. GALLERY IMAGES TABLE
-- Stores Cloudinary image references
-- ============================================
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cloudinary_public_id VARCHAR(255) NOT NULL,
  cloudinary_hires_id VARCHAR(255),
  title VARCHAR(255) DEFAULT '',
  alt_text VARCHAR(255) DEFAULT '',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. TESTIMONIALS TABLE
-- Stores customer testimonials
-- ============================================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  location VARCHAR(100) DEFAULT '',
  quote TEXT NOT NULL,
  rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. ADMINS TABLE
-- Stores admin users
-- ============================================
CREATE TABLE IF NOT EXISTS admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on admins table
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Admins can read their own row
CREATE POLICY "Users can read own admin row"
  ON admins FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- 5. IS_ADMIN FUNCTION
-- Check if current user is an admin
-- ============================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admins
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 5. ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- SITE_CONTENT policies
CREATE POLICY "Anyone can read site content"
  ON site_content FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert site content"
  ON site_content FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update site content"
  ON site_content FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete site content"
  ON site_content FOR DELETE
  USING (is_admin());

-- GALLERY_IMAGES policies
CREATE POLICY "Anyone can read gallery images"
  ON gallery_images FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert gallery images"
  ON gallery_images FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update gallery images"
  ON gallery_images FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete gallery images"
  ON gallery_images FOR DELETE
  USING (is_admin());

-- TESTIMONIALS policies
CREATE POLICY "Anyone can read testimonials"
  ON testimonials FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert testimonials"
  ON testimonials FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update testimonials"
  ON testimonials FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete testimonials"
  ON testimonials FOR DELETE
  USING (is_admin());

-- ============================================
-- 6. SEED DATA - Initial content from website
-- ============================================

-- Seed gallery images (current hardcoded images)
INSERT INTO gallery_images (cloudinary_public_id, cloudinary_hires_id, title, display_order) VALUES
  ('House1_upqaeq', 'House1_phnaes', '', 1),
  ('House3_800_zjggld', 'House3_oeyopl', '', 2),
  ('House4_800_wrgrqf', 'House4_wt2d0m', '', 3),
  ('House5_ltz96r', 'House5_2400_v7p3an', '', 4),
  ('House6_800_kdubrl', 'House6_kmwq4e', '', 5),
  ('Daytime_Browntrack_850_jad2il', 'Daytime_Browntrack_vr2o7q', '', 6),
  ('Daytime_Govee_with_tracks_1000_msetko', 'Daytime_Govee_with_tracks_hjzvd0', '', 7),
  ('uplcose_tracks_1000_ierp3c', 'Uplcose_Tracks_HIFI_qto8wx', '', 8)
ON CONFLICT DO NOTHING;

-- Seed testimonials (current hardcoded testimonials)
INSERT INTO testimonials (name, location, quote, rating, display_order) VALUES
  ('Jennifer S.', 'Austin, TX', 'LivelyLightingCo transformed our home! The install was quick and professional – and we love controlling the lights with our phone. Our neighbors keep asking where we got our lights done.', 5, 1),
  ('Michael T.', 'Round Rock, TX', 'Jakob and his team were fantastic from start to finish. No more climbing ladders for holidays! The lights look clean and professional during the day and absolutely stunning at night.', 5, 2),
  ('Sarah & David', 'Cedar Park, TX', 'We tried installing Govee lights ourselves first and it was a disaster. LivelyLightingCo fixed everything and installed them properly with their track system. Worth every penny!', 5, 3)
ON CONFLICT DO NOTHING;

-- Seed site content (current hardcoded text)
INSERT INTO site_content (page, section, content) VALUES
  -- Home page
  ('home', 'hero_title', 'Govee Permanent Outdoor Lighting. Expertly Installed'),
  ('home', 'hero_subtitle', 'Year-round custom lighting. No hassle or ugly wires. All controlled from your phone. Installed by Govee lighting experts.'),
  ('home', 'floating_banner', '*BEST PRICE GUARANTEE* We will beat any quote from Jellyfish, Trimlight, Oelo or Gemstone (Astoria).'),
  ('home', 'gallery_title', 'Our Work'),
  ('home', 'gallery_description', 'Browse our gallery of beautiful lighting installations. Each project is custom designed to complement the home''s architecture.'),
  ('home', 'testimonials_title', 'What Our Customers Say'),
  ('home', 'testimonials_description', 'Don''t just take our word for it. Here''s what homeowners think about our service.'),
  ('home', 'difference_title', 'Why Choose LivelyLightingCo'),
  ('home', 'difference_description', 'Don''t let a bad installation ruin your investment. We bring unmatched expertise to every project.'),

  -- About page
  ('about', 'page_title', 'About LivelyLightingCo'),
  ('about', 'page_subtitle', 'We''re Austin''s premier Govee lighting installation experts, dedicated to transforming homes with beautiful, permanent outdoor lighting solutions.'),
  ('about', 'mission_title', 'Our Mission'),
  ('about', 'mission_text', 'To provide homeowners with beautiful, permanent lighting solutions that enhance their homes year-round, installed with expert craftsmanship at an affordable price.'),
  ('about', 'service_area_title', 'Service Area'),
  ('about', 'service_area_intro', 'We proudly serve the greater Austin area, including:'),
  ('about', 'service_areas_list', 'Austin, Round Rock, Cedar Park, Georgetown, Pflugerville, Leander, Buda, Kyle, Lakeway'),

  -- Contact page
  ('contact', 'form_title', 'Request a Free Quote'),
  ('contact', 'consultation_title', 'Get Your Free Consultation'),
  ('contact', 'consultation_description', 'Ready to transform your home with stunning, permanent lighting? Fill out the form for a free consultation or reach out directly.')
ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content;

-- ============================================
-- 7. HELPER: Update timestamp trigger
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER site_content_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 8. PROMO SETTINGS TABLE
-- Stores promotional popup configuration
-- ============================================
CREATE TABLE IF NOT EXISTS promo_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enabled BOOLEAN DEFAULT false,
  image_url VARCHAR(500) DEFAULT '/images/NewYears flyer2026.png',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE promo_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read promo settings (for the popup to show)
CREATE POLICY "Anyone can read promo settings"
  ON promo_settings FOR SELECT
  USING (true);

-- Only admins can insert promo settings
CREATE POLICY "Admins can insert promo settings"
  ON promo_settings FOR INSERT
  WITH CHECK (is_admin());

-- Only admins can update promo settings
CREATE POLICY "Admins can update promo settings"
  ON promo_settings FOR UPDATE
  USING (is_admin());

-- Only admins can delete promo settings
CREATE POLICY "Admins can delete promo settings"
  ON promo_settings FOR DELETE
  USING (is_admin());

-- Insert default promo settings (enabled with New Years flyer)
INSERT INTO promo_settings (enabled, image_url)
VALUES (true, '/images/NewYears flyer2026.png')
ON CONFLICT DO NOTHING;

-- ============================================
-- 9. ADD ADMIN USER
-- Run this AFTER running the above schema
-- Replace 'YOUR_USER_ID' with actual user UUID from auth.users
-- ============================================
-- To find your user ID, run:
-- SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
--
-- Then insert the admin (replace YOUR_UUID with the id from above):
-- INSERT INTO admins (user_id, username) VALUES
--   ('YOUR_UUID', 'Jake');
