/*
  # Fix Schema and Policies

  1. Changes
    - Add missing RLS policies for admin_users table
    - Add missing RLS policies for clients table
    - Fix foreign key relationship between admin_users and auth.users
    - Add proper indexes for performance

  2. Security
    - Enable RLS on both tables
    - Add policies for proper access control
    - Ensure admin users can access required data
*/

-- Fix admin_users table policies
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read their own admin data"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Allow authenticated users to update their own admin data"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Fix clients table policies
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Allow admins to read all clients
CREATE POLICY "Enable read access for admin users"
  ON clients
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

-- Allow anyone to insert clients (for contact form)
CREATE POLICY "Enable insert for anonymous users"
  ON clients
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_users_id ON admin_users(id);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON clients(created_at);

-- Ensure proper foreign key relationship
ALTER TABLE admin_users
  DROP CONSTRAINT IF EXISTS admin_users_id_fkey,
  ADD CONSTRAINT admin_users_id_fkey 
  FOREIGN KEY (id) 
  REFERENCES auth.users(id)
  ON DELETE CASCADE;