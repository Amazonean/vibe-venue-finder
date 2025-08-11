import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from '@/contexts/LocationContext';
import { useToast } from '@/hooks/use-toast';
import { isUserAtVenue } from '@/utils/venueDistance';
import { Venue } from './types';
import { useNavigate } from 'react-router-dom';
import { MOCK_VENUE_IDS, ensureMockVenuesInDatabase } from '@/utils/mockVenues';
const isUuid = (val: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val);

export const useVenueVoting = (venue: Venue) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  const { locationEnabled, userLocation } = useLocation();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [hasActiveVote, setHasActiveVote] = useState(false);
  const [activeVoteExpiresAt, setActiveVoteExpiresAt] = useState<Date | null>(null);
  const [activeVoteVibe, setActiveVoteVibe] = useState<'turnt' | 'chill' | 'quiet' | null>(null);
  const [remainingTime, setRemainingTime] = useState<string>('');

  // Fetch latest vote to determine active vote window
  useEffect(() => {
    const fetchActiveVote = async () => {
      if (!user) {
        setHasActiveVote(false);
        setActiveVoteExpiresAt(null);
        setActiveVoteVibe(null);
        setRemainingTime('');
        return;
      }
      try {
        // Determine whether we have a local UUID or an external Google Place ID
        let venueUuid: string | null = null;
        let placeId: string | null = null;
        if (typeof venue.id === 'string') {
          if (isUuid(venue.id)) venueUuid = venue.id; else placeId = venue.id;
        } else {
          venueUuid = '00000000-0000-0000-0000-000000000001';
        }

        let query = supabase
          .from('votes')
          .select('vibe, created_at')
          .eq('user_id', user.id);
        if (venueUuid) query = query.eq('venue_id', venueUuid);
        if (placeId) query = query.eq('place_id', placeId);

        const { data, error } = await query
          .order('created_at', { ascending: false })
          .limit(1);
        if (error) {
          console.warn('Error fetching latest vote:', error.message);
          return;
        }
        if (data && data.length > 0) {
          const latest = data[0] as { vibe: 'turnt' | 'chill' | 'quiet'; created_at: string };
          const createdAt = new Date(latest.created_at);
          const expiresAt = new Date(createdAt.getTime() + 2 * 60 * 60 * 1000);
          if (expiresAt.getTime() > Date.now()) {
            setHasActiveVote(true);
            setActiveVoteVibe(latest.vibe);
            setActiveVoteExpiresAt(expiresAt);
          } else {
            setHasActiveVote(false);
            setActiveVoteVibe(null);
            setActiveVoteExpiresAt(null);
          }
        } else {
          setHasActiveVote(false);
          setActiveVoteVibe(null);
          setActiveVoteExpiresAt(null);
        }
      } catch (e) {
        console.warn('Failed to evaluate active vote:', e);
      }
    };
    fetchActiveVote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, venue.id]);

  // Tick remaining time while active
  useEffect(() => {
    const format = (ms: number) => {
      const totalSeconds = Math.max(0, Math.floor(ms / 1000));
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;
      if (h > 0) return `${h}h ${m}m`;
      if (m > 0) return `${m}m ${s}s`;
      return `${s}s`;
    };

    if (!activeVoteExpiresAt || !hasActiveVote) {
      setRemainingTime('');
      return;
    }

    const update = () => {
      const ms = activeVoteExpiresAt.getTime() - Date.now();
      if (ms <= 0) {
        setHasActiveVote(false);
        setActiveVoteVibe(null);
        setActiveVoteExpiresAt(null);
        setRemainingTime('');
      } else {
        setRemainingTime(format(ms));
      }
    };

    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [activeVoteExpiresAt, hasActiveVote]);

  const handleVibeVote = async (vibe: 'turnt' | 'chill' | 'quiet'): Promise<boolean> => {
    console.log('Vote button clicked for vibe:', vibe, 'venue:', venue.name);
    
    if (!user) {
      console.log('User not authenticated');
      toast({
        title: "Authentication required",
        description: "Please sign in to vote on venue vibes",
        variant: "destructive"
      });
      return false;
    }

    // Check if location is enabled
    if (!locationEnabled || !userLocation) {
      toast({
        title: "Location required",
        description: "Please enable location services to vote on venue vibes",
        variant: "destructive"
      });
      return false;
    }

    // Check if user is at the venue (within 200 meters)
    if (venue.latitude && venue.longitude) {
      const atVenue = isUserAtVenue(
        userLocation.lat,
        userLocation.lng,
        venue.latitude,
        venue.longitude
      );

      if (!atVenue) {
        toast({
          title: "Too far from venue",
          description: "You must be at the venue to vote on its vibe",
          variant: "destructive"
        });
        // Close dialog and redirect to venues page
        setIsDialogOpen(false);
        navigate('/venues');
        return false;
      }
    }

    console.log('User authenticated:', user.id);

    try {
      // Determine whether we have a local UUID or an external Google Place ID
      let venueUuid: string | null = null;
      let placeId: string | null = null;
      if (typeof venue.id === 'string') {
        if (isUuid(venue.id)) venueUuid = venue.id; else placeId = venue.id;
      } else {
        venueUuid = '00000000-0000-0000-0000-000000000001';
      }
      console.log('Using identifiers - venueUuid:', venueUuid, 'placeId:', placeId);

      // If voting on a mock venue UUID, ensure venue exists in DB to satisfy downstream logic
      if (venueUuid && (MOCK_VENUE_IDS as readonly string[]).includes(venueUuid)) {
        await ensureMockVenuesInDatabase(userLocation);
      }
      
      console.log('Attempting to insert vote...');
      const payload: any = {
        user_id: user.id,
        vibe
      };
      if (venueUuid) payload.venue_id = venueUuid;
      if (placeId) payload.place_id = placeId;

      const { error } = await supabase
        .from('votes')
        .insert(payload);

      console.log('Insert result - error:', error);

      if (error) {
        if (error.message.includes('Users can only vote once per venue every 2 hours')) {
          toast({
            title: "Vote cooldown active",
            description: "You can only vote once per venue every 2 hours",
            variant: "destructive"
          });
        } else {
          console.error('Vote error:', error);
          throw error;
        }
        return false;
      } else {
        console.log('Vote successful!');
        toast({
          title: "Vote submitted!",
          description: `Thanks for voting ${vibe} for ${venue.name}`,
        });
        // Set active vote state until expiry (2 hours)
        setHasActiveVote(true);
        setActiveVoteVibe(vibe);
        setActiveVoteExpiresAt(new Date(Date.now() + 2 * 60 * 60 * 1000));
        // Let VoteDialog decide whether to show thank-you
        return true;
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
      toast({
        title: "Error",
        description: "Failed to submit vote. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    handleVibeVote,
    hasActiveVote,
    remainingTime,
    activeVoteVibe,
  };
};