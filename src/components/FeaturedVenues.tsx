import React from 'react';
import { Star } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocation } from '@/contexts/LocationContext';
import { useNearbyPlaces } from '@/hooks/useNearbyPlaces';
import { calculateDistance } from '@/utils/distanceCalculator';
import { useNavigate } from 'react-router-dom';

const FeaturedVenues = () => {
  const { userLocation, locationEnabled } = useLocation();
  const referenceLocation = locationEnabled && userLocation ? userLocation : null;
  const navigate = useNavigate();

  const nearby = useNearbyPlaces({
    location: referenceLocation,
    radiusMeters: 16093, // 10 miles
    includedTypes: ['bar','night_club','restaurant'],
    enabled: Boolean(referenceLocation),
  });

  const places = nearby.data?.pages.flatMap((p: any) => p?.places ?? []) ?? [];
  const featuredVenues = React.useMemo(() => {
    const mapped = places.map((p: any) => {
      const lat = p.location?.latitude;
      const lng = p.location?.longitude;
      const distance = (referenceLocation && lat && lng)
        ? calculateDistance(referenceLocation.lat, referenceLocation.lng, lat, lng, 'miles')
        : 0;
      return {
        id: p.id,
        name: p.displayName?.text ?? 'Unknown',
        description: p.formattedAddress ?? '',
        musicType: (p.types?.includes('night_club') && 'Clubs') || (p.types?.includes('bar') && 'Bars') || (p.types?.includes('restaurant') && 'Restaurants') || 'Venue',
        voteCount: 0,
        vibeLevel: 'chill' as const,
        photoUrl: p.photoUrl,
        distance,
      };
    });
    return mapped.sort((a: any, b: any) => (a.distance ?? 0) - (b.distance ?? 0)).slice(0, 5);
  }, [places, referenceLocation]);

  if (!referenceLocation) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
        <h2 className="text-lg font-semibold text-foreground">Featured Venues</h2>
      </div>
      
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {featuredVenues.map((venue: any) => (
            <CarouselItem key={venue.id} className="pl-2 md:pl-4 basis-4/5 md:basis-1/2">
              <Card className="border-border cursor-pointer transition hover:shadow-md" onClick={() => navigate(`/map?venue=${venue.id}`)}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-sm text-foreground leading-tight">
                        {venue.name}
                      </h3>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs flex-shrink-0 ml-2`}
                      >
                        {venue.vibeLevel}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {venue.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{venue.musicType}</span>
                      <span className="text-muted-foreground">{venue.distance} miles</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  );
};

export default FeaturedVenues;