import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface NearbyPlace {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  types?: string[];
  googleMapsUri?: string;
  location?: { latitude: number; longitude: number };
  photoUrl?: string;
}

interface UseNearbyPlacesParams {
  location: { lat: number; lng: number } | null;
  radiusMeters: number; // will be clamped to 16093 by the function
  includedTypes?: string[];
  keyword?: string;
  enabled?: boolean;
}

export function useNearbyPlaces({ location, radiusMeters, includedTypes, keyword, enabled = true }: UseNearbyPlacesParams) {
  return useInfiniteQuery({
    queryKey: ["nearby-places", location?.lat, location?.lng, radiusMeters, includedTypes?.join("-"), keyword],
    enabled: enabled && !!location,
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      const { data, error } = await supabase.functions.invoke("google-places-nearby", {
        body: {
          location,
          radius: radiusMeters,
          includedTypes,
          keyword,
          pageToken: pageParam,
          maxResultCount: 20,
        },
      });

      if (error) throw error;
      return data as { places: NearbyPlace[]; nextPageToken?: string };
    },
    getNextPageParam: (lastPage) => lastPage?.nextPageToken,
  });
}
