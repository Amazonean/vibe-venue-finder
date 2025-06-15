import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import VenuesSearchBar from '@/components/VenuesSearchBar';
import VenuesFilters from '@/components/VenuesFilters';
import VenuesLocationStatus from '@/components/VenuesLocationStatus';
import VenuesList from '@/components/VenuesList';
import { mockVenues } from '@/data/mockVenues';
import { getVenueDistance } from '@/utils/distanceCalculator';

const Venues = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [searchLocation, setSearchLocation] = useState<{lat: number, lng: number} | null>(null);
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

    // Apply distance filter if location is enabled or search location is set
    if (locationEnabled || searchLocation) {
      filtered = filtered.map(venue => ({
        ...venue,
        distance: getVenueDistance(venue, searchLocation, userLocation, distanceUnit)
      })).filter(venue => venue.distance <= maxDistance);
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
  }, [searchQuery, maxDistance, locationEnabled, searchLocation, userLocation, distanceUnit, selectedVenueTypes, selectedVibes]);

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

  const handleLocationSelect = (location: {lat: number, lng: number}, placeName: string) => {
    setSearchLocation(location);
    toast({
      title: "Search location set",
      description: `Now showing venues near ${placeName}`,
    });
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
            onLocationSelect={handleLocationSelect}
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