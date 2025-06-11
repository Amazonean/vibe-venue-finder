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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Discover Venues</h1>
              <p className="text-muted-foreground mt-2">Find the perfect vibe for tonight</p>
            </div>
            {!locationEnabled && (
              <Button 
                onClick={requestLocation}
                variant="outline" 
                className="flex items-center gap-2"
              >
                <Navigation className="h-4 w-4" />
                Enable Location
              </Button>
            )}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search venues, music types, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="flex items-center gap-2 sm:w-auto"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Distance Filter */}
          {isFiltersOpen && (
            <Card className="mt-4 p-4">
              <DistanceFilter
                maxDistance={maxDistance}
                onDistanceChange={setMaxDistance}
                enabled={locationEnabled}
              />
            </Card>
          )}

          {/* Location Status */}
          {locationEnabled && userLocation && (
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Showing venues within {maxDistance}km of your location</span>
            </div>
          )}
        </div>
      </div>

      {/* Venues Grid */}
      <div className="container mx-auto px-4 py-8">
        {!locationEnabled && (
          <LocationPermission onPermissionChange={handleLocationPermission} />
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              Try adjusting your search terms or increasing the distance filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Venues;