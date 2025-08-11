import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Venue } from './types';

const isUuid = (val: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val);

type Vibe = 'quiet' | 'chill' | 'turnt';

export function useVenueAggregates(venue: Venue) {
  const [voteCount, setVoteCount] = useState<number>(venue.voteCount ?? 0);
  const [vibeLevel, setVibeLevel] = useState<Vibe>(venue.vibeLevel ?? 'chill');

  const venueId = useMemo(() => String(venue.id), [venue.id]);

  const fetchAggregates = async () => {
    try {
      if (isUuid(venueId)) {
        const { data, error } = await supabase
          .from('venues')
          .select('vote_count, current_vibe')
          .eq('id', venueId)
          .maybeSingle();
        if (!error && data) {
          setVoteCount(data.vote_count ?? 0);
          if (data.current_vibe) setVibeLevel(data.current_vibe as Vibe);
        }
      } else {
        const since = new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString();
        const { data, error } = await supabase
          .from('votes')
          .select('vibe, created_at')
          .eq('place_id', venueId)
          .gte('created_at', since)
          .limit(500);
        if (!error && data) {
          const weights: Record<Vibe, number> = { quiet: 0, chill: 0, turnt: 0 };
          data.forEach((row: any) => {
            const created = new Date(row.created_at).getTime();
            const ageMs = Date.now() - created;
            const weight = ageMs <= 2 * 60 * 60 * 1000 ? 1 : 0.5;
            const v = row.vibe as Vibe;
            weights[v] = (weights[v] ?? 0) + weight;
          });
          setVoteCount(data.length);
          let best: Vibe = 'chill';
          let bestVal = -1;
          (['turnt','chill','quiet'] as Vibe[]).forEach(v => {
            const val = weights[v] ?? 0;
            if (val > bestVal) { bestVal = val; best = v; }
          });
          setVibeLevel(data.length > 0 ? best : venue.vibeLevel);
        }
      }
    } catch (e) {
      // no-op
    }
  };

  useEffect(() => {
    fetchAggregates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venueId]);

  useEffect(() => {
    const filter = isUuid(venueId)
      ? `venue_id=eq.${venueId}`
      : `place_id=eq.${venueId}`;

    const channel = supabase
      .channel(`votes-agg-${venueId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votes', filter }, () => {
        fetchAggregates();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venueId]);

  return { voteCount, vibeLevel, refetch: fetchAggregates };
}
