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
      const { data, error } = await supabase
        .rpc('get_venue_aggregates', { p_venue_id: venueId });
      
      if (!error && data && data.length > 0) {
        const aggregates = data[0];
        setVoteCount(aggregates.vote_count ?? 0);
        setVibeLevel(aggregates.current_vibe as Vibe ?? 'chill');
      }
    } catch (e) {
      console.error('Error fetching venue aggregates:', e);
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
