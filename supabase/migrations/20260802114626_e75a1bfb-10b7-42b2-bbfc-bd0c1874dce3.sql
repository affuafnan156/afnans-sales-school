
-- Add an explicit customer role and make it the default for everyone.
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'customer';

-- No default/automatic admin accounts: remove the owner auto-grant trigger + function.
DROP TRIGGER IF EXISTS grant_owner_admin ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_grant_owner_admin ON auth.users;
DROP FUNCTION IF EXISTS public.grant_owner_admin() CASCADE;

-- Customers can never write to user_roles: only service_role (server-side admin code) may.
REVOKE INSERT, UPDATE, DELETE ON public.user_roles FROM authenticated, anon;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

DROP POLICY IF EXISTS "admins read all roles" ON public.user_roles;
CREATE POLICY "admins read all roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));
