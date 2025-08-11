-- Harden function search_path for security
CREATE OR REPLACE FUNCTION public.check_vote_cooldown()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
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