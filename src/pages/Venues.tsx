import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { mockVenues } from '@/data/mockVenues';
import VenueCard from '@/components/VenueCard';
import LocationPermission from '@/components/LocationPermission';
import VenueTypeFilter from '@/components/VenueTypeFilter';
import VibeFilter from '@/components/VibeFilter';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Venues = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [selectedVenueTypes, setSelectedVenueTypes] = useState<string[]>([]);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filteredVenues, setFilteredVenues] = useState(mockVenues);
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
          <div className="py-3">
            <div className="flex flex-col min-w-40 h-12 w-full">
              <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                <div className="text-muted-foreground flex border-none bg-muted items-center justify-center pl-4 rounded-l-xl border-r-0">
                  <Search className="h-6 w-6" />
                </div>
                <Input
                  placeholder="Search venues, locations, music types..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-foreground focus:outline-0 focus:ring-0 border-none bg-muted focus:border-none h-full placeholder:text-muted-foreground px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                />
              </div>
            </div>
          </div>

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