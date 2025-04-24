/*
  # Update clients table schema and policies

  1. Changes
    - Drop existing clients table if it exists
    - Recreate clients table with proper structure
    - Add RLS policies for secure access

  2. Table Structure
    - `id` (uuid, primary key)
    - `name` (text, required)
    - `email` (text, required)
    - `phone` (text, required)
    - `address` (text, optional)
    - `message` (text, optional)
    - `status` (text, defaults to 'pending')
    - `created_at` (timestamp with timezone)

  3. Security
    - Enable RLS
    - Allow anonymous users to insert
    - Allow authenticated users to read all records
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS clients;

-- Create new clients table
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