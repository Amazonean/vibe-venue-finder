-- Add support for Google Place IDs in votes and wire triggers
-- 1) Add place_id column for external venues
ALTER TABLE public.votes
ADD COLUMN IF NOT EXISTS place_id text;

-- 2) Helpful index for lookups
CREATE INDEX IF NOT EXISTS idx_votes_user_place_created_at
  ON public.votes (user_id, place_id, created_at DESC);

-- 3) Update cooldown logic to consider either venue_id (uuid) or place_id (text)
CREATE OR REPLACE FUNCTION public.check_vote_cooldown()
RETURNS trigger
LANGUAGE plpgsql
AS $$
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
$$;

-- 4) Ensure set_vote_expires_at remains as-is (already present)
-- 5) Update venue vibe updater to no-op when venue_id is NULL (external place with only place_id)
CREATE OR REPLACE FUNCTION public.update_venue_vibe()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
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
$$;

-- 6) Create triggers (none currently exist)
DROP TRIGGER IF EXISTS trg_votes_check_cooldown ON public.votes;
CREATE TRIGGER trg_votes_check_cooldown
BEFORE INSERT ON public.votes
FOR EACH ROW EXECUTE FUNCTION public.check_vote_cooldown();

DROP TRIGGER IF EXISTS trg_votes_set_expires_at ON public.votes;
CREATE TRIGGER trg_votes_set_expires_at
BEFORE INSERT ON public.votes
FOR EACH ROW EXECUTE FUNCTION public.set_vote_expires_at();

DROP TRIGGER IF EXISTS trg_votes_update_venue ON public.votes;
CREATE TRIGGER trg_votes_update_venue
AFTER INSERT ON public.votes
FOR EACH ROW EXECUTE FUNCTION public.update_venue_vibe();