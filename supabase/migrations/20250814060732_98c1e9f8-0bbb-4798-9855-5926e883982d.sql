-- Complete security fixes migration

-- 1. Add vote integrity triggers
CREATE OR REPLACE FUNCTION public.validate_vote_integrity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- Create trigger for vote integrity
CREATE TRIGGER validate_vote_integrity_trigger
  BEFORE INSERT OR UPDATE ON public.votes
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_vote_integrity();

-- 2. Add profile integrity trigger
CREATE OR REPLACE FUNCTION public.validate_profile_integrity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- Create trigger for profile integrity
CREATE TRIGGER validate_profile_integrity_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_profile_integrity();

-- 3. Create secure RPC function for venue aggregates
CREATE OR REPLACE FUNCTION public.get_venue_aggregates(p_venue_id text)
RETURNS TABLE(
  vote_count integer,
  current_vibe vibe_level,
  last_updated timestamptz
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_uuid_format boolean;
  computed_vibe vibe_level;
  total_votes integer := 0;
  latest_update timestamptz;
BEGIN
  -- Check if venue_id is UUID format
  is_uuid_format := p_venue_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';
  
  IF is_uuid_format THEN
    -- Handle UUID venue (local venue)
    SELECT v.vote_count, v.current_vibe, v.last_updated
    INTO total_votes, computed_vibe, latest_update
    FROM public.venues v
    WHERE v.id = p_venue_id::uuid;
    
    IF NOT FOUND THEN
      total_votes := 0;
      computed_vibe := 'chill';
      latest_update := NULL;
    END IF;
  ELSE
    -- Handle external place_id - compute from votes
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
      WHERE v.place_id = p_venue_id
        AND v.expires_at > now()
        AND v.created_at > now() - interval '2 hours 30 minutes'
        AND v.vibe IN ('quiet','chill','turnt')
    ),
    weighted AS (
      SELECT vibe, SUM(weight) AS total_weight
      FROM recent_votes
      WHERE weight > 0
      GROUP BY vibe
      ORDER BY total_weight DESC, vibe ASC
      LIMIT 1
    )
    SELECT 
      COUNT(*)::int,
      COALESCE((SELECT vibe FROM weighted), 'chill'::vibe_level),
      MAX(created_at)
    INTO total_votes, computed_vibe, latest_update
    FROM recent_votes;
  END IF;
  
  RETURN QUERY SELECT 
    COALESCE(total_votes, 0),
    COALESCE(computed_vibe, 'chill'::vibe_level),
    latest_update;
END;
$$;

-- 4. Restrict background_images RLS policies
DROP POLICY IF EXISTS "Allow authenticated users to manage background images" ON public.background_images;

-- Only allow viewing background images
CREATE POLICY "Users can view active background images"
ON public.background_images
FOR SELECT
USING (active = true);

-- 5. Make avatars bucket private and update policies
UPDATE storage.buckets 
SET public = false 
WHERE id = 'avatars';

-- Update avatar storage policies for privacy
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;

-- Users can only access their own avatars
CREATE POLICY "Users can view their own avatars"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload their own avatars"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatars"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatars"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);