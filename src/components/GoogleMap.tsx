import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { useLocation } from '@/contexts/LocationContext';
import { mockVenues } from '@/data/mockVenues';
import { useToast } from '@/hooks/use-toast';

interface GoogleMapProps {
  selectedVenueId?: number | string;
  onVenueSelect?: (venueId: number | string) => void;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ selectedVenueId, onVenueSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const { userLocation, locationEnabled } = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: 'GOOGLE_MAPS_API_KEY', // This will be replaced by the secret
          version: 'weekly',
          libraries: ['places']
        });

        await loader.load();
        
        if (!mapRef.current) return;

        // Default to NYC if no user location
        const defaultCenter = { lat: 40.7589, lng: -73.9851 };
        const center = (locationEnabled && userLocation) ? userLocation : defaultCenter;

        const map = new google.maps.Map(mapRef.current, {
          zoom: 13,
          center,
          styles: [
            {
              "featureType": "all",
              "stylers": [
                { "saturation": -100 },
                { "gamma": 0.5 }
              ]
            }
          ]
        });

        mapInstanceRef.current = map;

        // Add user location marker if available
        if (locationEnabled && userLocation) {
          new google.maps.Marker({
            position: userLocation,
            map,
            title: 'Your Location',
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <circle cx="12" cy="12" r="4"/>
                  <path d="M21.17 8H19a2 2 0 01-2-2V3.83a2 2 0 012-2h2.17a2 2 0 012 2V6a2 2 0 01-2 2z"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(24, 24),
              fillColor: '#4285F4',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2
            }
          });
        }

        // Add venue markers
        markersRef.current = mockVenues.map(venue => {
          if (!venue.latitude || !venue.longitude) return null;

          const marker = new google.maps.Marker({
            position: { lat: venue.latitude, lng: venue.longitude },
            map,
            title: venue.name,
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(32, 32),
              fillColor: venue.vibeLevel === 'turnt' ? '#ff3b1f' : venue.vibeLevel === 'chill' ? '#b47aff' : '#4bd5ff',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2
            }
          });

          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="padding: 8px; max-width: 200px;">
                <h3 style="margin: 0 0 4px 0; font-weight: bold;">${venue.name}</h3>
                <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${venue.address}</p>
                <p style="margin: 0 0 4px 0; font-size: 12px;"><strong>Vibe:</strong> ${venue.vibeLevel}</p>
                <p style="margin: 0; font-size: 12px;"><strong>Music:</strong> ${venue.musicType}</p>
              </div>
            `
          });

          marker.addListener('click', () => {
            // Close other info windows
            markersRef.current.forEach(m => {
              if (m && m !== marker) {
                // Close info window if it exists
              }
            });
            
            infoWindow.open(map, marker);
            
            if (onVenueSelect) {
              onVenueSelect(venue.id);
            }
          });

          return marker;
        }).filter(Boolean) as google.maps.Marker[];

        setIsLoaded(true);

      } catch (error) {
        console.error('Error loading Google Maps:', error);
        toast({
          title: "Map Error",
          description: "Failed to load Google Maps. Please check your connection.",
          variant: "destructive"
        });
      }
    };

    initMap();
  }, [userLocation, locationEnabled, onVenueSelect, toast]);

  // Center map on selected venue
  useEffect(() => {
    if (selectedVenueId && mapInstanceRef.current && isLoaded) {
      const venue = mockVenues.find(v => v.id === selectedVenueId);
      if (venue && venue.latitude && venue.longitude) {
        mapInstanceRef.current.setCenter({ lat: venue.latitude, lng: venue.longitude });
        mapInstanceRef.current.setZoom(15);
      }
    }
  }, [selectedVenueId, isLoaded]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    />
  );
};

export default GoogleMap;