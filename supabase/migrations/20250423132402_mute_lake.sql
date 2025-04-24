/*
  # Create clients table for consultation requests

  1. New Tables
    - `clients`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `phone` (text, required) 
      - `address` (text)
      - `message` (text)
      - `created_at` (timestamp with timezone)
      - `status` (text) - For tracking consultation status

  2. Security
    - Enable RLS on clients table
    - Add policy for inserting new client records
    - Add policy for reading client records
*/

CREATE TABLE clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
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