/*
  # Lead attribution fields + analytics events

  1. Changes to `clients`
    - `lead_source` (text, nullable) — how the customer heard about us
    - `sales_code` (text, nullable) — optional promo code entered at submission

  2. New table `analytics_events`
    - Tracks page views and form-start events for the conversion funnel
    - `id` uuid PK
    - `event_type` text — e.g. 'page_view', 'form_start'
    - `page` text — which page was viewed
    - `session_id` text — anonymous client-generated id stored in localStorage
    - `created_at` timestamptz

  3. Security
    - Allow anonymous INSERT into analytics_events (needed for tracking)
    - Allow admins to SELECT (same pattern as clients)
*/

-- 1. Lead attribution columns
ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS lead_source text,
  ADD COLUMN IF NOT EXISTS sales_code text;

CREATE INDEX IF NOT EXISTS idx_clients_lead_source ON clients(lead_source);

-- 2. Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  page text,
  session_id text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON analytics_events(session_id);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous visitors) can insert events
CREATE POLICY "Anyone can insert analytics events"
  ON analytics_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admins can read events
CREATE POLICY "Admins can read analytics events"
  ON analytics_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
    )
  );
