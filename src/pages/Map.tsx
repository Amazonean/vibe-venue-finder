import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import GoogleMap from '@/components/GoogleMap';

const Map = () => {
  const [searchParams] = useSearchParams();
  const [selectedVenueId, setSelectedVenueId] = useState<number | string | undefined>();

  useEffect(() => {
    const venueId = searchParams.get('venue');
    if (venueId) {
      setSelectedVenueId(venueId);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="flex items-center justify-center py-4 px-4 border-b border-border bg-sidebar">
          <h1 className="text-foreground text-lg font-bold">Map</h1>
        </div>
        
        {/* Map Container */}
        <div className="flex-1 relative">
          <GoogleMap 
            selectedVenueId={selectedVenueId}
            onVenueSelect={setSelectedVenueId}
          />
        </div>
        
        {/* Bottom spacing for navigation */}
        <div className="h-20"></div>
      </div>
    </div>
  );
};

export default Map;