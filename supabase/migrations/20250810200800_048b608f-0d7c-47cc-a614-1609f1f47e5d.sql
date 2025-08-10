-- Fix update_venue_vibe function: remove reference to non-existent column v.status and use expires_at instead
CREATE OR REPLACE FUNCTION public.update_venue_vibe()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
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