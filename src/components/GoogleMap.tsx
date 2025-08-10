import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { useLocation } from '@/contexts/LocationContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getMockNearbyPlaces } from '@/utils/mockVenues';
declare global {
  interface Window {
    google: any;
  }
}

interface GoogleMapProps {
  selectedVenueId?: number | string;
  onVenueSelect?: (venueId: number | string) => void;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ selectedVenueId, onVenueSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const { userLocation, locationEnabled } = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const initMap = async () => {
      try {
        // Get the API key from Supabase function
        const { data: { GOOGLE_MAPS_API_KEY } } = await supabase.functions.invoke('get-secret', {
          body: { name: 'GOOGLE_MAPS_API_KEY' }
        });

        const loader = new Loader({
          apiKey: GOOGLE_MAPS_API_KEY,
          version: 'weekly',
          libraries: ['places']
        });

        await loader.load();
        
        if (!mapRef.current) return;

        // Default to NYC if no user location
        const defaultCenter = { lat: 40.7589, lng: -73.9851 };
        const center = (locationEnabled && userLocation) ? userLocation : defaultCenter;

          const map = new (window as any).google.maps.Map(mapRef.current, {
            zoom: 13,
            center,
            mapTypeId: (window as any).google.maps.MapTypeId.TERRAIN,
          });

        mapInstanceRef.current = map;

        // Add user location marker if available
        if (locationEnabled && userLocation) {
          new (window as any).google.maps.Marker({
            position: userLocation,
            map,
            title: 'Your Location',
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#8B5CF6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <circle cx="12" cy="12" r="4"/>
                </svg>
              `),
              scaledSize: new (window as any).google.maps.Size(24, 24)
            }
          });
        }

        // Fetch nearby places and add markers
        try {
          const { data, error } = await supabase.functions.invoke('google-places-nearby', {
            body: {
              location: center,
              radius: 16093, // 10 miles
              includedTypes: ['bar','night_club','restaurant'],
              maxResultCount: 50,
            },
          });
          if (error) throw error;
          const places = [...getMockNearbyPlaces(center), ...(data?.places || [])];

          markersRef.current = places.map((p: any) => {
            const lat = p.location?.latitude;
            const lng = p.location?.longitude;
            if (!lat || !lng) return null;

            const marker = new (window as any).google.maps.Marker({
              position: { lat, lng },
              map,
              title: p.displayName?.text || 'Venue',
            });

            const photoUrl = p.photoUrl || 'https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=200&h=200&fit=crop';
            const infoWindow = new (window as any).google.maps.InfoWindow({
              content: `
                <div style="padding: 16px; max-width: 280px; font-family: 'Plus Jakarta Sans', 'Noto Sans', sans-serif; background: hsl(var(--background)); color: hsl(var(--foreground)); border-radius: 12px;">
                  <div style="display: flex; gap: 12px; margin-bottom: 12px;">
                    <div style="width: 60px; height: 60px; background-image: url('${photoUrl}'); background-size: cover; background-position: center; border-radius: 8px; flex-shrink: 0;"></div>
                    <div style="flex: 1;">
                      <h3 style="margin: 0 0 4px 0; font-weight: bold; font-size: 16px; color: hsl(var(--foreground));">${p.displayName?.text || 'Venue'}</h3>
                      <p style="margin: 0 0 8px 0; font-size: 12px; color: hsl(var(--muted-foreground)); line-height: 1.3;">${p.formattedAddress || ''}</p>
                    </div>
                  </div>
                </div>
              `,
            });

            marker.addListener('click', () => {
              infoWindow.open(map, marker);
              if (onVenueSelect) {
                onVenueSelect(p.id);
              }
            });

            return { id: p.id, marker };
          }).filter(Boolean) as any[];
        } catch (err) {
          console.error('Failed to fetch places for map:', err);
        }

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
      const entry = (markersRef.current as any[]).find((m: any) => m.id === selectedVenueId);
      if (entry) {
        mapInstanceRef.current.setCenter(entry.marker.getPosition());
        mapInstanceRef.current.setZoom(17);
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