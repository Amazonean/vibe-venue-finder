import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import VenuesSearchBar from '@/components/VenuesSearchBar';

import VenuesFilters from '@/components/VenuesFilters';
import VenuesLocationStatus from '@/components/VenuesLocationStatus';
import VenuesList from '@/components/VenuesList';

const mockVenues = [
  {
    id: 1,
    name: "The Underground",
    address: "123 Music St, Downtown",
    vibeLevel: "turnt" as const,
    distance: 0.8,
    musicType: "Electronic",
    venueType: "Clubs",
    voteCount: 127,
    lastUpdated: "2 min ago",
    description: "High-energy electronic music venue with amazing sound system"
  },
  {
    id: 2,
    name: "Rooftop Lounge",
    address: "456 Skyline Ave, Midtown",
    vibeLevel: "quiet" as const,
    distance: 1.2,
    musicType: "Jazz",
    venueType: "Rooftops",
    voteCount: 89,
    lastUpdated: "15 min ago",
    description: "Relaxed atmosphere with panoramic city views"
  },
  {
    id: 3,
    name: "Neon Nights",
    address: "789 Party Blvd, Entertainment District",
    vibeLevel: "chill" as const,
    distance: 2.1,
    musicType: "Pop/Hip-Hop",
    venueType: "Clubs",
    voteCount: 203,
    lastUpdated: "1 hour ago",
    description: "Popular nightclub with diverse music selection"
  },
  {
    id: 4,
    name: "Acoustic Corner",
    address: "321 Melody Lane, Arts Quarter",
    vibeLevel: "quiet" as const,
    distance: 1.7,
    musicType: "Live Acoustic",
    venueType: "Live Music",
    voteCount: 45,
    lastUpdated: "30 min ago",
    description: "Intimate venue featuring local acoustic artists"
  },
  {
    id: 5,
    name: "The Vintage Bar",
    address: "555 Classic St, Old Town",
    vibeLevel: "chill" as const,
    distance: 1.4,
    musicType: "Classic Rock",
    venueType: "Bars",
    voteCount: 78,
    lastUpdated: "45 min ago",
    description: "Cozy bar with vintage atmosphere and craft cocktails"
  },
  {
    id: 6,
    name: "Bella Vista Restaurant",
    address: "777 Dining Ave, Food District",
    vibeLevel: "quiet" as const,
    distance: 2.3,
    musicType: "Ambient",
    venueType: "Restaurants",
    voteCount: 156,
    lastUpdated: "1 hour ago",
    description: "Fine dining with live ambient music and city views"
  }
];

const Venues = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [maxDistance, setMaxDistance] = useState(5);
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'miles'>('km');
  const [selectedVenueTypes, setSelectedVenueTypes] = useState<string[]>([]);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [filteredVenues, setFilteredVenues] = useState(mockVenues);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Filter venues based on search query, distance, venue type, and vibe
    let filtered = mockVenues.filter(venue => 
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.musicType.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Apply distance filter if location is enabled
    if (locationEnabled) {
      filtered = filtered.filter(venue => venue.distance <= maxDistance);
    }

    // Apply venue type filter
    if (selectedVenueTypes.length > 0) {
      filtered = filtered.filter(venue => 
        selectedVenueTypes.includes(venue.venueType)
      );
    }

    // Apply vibe filter
    if (selectedVibes.length > 0) {
      filtered = filtered.filter(venue => 
        selectedVibes.includes(venue.vibeLevel)
      );
    }

    setFilteredVenues(filtered);
  }, [searchQuery, maxDistance, locationEnabled, selectedVenueTypes, selectedVibes]);

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

  const handleClearFilters = () => {
    setSelectedVenueTypes([]);
    setSelectedVibes([]);
    setMaxDistance(5);
    setDistanceUnit('km');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-background">
        <div className="max-w-md mx-auto px-4 py-4">
          <VenuesSearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          

          <VenuesFilters
            locationEnabled={locationEnabled}
            maxDistance={maxDistance}
            distanceUnit={distanceUnit}
            selectedVenueTypes={selectedVenueTypes}
            selectedVibes={selectedVibes}
            isFiltersOpen={isFiltersOpen}
            onToggleFilters={() => setIsFiltersOpen(!isFiltersOpen)}
            onDistanceChange={setMaxDistance}
            onDistanceUnitChange={setDistanceUnit}
            onVenueTypesChange={setSelectedVenueTypes}
            onVibesChange={setSelectedVibes}
            onClearFilters={handleClearFilters}
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