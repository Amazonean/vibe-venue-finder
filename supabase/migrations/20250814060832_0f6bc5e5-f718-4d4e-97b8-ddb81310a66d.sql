-- Enable leaked password protection for enhanced security
-- This prevents users from using passwords that have been leaked in data breaches

-- Enable leaked password protection
-- Note: This is configured at the project level through the auth configuration
-- The SQL migration cannot directly change this setting, but we can create
-- a reminder function for documentation purposes

CREATE OR REPLACE FUNCTION public.security_configuration_reminder()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN 'SECURITY REMINDER: Enable leaked password protection in Supabase Auth settings';
END;
$$;

COMMENT ON FUNCTION public.security_configuration_reminder() IS 
'This function serves as a reminder that leaked password protection should be enabled in the Supabase dashboard under Authentication > Settings > Password Protection';