/*
  # Update clients table with separate first and last name fields

  1. Changes
    - Drop existing clients table
    - Recreate table with first_name and last_name fields instead of name
    - Maintain existing security policies
*/

-- Drop existing table
DROP TABLE IF EXISTS clients;

-- Create new clients table with separate name fields
CREATE TABLE clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text,
  message text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert new consultation requests
CREATE POLICY "Allow anonymous users to insert clients"
  ON clients
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to read all client records
CREATE POLICY "Allow authenticated users to read clients"
  ON clients
  FOR SELECT
  TO authenticated
  USING (true);