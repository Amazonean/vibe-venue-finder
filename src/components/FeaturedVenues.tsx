import React from 'react';
import { Star } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockVenues } from '@/data/mockVenues';

const FeaturedVenues = () => {
  const featuredVenues = mockVenues.filter(venue => venue.isFeatured);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
        <h2 className="text-lg font-semibold text-foreground">Featured Venues</h2>
      </div>
      
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {featuredVenues.map((venue) => (
            <CarouselItem key={venue.id} className="pl-2 md:pl-4 basis-4/5 md:basis-1/2">
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-sm text-foreground leading-tight">
                        {venue.name}
                      </h3>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs flex-shrink-0 ml-2 ${
                          venue.vibeLevel === 'turnt' 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                            : venue.vibeLevel === 'chill'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}
                      >
                        {venue.vibeLevel}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {venue.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{venue.musicType}</span>
                      <span className="text-muted-foreground">{venue.voteCount} votes</span>
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