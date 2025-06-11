import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import VenuesHeader from '@/components/VenuesHeader';
import VenuesSearchBar from '@/components/VenuesSearchBar';
import PopularCategories from '@/components/PopularCategories';
import VenuesFilters from '@/components/VenuesFilters';
import VenuesLocationStatus from '@/components/VenuesLocationStatus';
import VenuesList from '@/components/VenuesList';

// Mock venue data for demonstration
const mockVenues = [
  {
    id: 1,
    name: "The Underground",
    address: "123 Music St, Downtown",
    vibeLevel: "turnt" as const,
    distance: 0.8,
    musicType: "Electronic",
    voteCount: 127,
    lastUpdated: "2 min ago",
    description: "High-energy electronic music venue with amazing sound system"
  },
  {
    id: 2,
    name: "Rooftop Lounge",
    address: "456 Skyline Ave, Midtown",
    vibeLevel: "chill" as const,
    distance: 1.2,
    musicType: "Jazz",
    voteCount: 89,
    lastUpdated: "15 min ago",
    description: "Relaxed atmosphere with panoramic city views"
  },
  {
    id: 3,
    name: "Neon Nights",
    address: "789 Party Blvd, Entertainment District",
    vibeLevel: "decent" as const,
    distance: 2.1,
    musicType: "Pop/Hip-Hop",
    voteCount: 203,
    lastUpdated: "1 hour ago",
    description: "Popular nightclub with diverse music selection"
  },
  {
    id: 4,
    name: "Acoustic Corner",
    address: "321 Melody Lane, Arts Quarter",
    vibeLevel: "chill" as const,
    distance: 1.7,
    musicType: "Live Acoustic",
    voteCount: 45,
    lastUpdated: "30 min ago",
    description: "Intimate venue featuring local acoustic artists"
  }
];

const Venues = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [maxDistance, setMaxDistance] = useState(5);
  const [filteredVenues, setFilteredVenues] = useState(mockVenues);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Filter venues based on search query and distance
    let filtered = mockVenues.filter(venue => 
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.musicType.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (locationEnabled) {
      filtered = filtered.filter(venue => venue.distance <= maxDistance);
    }

    setFilteredVenues(filtered);
  }, [searchQuery, maxDistance, locationEnabled]);

  const handleLocationPermission = (granted: boolean, location?: {lat: number, lng: number}) => {
    setLocationEnabled(granted);
    setUserLocation(location || null);
    
    if (granted) {
      toast({
        title: "Location enabled",
        description: "Now showing venues near you",
      });
    }
  };

  const requestLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          handleLocationPermission(true, location);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location access denied",
            description: "You can still search venues by city",
            variant: "destructive"
          });
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-background">
        <div className="max-w-md mx-auto px-4 py-4">
          <VenuesHeader />

          <VenuesSearchBar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <PopularCategories />

          <VenuesFilters
            locationEnabled={locationEnabled}
            maxDistance={maxDistance}
            isFiltersOpen={isFiltersOpen}
            onToggleFilters={() => setIsFiltersOpen(!isFiltersOpen)}
            onDistanceChange={setMaxDistance}
          />

          <VenuesLocationStatus
            locationEnabled={locationEnabled}
            userLocation={userLocation}
            maxDistance={maxDistance}
          />
        </div>
      </div>

      <div className="max-w-md mx-auto px-4">
        <VenuesList
          venues={filteredVenues}
          locationEnabled={locationEnabled}
          onLocationPermissionChange={handleLocationPermission}
        />
      </div>
    </div>
  );
};

export default Venues;