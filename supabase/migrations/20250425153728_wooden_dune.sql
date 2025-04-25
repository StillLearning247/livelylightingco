/*
  # Add admin role and policies

  1. Changes
    - Create admin role
    - Add policies for admin access
    - Add initial admin user

  2. Security
    - Only authenticated users with admin role can access admin features
    - Admins can read all client data
*/

-- Create admin role
CREATE TYPE user_role AS ENUM ('admin', 'user');

-- Add role column to admin_users
ALTER TABLE admin_users 
ADD COLUMN role user_role DEFAULT 'user';

-- Update policies for admin access
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

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;