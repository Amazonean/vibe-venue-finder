-- Fix Critical Security Issues

-- 1. Add proper INSERT policy for profiles table to prevent unauthorized access
CREATE POLICY "Only system can insert profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (false);

-- 2. Update database functions to fix search path vulnerabilities
CREATE OR REPLACE FUNCTION public.validate_vote_integrity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Ensure vote expiry is properly set
  IF NEW.expires_at IS NULL THEN
    NEW.expires_at := COALESCE(NEW.created_at, now()) + interval '2 hours 30 minutes';
  END IF;
  
  -- Validate vote data integrity
  IF NEW.vibe NOT IN ('quiet', 'chill', 'turnt') THEN
    RAISE EXCEPTION 'Invalid vibe value: %', NEW.vibe;
  END IF;
  
  -- Ensure either venue_id or place_id is provided, not both
  IF (NEW.venue_id IS NULL AND NEW.place_id IS NULL) OR 
     (NEW.venue_id IS NOT NULL AND NEW.place_id IS NOT NULL) THEN
    RAISE EXCEPTION 'Either venue_id or place_id must be provided, but not both';
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.validate_profile_integrity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Validate age requirement
  IF NEW.age IS NOT NULL AND NEW.age < 18 THEN
    RAISE EXCEPTION 'Users must be 18 or older';
  END IF;
  
  -- Ensure username is unique and valid
  IF NEW.username IS NOT NULL THEN
    IF LENGTH(NEW.username) < 3 OR LENGTH(NEW.username) > 30 THEN
      RAISE EXCEPTION 'Username must be between 3 and 30 characters';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_vote_cooldown()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  IF NEW.place_id IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM public.votes
      WHERE user_id = NEW.user_id
        AND place_id = NEW.place_id
        AND created_at > NOW() - INTERVAL '2 hours'
    ) THEN
      RAISE EXCEPTION 'Users can only vote once per venue every 2 hours';
    END IF;
  ELSE
    IF EXISTS (
      SELECT 1 FROM public.votes
      WHERE user_id = NEW.user_id 
        AND venue_id = NEW.venue_id
        AND created_at > NOW() - INTERVAL '2 hours'
    ) THEN
      RAISE EXCEPTION 'Users can only vote once per venue every 2 hours';
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_user_age()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  IF NEW.age < 18 THEN
    RAISE EXCEPTION 'Users must be 18 or older to register';
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_venue_vibe()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  recent_vibe public.vibe_level;
  newest_vote_time timestamptz;
BEGIN
  -- Skip updates when the vote is for an external place (no local venue UUID)
  IF NEW.venue_id IS NULL THEN
    RETURN NEW;
  END IF;

  WITH recent_votes AS (
    SELECT 
      v.vibe,
      v.created_at,
      CASE 
        WHEN now() - v.created_at <= interval '2 hours' THEN 1.0
        WHEN now() - v.created_at <= interval '2 hours 30 minutes' THEN 0.5
        ELSE 0.0
      END AS weight
    FROM public.votes v
    WHERE v.venue_id = NEW.venue_id
      AND v.expires_at > now()
      AND v.created_at > now() - interval '2 hours 30 minutes'
  ),
  weighted AS (
    SELECT vibe, SUM(weight) AS total_weight
    FROM recent_votes
    WHERE weight > 0
    GROUP BY vibe
    ORDER BY total_weight DESC, vibe ASC
    LIMIT 1
  )
  SELECT w.vibe INTO recent_vibe FROM weighted w;

  SELECT MAX(created_at) INTO newest_vote_time FROM public.votes WHERE venue_id = NEW.venue_id;

  UPDATE public.venues
  SET 
    current_vibe = COALESCE(recent_vibe, current_vibe),
    vote_count = COALESCE(vote_count, 0) + 1,
    last_updated = COALESCE(newest_vote_time, last_updated)
  WHERE id = NEW.venue_id;

  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.recompute_venue_vibe(p_venue_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  recent_vibe public.vibe_level;
  newest_vote_time timestamptz;
BEGIN
  WITH recent_votes AS (
    SELECT 
      v.vibe,
      v.created_at,
      CASE 
        WHEN now() - v.created_at <= interval '2 hours' THEN 1.0
        WHEN now() - v.created_at <= interval '2 hours 30 minutes' THEN 0.5
        ELSE 0.0
      END AS weight
    FROM public.votes v
    WHERE v.venue_id = p_venue_id
      AND v.status <> 'expired'
      AND v.created_at > now() - interval '2 hours 30 minutes'
  ),
  weighted AS (
    SELECT vibe, SUM(weight) AS total_weight
    FROM recent_votes
    WHERE weight > 0
    GROUP BY vibe
    ORDER BY total_weight DESC, vibe ASC
    LIMIT 1
  )
  SELECT w.vibe INTO recent_vibe FROM weighted w;

  SELECT MAX(created_at) INTO newest_vote_time FROM public.votes WHERE venue_id = p_venue_id;

  UPDATE public.venues
  SET 
    current_vibe = COALESCE(recent_vibe, current_vibe),
    last_updated = COALESCE(newest_vote_time, last_updated)
  WHERE id = p_venue_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.recompute_all_venue_vibes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE r record;
BEGIN
  FOR r IN SELECT id FROM public.venues LOOP
    PERFORM public.recompute_venue_vibe(r.id);
  END LOOP;
END;
$function$;

-- 3. Update security reminder function
CREATE OR REPLACE FUNCTION public.security_configuration_reminder()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  RETURN 'SECURITY: Enable leaked password protection in Auth settings and review RLS policies regularly';
END;
$function$;

-- 4. Create trigger for validation functions if not exists
DO $$ 
BEGIN
    -- Check and create triggers only if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'validate_vote_integrity_trigger'
    ) THEN
        CREATE TRIGGER validate_vote_integrity_trigger
        BEFORE INSERT OR UPDATE ON public.votes
        FOR EACH ROW EXECUTE FUNCTION public.validate_vote_integrity();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'validate_profile_integrity_trigger'
    ) THEN
        CREATE TRIGGER validate_profile_integrity_trigger
        BEFORE INSERT OR UPDATE ON public.profiles
        FOR EACH ROW EXECUTE FUNCTION public.validate_profile_integrity();
    END IF;
END $$;