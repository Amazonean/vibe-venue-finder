-- Address security linter: set fixed search_path for created/updated functions

-- update_venue_vibe with fixed search_path
CREATE OR REPLACE FUNCTION public.update_venue_vibe()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
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
    WHERE v.venue_id = NEW.venue_id
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

  SELECT MAX(created_at) INTO newest_vote_time FROM public.votes WHERE venue_id = NEW.venue_id;

  UPDATE public.venues
  SET 
    current_vibe = COALESCE(recent_vibe, current_vibe),
    vote_count = vote_count + 1,
    last_updated = COALESCE(newest_vote_time, last_updated)
  WHERE id = NEW.venue_id;

  RETURN NEW;
END;
$$;

-- recompute_venue_vibe with fixed search_path
CREATE OR REPLACE FUNCTION public.recompute_venue_vibe(p_venue_id uuid)
RETURNS void
LANGUAGE plpgsql
SET search_path = public
AS $$
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
$$;

-- recompute_all_venue_vibes with fixed search_path
CREATE OR REPLACE FUNCTION public.recompute_all_venue_vibes()
RETURNS void
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE r record;
BEGIN
  FOR r IN SELECT id FROM public.venues LOOP
    PERFORM public.recompute_venue_vibe(r.id);
  END LOOP;
END;
$$;

-- set_vote_expires_at with fixed search_path
CREATE OR REPLACE FUNCTION public.set_vote_expires_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.expires_at IS NULL THEN
    NEW.expires_at := COALESCE(NEW.created_at, now()) + interval '2 hours 30 minutes';
  END IF;
  RETURN NEW;
END;
$$;