import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface LocationPermissionProps {
  onPermissionChange: (granted: boolean, location?: {lat: number, lng: number}) => void;
}

const LocationPermission: React.FC<LocationPermissionProps> = ({ onPermissionChange }) => {
  const requestLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          onPermissionChange(true, location);
        },
        (error) => {
          console.error("Error getting location:", error);
          onPermissionChange(false);
        }
      );
    } else {
      onPermissionChange(false);
    }
  };

  return (
    <Card className="mb-6 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <MapPin className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl">Discover Nearby Venues</CardTitle>
        <CardDescription className="text-base">
          Enable location access to find the best venues around you with real-time distance calculations
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Button 
          onClick={requestLocation}
          size="lg" 
          className="mb-4 bg-primary hover:bg-primary/90"
        >
          <Navigation className="h-4 w-4 mr-2" />
          Enable Location Access
        </Button>
        <p className="text-sm text-muted-foreground">
          Or search for venues in specific cities using the search bar above
        </p>
      </CardContent>
    </Card>
  );
};

export default LocationPermission;