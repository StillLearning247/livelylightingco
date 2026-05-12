/*
  # Fix clients INSERT policy for authenticated users

  The previous policies only allowed the `anon` role to INSERT, which blocked
  logged-in admins from submitting via the public consultation form. This
  unifies the policy to allow both roles.
*/

DROP POLICY IF EXISTS "Allow anonymous users to insert clients" ON clients;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON clients;

CREATE POLICY "Anyone can submit a consultation"
  ON clients
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
