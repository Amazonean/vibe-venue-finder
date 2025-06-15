import React, { useState, useEffect } from 'react';
import VenueCard from '@/components/VenueCard';
import LocationPermission from '@/components/LocationPermission';
import FeaturedVenues from '@/components/FeaturedVenues';
import { mockFavoriteVenues } from '@/data/mockVenues';

const Favorites = () => {
  const [favoriteVenues, setFavoriteVenues] = useState(() => {
    // Load favorites from localStorage, fallback to mock data if none exist
    const saved = localStorage.getItem('favoriteVenues');
    return saved ? JSON.parse(saved) : mockFavoriteVenues;
  });
  const [locationEnabled, setLocationEnabled] = useState(false);

  useEffect(() => {
    // Save favorites to localStorage whenever favoriteVenues changes
    localStorage.setItem('favoriteVenues', JSON.stringify(favoriteVenues));
  }, [favoriteVenues]);

  useEffect(() => {
    // Check if geolocation is available and get current permission status
    if ("geolocation" in navigator) {
      // Try to get current position to check if permission is granted
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationEnabled(true);
        },
        () => {
          setLocationEnabled(false);
        },
        { timeout: 1000 }
      );
    }
  }, []);

  const handleLocationPermission = (granted: boolean) => {
    setLocationEnabled(granted);
  };

  const handleFavoriteChange = (venueId: number, isFavorited: boolean) => {
    if (!isFavorited) {
      // Remove venue from favorites when unfavorited
      setFavoriteVenues(prev => prev.filter(venue => venue.id !== venueId));
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 py-4">
        <h1 className="text-foreground text-[22px] font-bold leading-tight tracking-[-0.015em] pb-6">
          Your Favorites
        </h1>
        
        <FeaturedVenues />
        
        {!locationEnabled && favoriteVenues.length > 0 && (
          <LocationPermission onPermissionChange={handleLocationPermission} />
        )}
        
        <div className="space-y-4">
          {favoriteVenues.map(venue => (
            <VenueCard
              key={venue.id}
              venue={venue}
              showDistance={locationEnabled}
              isFavorite={true}
              onFavoriteChange={handleFavoriteChange}
            />
          ))}
        </div>

        {favoriteVenues.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-foreground mb-2">No favorites yet</h3>
            <p className="text-muted-foreground">
              Add venues to your favorites to see them here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;