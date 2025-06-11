import React from 'react';
import { MapPin } from 'lucide-react';

interface VenuesLocationStatusProps {
  locationEnabled: boolean;
  userLocation: {lat: number, lng: number} | null;
  maxDistance: number;
}

const VenuesLocationStatus: React.FC<VenuesLocationStatusProps> = ({
  locationEnabled,
  userLocation,
  maxDistance
}) => {
  if (!locationEnabled || !userLocation) return null;

  return (
    <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
      <MapPin className="h-4 w-4" />
      <span>Showing venues within {maxDistance}km of your location</span>
    </div>
  );
};

export default VenuesLocationStatus;