-- Restrict public access to personal data in profiles table
BEGIN;

-- Drop overly permissive public read policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

COMMIT;