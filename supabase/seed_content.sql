-- Seed script for LivelyLightingCo CMS
-- Run this in Supabase SQL Editor to populate the database

-- =====================================================
-- SITE CONTENT (uses UPSERT - safe to run multiple times)
-- =====================================================

INSERT INTO site_content (page, section, content, updated_at) VALUES
('home', 'hero_title', 'Govee Permanent Outdoor Lighting. Expertly Installed', NOW())
ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

INSERT INTO site_content (page, section, content, updated_at) VALUES
('home', 'hero_subtitle', 'Year-round custom lighting. No hassle or ugly wires. All controlled from your phone. Installed by Govee lighting experts.', NOW())
ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

INSERT INTO site_content (page, section, content, updated_at) VALUES
('home', 'floating_banner', '*BEST PRICE GUARANTEE* We will beat any quote from Jellyfish, Trimlight, Oelo or Gemstone (Astoria).', NOW())
ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

INSERT INTO site_content (page, section, content, updated_at) VALUES
('home', 'gallery_title', 'Our Work', NOW())
ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

INSERT INTO site_content (page, section, content, updated_at) VALUES
('home', 'gallery_description', 'Browse our gallery of beautiful lighting installations. Each project is custom designed to complement the home''s architecture.', NOW())
ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

INSERT INTO site_content (page, section, content, updated_at) VALUES
('home', 'testimonials_title', 'What Our Customers Say', NOW())
ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

INSERT INTO site_content (page, section, content, updated_at) VALUES
('home', 'testimonials_description', 'Don''t just take our word for it. Here''s what homeowners think about our service.', NOW())
ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

INSERT INTO site_content (page, section, content, updated_at) VALUES
('home', 'difference_title', 'Why Choose LivelyLightingCo', NOW())
ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

INSERT INTO site_content (page, section, content, updated_at) VALUES
('home', 'difference_description', 'Don''t let a bad installation ruin your investment. We bring unmatched expertise to every project.', NOW())
ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

-- About Page
INSERT INTO site_content (page, section, content, updated_at) VALUES
('about', 'page_title', 'About LivelyLightingCo', NOW())
ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

INSERT INTO site_content (page, section, content, updated_at) VALUES
('about', 'page_subtitle', 'Austin''s Premier Govee Permanent Lighting Installers', NOW())
ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

INSERT INTO site_content (page, section, content, updated_at) VALUES
('about', 'mission_title', 'Our Mission', NOW())
ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

INSERT INTO site_content (page, section, content, updated_at) VALUES
('about', 'mission_text', 'To provide homeowners with beautiful, professional permanent lighting installations that enhance their homes year-round.', NOW())
ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

INSERT INTO site_content (page, section, content, updated_at) VALUES
('about', 'service_area_title', 'Service Area', NOW())
ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

INSERT INTO site_content (page, section, content, updated_at) VALUES
('about', 'service_area_intro', 'We proudly serve Austin, Cedar Park, Round Rock, and surrounding areas in Central Texas.', NOW())
ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

INSERT INTO site_content (page, section, content, updated_at) VALUES
('about', 'service_areas_list', 'Austin, Round Rock, Cedar Park, Georgetown, Pflugerville, Leander, Buda, Kyle, Lakeway', NOW())
ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

-- Footer
INSERT INTO site_content (page, section, content, updated_at) VALUES
('footer', 'tagline', 'Experience Govee Light Installations at an Affordable Price.', NOW())
ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

INSERT INTO site_content (page, section, content, updated_at) VALUES
('footer', 'phone', '(512)-809-7323', NOW())
ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

INSERT INTO site_content (page, section, content, updated_at) VALUES
('footer', 'email', 'contact@livelylightingco.com', NOW())
ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

INSERT INTO site_content (page, section, content, updated_at) VALUES
('footer', 'hours', 'Mon-Fri: 9am-6pm', NOW())
ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

INSERT INTO site_content (page, section, content, updated_at) VALUES
('footer', 'service_area', 'Austin, TX and surrounding areas', NOW())
ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

INSERT INTO site_content (page, section, content, updated_at) VALUES
('footer', 'facebook_url', 'https://facebook.com/livelylightingco', NOW())
ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

INSERT INTO site_content (page, section, content, updated_at) VALUES
('footer', 'youtube_url', 'https://www.youtube.com/channel/UChIr1JGEiGCqtX_2fl1gfNQ', NOW())
ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

-- Contact Page
INSERT INTO site_content (page, section, content, updated_at) VALUES
('contact', 'form_title', 'Request a Free Quote', NOW())
ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

INSERT INTO site_content (page, section, content, updated_at) VALUES
('contact', 'consultation_title', 'Get Your Free Consultation', NOW())
ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

INSERT INTO site_content (page, section, content, updated_at) VALUES
('contact', 'consultation_description', 'Fill out the form and we''ll get back to you within 24 hours to schedule your free in-home consultation.', NOW())
ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

-- =====================================================
-- GALLERY IMAGES (delete existing and re-insert to avoid duplicates)
-- =====================================================

DELETE FROM gallery_images;

INSERT INTO gallery_images (cloudinary_public_id, cloudinary_hires_id, title, alt_text, display_order, is_active) VALUES
('House1_upqaeq', 'House1_phnaes', '', 'Govee permanent outdoor lighting installation', 1, true),
('House3_800_zjggld', 'House3_oeyopl', '', 'Govee permanent outdoor lighting installation', 2, true),
('House4_800_wrgrqf', 'House4_wt2d0m', '', 'Govee permanent outdoor lighting installation', 3, true),
('House5_ltz96r', 'House5_2400_v7p3an', '', 'Govee permanent outdoor lighting installation', 4, true),
('House6_800_kdubrl', 'House6_kmwq4e', '', 'Govee permanent outdoor lighting installation', 5, true),
('Daytime_Browntrack_850_jad2il', 'Daytime_Browntrack_vr2o7q', '', 'Govee permanent outdoor lighting - daytime view', 6, true),
('Daytime_Govee_with_tracks_1000_msetko', 'Daytime_Govee_with_tracks_hjzvd0', '', 'Govee permanent outdoor lighting with tracks', 7, true),
('uplcose_tracks_1000_ierp3c', 'Uplcose_Tracks_HIFI_qto8wx', '', 'Close-up of Govee lighting track system', 8, true);

-- =====================================================
-- TESTIMONIALS (delete existing and re-insert to avoid duplicates)
-- =====================================================

DELETE FROM testimonials;

INSERT INTO testimonials (name, location, quote, rating, display_order, is_active) VALUES
('Jennifer S.', 'Austin, TX', 'LivelyLightingCo transformed our home! The install was quick and professional – and we love controlling the lights with our phone. Our neighbors keep asking where we got our lights done.', 5, 1, true),
('Michael T.', 'Round Rock, TX', 'Jakob and his team were fantastic from start to finish. No more climbing ladders for holidays! The lights look clean and professional during the day and absolutely stunning at night.', 5, 2, true),
('Sarah & David', 'Cedar Park, TX', 'We tried installing Govee lights ourselves first and it was a disaster. LivelyLightingCo fixed everything and installed them properly with their track system. Worth every penny!', 5, 3, true);

-- =====================================================
-- VERIFY DATA WAS INSERTED
-- =====================================================
SELECT 'site_content' as table_name, COUNT(*) as row_count FROM site_content
UNION ALL
SELECT 'gallery_images', COUNT(*) FROM gallery_images
UNION ALL
SELECT 'testimonials', COUNT(*) FROM testimonials;
