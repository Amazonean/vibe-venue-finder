import React from 'react';
import { Card } from '@/components/ui/card';
import VenueInfo from './venue/VenueInfo';
import VenueBadges from './venue/VenueBadges';
import VenueActions from './venue/VenueActions';
import VenueStats from './venue/VenueStats';
import { useVenueVoting } from './venue/useVenueVoting';
import { useFavorites } from './venue/useFavorites';
import { VenueCardProps } from './venue/types';

const VenueCard: React.FC<VenueCardProps> = ({
  venue,
  showDistance,
  isFavorite = false,
  onFavoriteChange
}) => {
  const { isDialogOpen, setIsDialogOpen, handleVibeVote } = useVenueVoting(venue);
  const { isFavorited, toggleFavorite } = useFavorites(venue, isFavorite, onFavoriteChange);

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
            <VenueInfo venue={venue} />
            <VenueActions 
              showDistance={showDistance}
              distance={venue.distance}
              isFavorited={isFavorited}
              onToggleFavorite={toggleFavorite}
            />
          </div>
          
          {/* Middle Section - Badges */}
          <VenueBadges venue={venue} />
          
          {/* Bottom Section - Info and Vote */}
          <VenueStats 
            venue={venue}
            isDialogOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onVibeVote={handleVibeVote}
          />
        </div>
      </div>
    </Card>
  );
};

export default VenueCard;