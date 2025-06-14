import React from 'react';
import { Badge } from '@/components/ui/badge';
import FavoriteButton from '@/components/FavoriteButton';

interface VenueActionsProps {
  showDistance: boolean;
  distance: number;
  isFavorited: boolean;
  onToggleFavorite: () => void;
}

const VenueActions: React.FC<VenueActionsProps> = ({
  showDistance,
  distance,
  isFavorited,
  onToggleFavorite
}) => {
  return (
    <div className="flex items-start gap-2 flex-shrink-0">
      <FavoriteButton 
        isFavorited={isFavorited}
        onToggle={onToggleFavorite}
      />
      {showDistance && (
        <Badge variant="secondary" className="text-xs flex-shrink-0 bg-background border-border whitespace-nowrap">
          {distance}km
        </Badge>
      )}
    </div>
  );
};

export default VenueActions;