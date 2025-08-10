-- 1) Types for statuses and notification types
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vote_status') THEN
    CREATE TYPE public.vote_status AS ENUM ('active','stale','expired');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vote_notification_type') THEN
    CREATE TYPE public.vote_notification_type AS ENUM ('refresh_prompt','expired');
  END IF;
END $$;

-- 2) Alter votes table: add status, notified_at, expires_at (generated)
ALTER TABLE public.votes
  ADD COLUMN IF NOT EXISTS status public.vote_status NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS notified_at timestamptz;

-- Generated column for expiry (2h 30m after creation). If it already exists but not generated, skip silently
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'votes' AND column_name = 'expires_at'
  ) THEN
    ALTER TABLE public.votes
      ADD COLUMN expires_at timestamptz GENERATED ALWAYS AS (created_at + interval '2 hours 30 minutes') STORED;
  END IF;
END $$;

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_votes_venue_created_at ON public.votes (venue_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_votes_user_venue ON public.votes (user_id, venue_id);

-- 3) Push subscriptions for Web Push
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  endpoint text NOT NULL UNIQUE,
  p256dh text NOT NULL,
  auth text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS: users manage their own subscriptions
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'push_subscriptions' AND policyname = 'Users can manage own push subscriptions'
  ) THEN
    CREATE POLICY "Users can manage own push subscriptions"
      ON public.push_subscriptions
      FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- 4) Vote notifications log
CREATE TABLE IF NOT EXISTS public.vote_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vote_id uuid NOT NULL,
  user_id uuid NOT NULL,
  venue_id uuid NOT NULL,
  type public.vote_notification_type NOT NULL,
  message text,
  sent_at timestamptz NOT NULL DEFAULT now(),
  responded boolean NOT NULL DEFAULT false
);

ALTER TABLE public.vote_notifications ENABLE ROW LEVEL SECURITY;

-- RLS: users can view their own notifications (service role will bypass for inserts)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'vote_notifications' AND policyname = 'Users can view own vote notifications'
  ) THEN
    CREATE POLICY "Users can view own vote notifications"
      ON public.vote_notifications
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user ON public.push_subscriptions (user_id);
CREATE INDEX IF NOT EXISTS idx_vote_notifications_vote ON public.vote_notifications (vote_id);

-- 5) Update trigger function to compute weighted vibe (1.0 <=2h, 0.5 until 2h30m, exclude expired)
CREATE OR REPLACE FUNCTION public.update_venue_vibe()
RETURNS trigger
LANGUAGE plpgsql
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

-- 6) Functions to recompute vibes (for scheduled/edge function use)
CREATE OR REPLACE FUNCTION public.recompute_venue_vibe(p_venue_id uuid)
RETURNS void
LANGUAGE plpgsql
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

CREATE OR REPLACE FUNCTION public.recompute_all_venue_vibes()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE r record;
BEGIN
  FOR r IN SELECT id FROM public.venues LOOP
    PERFORM public.recompute_venue_vibe(r.id);
  END LOOP;
END;
$$;

-- 7) Utility trigger to maintain updated_at on push_subscriptions
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_push_subscriptions_updated ON public.push_subscriptions;
CREATE TRIGGER trg_push_subscriptions_updated
BEFORE UPDATE ON public.push_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();