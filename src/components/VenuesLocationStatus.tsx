import React from 'react';
import { MapPin } from 'lucide-react';

interface VenuesLocationStatusProps {
  locationEnabled: boolean;
  userLocation: { lat: number; lng: number } | null;
  maxDistance: number;
  distanceUnit: 'km' | 'miles';
  searchLocation?: { lat: number; lng: number } | null;
}

const VenuesLocationStatus: React.FC<VenuesLocationStatusProps> = ({
  locationEnabled,
  userLocation,
  maxDistance,
  distanceUnit,
  searchLocation
}) => {
  if (!locationEnabled && !searchLocation) return null;

  const locationText = searchLocation ? 'selected location' : 'your location';
  
  return (
    <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
      <MapPin className="h-4 w-4" />
      <span>Showing venues within {maxDistance}{distanceUnit} of {locationText}</span>
    </div>
  );
};

export default VenuesLocationStatus;