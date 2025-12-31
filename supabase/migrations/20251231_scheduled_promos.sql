-- ============================================
-- SCHEDULED PROMOS TABLE
-- Supports multiple promos with date/time scheduling
-- ============================================

-- Drop old table if it exists (we're replacing it)
DROP TABLE IF EXISTS promo_settings;

-- Create new scheduled promos table
CREATE TABLE IF NOT EXISTS scheduled_promos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  priority INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE scheduled_promos ENABLE ROW LEVEL SECURITY;

-- Anyone can read scheduled promos (for the popup to show)
CREATE POLICY "Anyone can read scheduled promos"
  ON scheduled_promos FOR SELECT
  USING (true);

-- Only admins can insert scheduled promos
CREATE POLICY "Admins can insert scheduled promos"
  ON scheduled_promos FOR INSERT
  WITH CHECK (is_admin());

-- Only admins can update scheduled promos
CREATE POLICY "Admins can update scheduled promos"
  ON scheduled_promos FOR UPDATE
  USING (is_admin());

-- Only admins can delete scheduled promos
CREATE POLICY "Admins can delete scheduled promos"
  ON scheduled_promos FOR DELETE
  USING (is_admin());

-- Create index for efficient date queries
CREATE INDEX idx_scheduled_promos_dates ON scheduled_promos(start_date, end_date);
CREATE INDEX idx_scheduled_promos_active ON scheduled_promos(is_active);

-- Insert the New Years promo as the first scheduled promo
INSERT INTO scheduled_promos (name, image_url, start_date, end_date, is_active, priority)
VALUES (
  'New Years 2026',
  '/images/NewYears flyer2026.png',
  '2025-12-01 00:00:00+00',
  '2026-01-15 23:59:59+00',
  true,
  1
);
