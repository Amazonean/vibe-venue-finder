-- Make votes.venue_id nullable to support external places via place_id
ALTER TABLE public.votes
  ALTER COLUMN venue_id DROP NOT NULL;

-- Ensure at least one identifier is present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'votes_venue_or_place_not_null'
  ) THEN
    ALTER TABLE public.votes
      ADD CONSTRAINT votes_venue_or_place_not_null
      CHECK (venue_id IS NOT NULL OR place_id IS NOT NULL);
  END IF;
END $$;

-- Helpful index for venue-based lookups
CREATE INDEX IF NOT EXISTS idx_votes_user_venue_created_at
  ON public.votes (user_id, venue_id, created_at DESC);

-- Harden remaining functions with explicit search_path
CREATE OR REPLACE FUNCTION public.check_user_age()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.age < 18 THEN
    RAISE EXCEPTION 'Users must be 18 or older to register';
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_secret(secret_name text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF secret_name = 'GOOGLE_MAPS_API_KEY' THEN
    RETURN current_setting('app.google_maps_api_key', true);
  END IF;
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    username,
    display_name,
    full_name,
    age
  )
  VALUES (
    NEW.id,
    LOWER(SPLIT_PART(NEW.email, '@', 1) || SUBSTRING(NEW.id::text, 1, 6)),
    TRIM(CONCAT(
      NEW.raw_user_meta_data->>'first_name', 
      ' ', 
      NEW.raw_user_meta_data->>'last_name'
    )),
    NEW.raw_user_meta_data->>'full_name',
    (NEW.raw_user_meta_data->>'age')::integer
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_vote_expires_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.expires_at IS NULL THEN
    NEW.expires_at := COALESCE(NEW.created_at, now()) + interval '2 hours 30 minutes';
  END IF;
  RETURN NEW;
END;
$$;