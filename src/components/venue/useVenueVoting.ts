import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from '@/contexts/LocationContext';
import { useToast } from '@/hooks/use-toast';
import { isUserAtVenue } from '@/utils/venueDistance';
import { Venue } from './types';
import { useNavigate } from 'react-router-dom';
export const useVenueVoting = (venue: Venue) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  const { locationEnabled, userLocation } = useLocation();
  const { toast } = useToast();
  const navigate = useNavigate();

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
      // For mock venues (with number IDs), we'll use a placeholder UUID
      // In a real app, you'd need to map these or use real venue IDs
      const venueId = typeof venue.id === 'string' ? venue.id : '00000000-0000-0000-0000-000000000001';
      console.log('Using venue ID:', venueId);
      
      console.log('Attempting to insert vote...');
      const { error } = await supabase
        .from('votes')
        .insert({
          user_id: user.id,
          venue_id: venueId,
          vibe: vibe
        });

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
    handleVibeVote
  };
};