import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import VenueCard from '@/components/VenueCard';
import LocationPermission from '@/components/LocationPermission';
import DistanceFilter from '@/components/DistanceFilter';

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
      {/* Header */}
      <div className="bg-background">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pl-12">
              Nightlife
            </h2>
            <div className="flex w-12 items-center justify-end">
              {!locationEnabled && (
                <Button 
                  onClick={requestLocation}
                  variant="ghost" 
                  size="sm"
                  className="flex items-center gap-2 text-white p-0"
                >
                  <Navigation className="h-6 w-6" />
                </Button>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="py-3">
            <label className="flex flex-col min-w-40 h-12 w-full">
              <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                <div className="text-muted-foreground flex border-none bg-muted items-center justify-center pl-4 rounded-l-xl border-r-0">
                  <Search className="h-6 w-6" />
                </div>
                <Input
                  placeholder="Search for venues"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-muted focus:border-none h-full placeholder:text-muted-foreground px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                />
              </div>
            </label>
          </div>

          {/* Popular Categories */}
          <div className="flex gap-3 flex-wrap mb-4">
            <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-muted pl-4 pr-4">
              <p className="text-white text-sm font-medium leading-normal">Clubs</p>
            </div>
            <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-muted pl-4 pr-4">
              <p className="text-white text-sm font-medium leading-normal">Bars</p>
            </div>
            <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-muted pl-4 pr-4">
              <p className="text-white text-sm font-medium leading-normal">Restaurants</p>
            </div>
            <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-muted pl-4 pr-4">
              <p className="text-white text-sm font-medium leading-normal">Live Music</p>
            </div>
          </div>

          {/* Distance Filter Toggle */}
          {locationEnabled && (
            <Button
              variant="outline"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="flex items-center gap-2 mb-4 bg-muted border-none text-white"
              size="sm"
            >
              <Filter className="h-4 w-4" />
              Distance Filter ({maxDistance}km)
            </Button>
          )}

          {/* Distance Filter */}
          {isFiltersOpen && locationEnabled && (
            <Card className="mb-4 p-4 bg-muted border-none">
              <DistanceFilter
                maxDistance={maxDistance}
                onDistanceChange={setMaxDistance}
                enabled={locationEnabled}
              />
            </Card>
          )}

          {/* Location Status */}
          {locationEnabled && userLocation && (
            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Showing venues within {maxDistance}km of your location</span>
            </div>
          )}
        </div>
      </div>

      {/* Venues List */}
      <div className="px-4">
        {!locationEnabled && (
          <LocationPermission onPermissionChange={handleLocationPermission} />
        )}
        
        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
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
            <h3 className="text-lg font-medium text-white mb-2">No venues found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or increasing the distance filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Venues;