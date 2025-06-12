import React, { useState } from 'react';
import { MapPin, Music, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import VoteDialog from '@/components/VoteDialog';
import FavoriteButton from '@/components/FavoriteButton';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Venue {
  id: number | string;
  name: string;
  address: string;
  vibeLevel: 'chill' | 'decent' | 'turnt';
  distance: number;
  musicType: string;
  venueType: string;
  voteCount: number;
  lastUpdated: string;
  description: string;
}

interface VenueCardProps {
  venue: Venue;
  showDistance: boolean;
  isFavorite?: boolean;
  onFavoriteChange?: (venueId: number | string, isFavorited: boolean) => void;
}

const getVibeColor = (vibe: string) => {
  switch (vibe) {
    case 'chill':
      return 'bg-accent/20 text-accent-foreground border border-accent/30';
    case 'decent':
      return 'bg-secondary text-secondary-foreground border border-border';
    case 'turnt':
      return 'bg-primary/20 text-primary border border-primary/30';
    default:
      return 'bg-muted text-muted-foreground border border-border';
  }
};

const getVibeEmoji = (vibe: string) => {
  switch (vibe) {
    case 'chill':
      return '😌';
    case 'decent':
      return '🙂';
    case 'turnt':
      return '🔥';
    default:
      return '😐';
  }
};

const VenueCard: React.FC<VenueCardProps> = ({
  venue,
  showDistance,
  isFavorite = false,
  onFavoriteChange
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(isFavorite);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleVibeVote = async (vibe: 'turnt' | 'decent' | 'chill') => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to vote on venue vibes",
        variant: "destructive"
      });
      return;
    }

    try {
      // For mock venues (with number IDs), we'll use a placeholder UUID
      // In a real app, you'd need to map these or use real venue IDs
      const venueId = typeof venue.id === 'string' ? venue.id : '00000000-0000-0000-0000-000000000001';
      
      const { error } = await supabase
        .from('votes')
        .insert({
          user_id: user.id,
          venue_id: venueId,
          vibe: vibe
        });

      if (error) {
        if (error.message.includes('Users can only vote once per venue every 2 hours')) {
          toast({
            title: "Vote cooldown active",
            description: "You can only vote once per venue every 2 hours",
            variant: "destructive"
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Vote submitted!",
          description: `Thanks for voting ${vibe} for ${venue.name}`,
        });
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
      toast({
        title: "Error",
        description: "Failed to submit vote. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleFavorite = () => {
    const newFavoriteState = !isFavorited;
    setIsFavorited(newFavoriteState);
    onFavoriteChange?.(venue.id, newFavoriteState);
    // TODO: Implement actual favorite toggle logic
  };
  return (
    <Card className="bg-muted border-none p-4">
      <div className="flex gap-4 items-start">
        {/* Image Section */}
        <div 
          className="w-20 h-20 bg-center bg-cover bg-no-repeat flex-shrink-0 rounded-md" 
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=200&h=200&fit=crop")`
          }} 
        />
        
        {/* Content Section */}
        <div className="flex-1 flex flex-col justify-between min-h-[80px]">
          {/* Header Section */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-foreground text-sm font-bold leading-tight truncate mb-1">
                {venue.name}
              </h3>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{venue.address}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FavoriteButton 
                isFavorited={isFavorited}
                onToggle={toggleFavorite}
              />
              {showDistance && (
                <Badge variant="secondary" className="text-xs flex-shrink-0 bg-background border-border">
                  {venue.distance}km
                </Badge>
              )}
            </div>
          </div>
          
          {/* Middle Section - Badges */}
          <div className="flex items-center gap-2 my-2">
            <Badge className={`${getVibeColor(venue.vibeLevel)} text-xs font-medium`}>
              {getVibeEmoji(venue.vibeLevel)} {venue.vibeLevel}
            </Badge>
            <Badge variant="outline" className="text-xs border-border bg-background/50">
              {venue.venueType}
            </Badge>
          </div>
          
          {/* Bottom Section - Info and Vote */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Music className="h-3 w-3" />
                <span>{venue.musicType}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{venue.voteCount}</span>
              </div>
            </div>
            <VoteDialog 
              venueName={venue.name}
              isOpen={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              onVibeVote={handleVibeVote}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VenueCard;