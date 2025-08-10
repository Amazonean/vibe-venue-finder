-- Fix previous failure: replace generated column with trigger-based default for expires_at
-- 1) Add expires_at as a normal column with default, if missing
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'votes' AND column_name = 'expires_at'
  ) THEN
    ALTER TABLE public.votes
      ADD COLUMN expires_at timestamptz;
  END IF;
END $$;

-- Set default to now() + 2h30m (applies to inserts that don't set it)
ALTER TABLE public.votes ALTER COLUMN expires_at SET DEFAULT (now() + interval '2 hours 30 minutes');

-- 2) Ensure a trigger sets expires_at based on created_at when provided
CREATE OR REPLACE FUNCTION public.set_vote_expires_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- If expires_at not provided explicitly, derive from created_at
  IF NEW.expires_at IS NULL THEN
    NEW.expires_at := COALESCE(NEW.created_at, now()) + interval '2 hours 30 minutes';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_votes_set_expires ON public.votes;
CREATE TRIGGER trg_votes_set_expires
BEFORE INSERT ON public.votes
FOR EACH ROW
EXECUTE FUNCTION public.set_vote_expires_at();