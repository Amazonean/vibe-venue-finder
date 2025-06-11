import React from 'react';
import VenueCard from '@/components/VenueCard';
import LocationPermission from '@/components/LocationPermission';

interface Venue {
  id: number;
  name: string;
  address: string;
  vibeLevel: 'chill' | 'decent' | 'turnt';
  distance: number;
  musicType: string;
  voteCount: number;
  lastUpdated: string;
  description: string;
}

interface VenuesListProps {
  venues: Venue[];
  locationEnabled: boolean;
  onLocationPermissionChange: (granted: boolean, location?: {lat: number, lng: number}) => void;
}

const VenuesList: React.FC<VenuesListProps> = ({
  venues,
  locationEnabled,
  onLocationPermissionChange
}) => {
  return (
    <div>
      {!locationEnabled && (
        <LocationPermission onPermissionChange={onLocationPermissionChange} />
      )}
      
      <h2 className="text-foreground text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
        {locationEnabled ? 'Nearby Venues' : 'Popular Venues'}
      </h2>
      
      <div className="space-y-4">
        {venues.map(venue => (
          <VenueCard
            key={venue.id}
            venue={venue}
            showDistance={locationEnabled}
          />
        ))}
      </div>

      {venues.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-foreground mb-2">No venues found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or increasing the distance filter
          </p>
        </div>
      )}
    </div>
  );
};

export default VenuesList;