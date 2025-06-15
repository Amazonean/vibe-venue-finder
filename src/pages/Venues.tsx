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

const Venues = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [selectedVenueTypes, setSelectedVenueTypes] = useState<string[]>([]);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filteredVenues, setFilteredVenues] = useState(mockVenues);
  const [maxDistance, setMaxDistance] = useState(10);
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'miles'>('km');
  const { toast } = useToast();

  useEffect(() => {
    // Filter venues based on search query, venue type, and vibe
    let filtered = mockVenues.filter(venue => 
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.musicType.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
  }, [searchQuery, selectedVenueTypes, selectedVibes]);

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
    setUserLocation(location);
    setLocationEnabled(true);
    // Clear venue name search when selecting a location
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
                  enabled={locationEnabled}
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
          {locationEnabled ? 'Nearby Venues' : 'Popular Venues'}
        </h2>
        
        <div className="space-y-4">
          {filteredVenues.map(venue => (
            <VenueCard
              key={venue.id}
              venue={venue}
              showDistance={locationEnabled}
            />
          ))}
        </div>

        {filteredVenues.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-foreground mb-2">No venues found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Venues;