import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { mockVenues } from '@/data/mockVenues';
import VenueCard from '@/components/VenueCard';
import LocationPermission from '@/components/LocationPermission';
import VenueTypeFilter from '@/components/VenueTypeFilter';
import VibeFilter from '@/components/VibeFilter';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import VenuesSearchBar from '@/components/VenuesSearchBar';
import ProximityFilter from '@/components/ProximityFilter';
import { useLocation } from '@/contexts/LocationContext';
import { calculateDistance } from '@/utils/distanceCalculator';
import { useNearbyPlaces } from '@/hooks/useNearbyPlaces';

const Venues = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVenueTypes, setSelectedVenueTypes] = useState<string[]>([]);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filteredVenues, setFilteredVenues] = useState(mockVenues);
  const [maxDistance, setMaxDistance] = useState(10);
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'miles'>('km');
  const [searchLocation, setSearchLocation] = useState<{lat: number, lng: number} | null>(null);
  const { locationEnabled, userLocation, setLocationEnabled, setUserLocation } = useLocation();
  const { toast } = useToast();

  // Derived location and Places API params
  const referenceLocation = searchLocation || userLocation;

  const { includedTypes, keyword } = React.useMemo(() => {
    const typeMap: Record<string, string[]> = {
      'Clubs': ['night_club'],
      'Bars': ['bar'],
      'Restaurants': ['restaurant'],
      'Live Music': ['bar', 'night_club'],
      'Lounges': ['bar'],
      'Rooftops': ['bar', 'restaurant'],
      'Dance Halls': ['night_club'],
    };
    const kw: string[] = [];
    const types = new Set<string>();
    selectedVenueTypes.forEach((t) => {
      (typeMap[t] || []).forEach((v) => types.add(v));
      if (t === 'Lounges') kw.push('lounge');
      if (t === 'Rooftops') kw.push('rooftop');
      if (t === 'Live Music') kw.push('live music');
      if (t === 'Dance Halls') kw.push('dance hall');
    });
    return {
      includedTypes: types.size ? Array.from(types) : ['bar','night_club','restaurant'],
      keyword: kw.length ? kw.join(' ') : undefined,
    };
  }, [selectedVenueTypes]);

  const radiusMeters = React.useMemo(() => {
    const meters = distanceUnit === 'km' ? maxDistance * 1000 : maxDistance * 1609.34;
    return Math.min(Math.max(Math.round(meters), 1), 16093);
  }, [maxDistance, distanceUnit]);

  const nearbyQuery = useNearbyPlaces({
    location: referenceLocation || null,
    radiusMeters,
    includedTypes,
    keyword,
    enabled: Boolean(referenceLocation),
  });

  const places = React.useMemo(() => {
    return nearbyQuery.data?.pages.flatMap((p: any) => p?.places ?? []) ?? [];
  }, [nearbyQuery.data]);

  const placesAsVenues = React.useMemo(() => {
    return places.map((p: any) => {
      const lat = p.location?.latitude;
      const lng = p.location?.longitude;
      const distance = (referenceLocation && lat && lng)
        ? calculateDistance(referenceLocation.lat, referenceLocation.lng, lat, lng, distanceUnit)
        : 0;
      const type = p.types?.includes('night_club') ? 'Clubs'
        : p.types?.includes('bar') ? 'Bars'
        : p.types?.includes('restaurant') ? 'Restaurants'
        : 'Venue';
      return {
        id: p.id,
        name: p.displayName?.text ?? 'Unknown',
        address: p.formattedAddress ?? '',
        vibeLevel: 'chill',
        distance,
        musicType: 'varied',
        venueType: type,
        voteCount: 0,
        lastUpdated: '',
        description: '',
        imageUrl: p.photoUrl,
        latitude: lat,
        longitude: lng,
      };
    });
  }, [places, referenceLocation, distanceUnit]);

  const displayVenues = (referenceLocation ? placesAsVenues : filteredVenues);


  useEffect(() => {
    // Filter venues based on search query, venue type, vibe, and distance
    let filtered = mockVenues;

    // Apply search filter (only if no location search is active)
    if (searchQuery && !searchLocation) {
      filtered = filtered.filter(venue => 
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.musicType.toLowerCase().includes(searchQuery.toLowerCase())
      );
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

    // Apply distance filter if location is available
    const referenceLocation = searchLocation || userLocation;
    if (referenceLocation && (locationEnabled || searchLocation)) {
      filtered = filtered.filter(venue => {
        if (venue.latitude && venue.longitude) {
          const distance = calculateDistance(
            referenceLocation.lat,
            referenceLocation.lng,
            venue.latitude,
            venue.longitude,
            distanceUnit
          );
          return distance <= maxDistance;
        }
        return false;
      });
    }

    setFilteredVenues(filtered);
  }, [searchQuery, selectedVenueTypes, selectedVibes, maxDistance, distanceUnit, userLocation, locationEnabled, searchLocation]);

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

  const handleLocationSelect = (location: {lat: number, lng: number}, placeName: string) => {
    setSearchLocation(location);
    setSearchQuery('');
    toast({
      title: "Location selected",
      description: `Searching venues near ${placeName}`,
    });
  };

  const handleClearFilters = () => {
    setSelectedVenueTypes([]);
    setSelectedVibes([]);
    setSearchQuery('');
    setSearchLocation(null);
  };

  const hasActiveFilters = selectedVenueTypes.length > 0 || selectedVibes.length > 0;
  const filterCount = selectedVenueTypes.length + selectedVibes.length;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-background">
        <div className="max-w-md mx-auto px-4 py-4">
          {/* Search Bar */}
          <VenuesSearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onLocationSelect={handleLocationSelect}
          />

          {/* Filters Toggle */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="flex items-center gap-2 bg-muted border-none text-foreground"
              size="sm"
            >
              <Filter className="h-4 w-4" />
              Filters {filterCount > 0 && `(${filterCount})`}
            </Button>
            
            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={handleClearFilters}
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                size="sm"
              >
                <X className="h-3 w-3" />
                Clear
              </Button>
            )}
          </div>

          {/* Filters Panel */}
          {isFiltersOpen && (
            <Card className="mb-4 p-4 bg-muted border-none">
              <div className="space-y-6">
                <ProximityFilter
                  maxDistance={maxDistance}
                  unit={distanceUnit}
                  onDistanceChange={setMaxDistance}
                  onUnitChange={setDistanceUnit}
                  enabled={locationEnabled || searchLocation !== null}
                />
                
                <Separator className="bg-border" />
                
                <VenueTypeFilter
                  selectedTypes={selectedVenueTypes}
                  onTypeChange={setSelectedVenueTypes}
                />
                
                <Separator className="bg-border" />
                
                <VibeFilter
                  selectedVibes={selectedVibes}
                  onVibeChange={setSelectedVibes}
                />
              </div>
            </Card>
          )}
        </div>
      </div>

      <div className="max-w-md mx-auto px-4">
        {!locationEnabled && (
          <LocationPermission onPermissionChange={handleLocationPermission} />
        )}
        
        <h2 className="text-foreground text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
          {(locationEnabled || searchLocation) ? 'Nearby Venues' : 'Popular Venues'}
        </h2>
        {nearbyQuery.isError && (
          <div className="text-sm text-destructive mb-3">
            Failed to fetch nearby venues. Please try again.
          </div>
        )}
        <div className="space-y-4">
          {displayVenues.map(venue => (
            <VenueCard
              key={venue.id}
              venue={venue}
              showDistance={Boolean(referenceLocation)}
            />
          ))}
        </div>

        {referenceLocation && displayVenues.length === 0 && !nearbyQuery.isLoading && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-foreground mb-2">No venues found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or expanding the distance
            </p>
          </div>
        )}

        {referenceLocation && nearbyQuery.hasNextPage && (
          <div className="flex justify-center mt-4">
            <Button
              onClick={() => nearbyQuery.fetchNextPage()}
              disabled={nearbyQuery.isFetchingNextPage}
              variant="outline"
            >
              {nearbyQuery.isFetchingNextPage ? 'Loading…' : 'Load more venues'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Venues;