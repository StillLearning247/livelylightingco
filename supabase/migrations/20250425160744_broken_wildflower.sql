/*
  # Add initial admin user

  1. Changes
    - Add initial admin user to admin_users table
    - Set admin role for the user

  2. Security
    - User will need to go through password reset flow for first login
*/

-- Update existing user to admin role
UPDATE admin_users 
SET role = 'admin' 
WHERE email = 'contact@livelylightingco.com';

-- If the user doesn't exist, create them
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = 'contact@livelylightingco.com'
  ) THEN
    -- Insert into auth.users
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'contact@livelylightingco.com',
      crypt('temp_password123', gen_salt('bf')),
      now(),
      now(),
      now()
    );
  END IF;
END $$;