/*
  # Fix admin authentication and add indexes

  1. Changes
    - Drop dependent policies first
    - Update admin_users table structure
    - Recreate policies and indexes
    - Update trigger for new users

  2. Security
    - Maintain RLS
    - Recreate all necessary policies
*/

-- First drop the dependent policies
DROP POLICY IF EXISTS "Allow admins to read all clients" ON clients;
DROP POLICY IF EXISTS "Enable read access for admin users" ON clients;

-- Now we can safely modify the admin_users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_admin_user();

ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own data" ON admin_users;
DROP POLICY IF EXISTS "Allow authenticated users to read their own admin data" ON admin_users;
DROP POLICY IF EXISTS "Allow authenticated users to update their own admin data" ON admin_users;

-- Update the admin_users table
ALTER TABLE admin_users 
  ALTER COLUMN role SET DEFAULT 'user',
  ALTER COLUMN created_at SET DEFAULT now(),
  ADD CONSTRAINT admin_users_auth_fk 
    FOREIGN KEY (id) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE;

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Recreate policies for admin_users
CREATE POLICY "Users can read own data"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

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

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_users_id ON admin_users(id);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Recreate function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_admin_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.admin_users (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_admin_user();

-- Recreate the client policies that depend on admin_users
CREATE POLICY "Allow admins to read all clients"
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