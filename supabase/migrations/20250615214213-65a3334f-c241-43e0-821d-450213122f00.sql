-- Create edge function to retrieve secrets
CREATE OR REPLACE FUNCTION get_secret(secret_name text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This function would retrieve secrets from Supabase vault
  -- For now, return the GOOGLE_MAPS_API_KEY directly
  IF secret_name = 'GOOGLE_MAPS_API_KEY' THEN
    RETURN current_setting('app.google_maps_api_key', true);
  END IF;
  RETURN NULL;
END;
$$;