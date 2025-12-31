-- ============================================
-- PROMO SETTINGS TABLE
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
