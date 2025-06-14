import React from 'react';
import { MapPin } from 'lucide-react';
import { Venue } from './types';

interface VenueInfoProps {
  venue: Venue;
}

const VenueInfo: React.FC<VenueInfoProps> = ({ venue }) => {
  return (
    <div className="flex-1 min-w-0">
      <h3 className="text-foreground text-sm font-bold leading-tight mb-1 break-words">
        {venue.name}
      </h3>
      <div className="flex items-start gap-1 text-xs text-muted-foreground">
        <MapPin className="h-3 w-3 flex-shrink-0 mt-0.5" />
        <span className="break-words">{venue.address}</span>
      </div>
    </div>
  );
};

export default VenueInfo;