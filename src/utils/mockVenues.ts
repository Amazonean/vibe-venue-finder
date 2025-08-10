import { NearbyPlace } from "@/hooks/useNearbyPlaces";
import { supabase } from "@/integrations/supabase/client";

export const MOCK_VENUE_IDS = [
  "00000000-0000-0000-0000-000000000001",
  "00000000-0000-0000-0000-000000000002"
] as const;

export function getMockNearbyPlaces(location: { lat: number; lng: number } | null | undefined): NearbyPlace[] {
  if (!location) return [];
  const base: Omit<NearbyPlace, "id"> = {
    displayName: undefined,
    formattedAddress: "At your location",
    types: ["bar"],
    googleMapsUri: undefined,
    location: { latitude: location.lat, longitude: location.lng },
    photoUrl: "/placeholder.svg",
  };
  return [
    {
      id: MOCK_VENUE_IDS[0],
      displayName: { text: "Mock Venue A" },
      ...base,
    },
    {
      id: MOCK_VENUE_IDS[1],
      displayName: { text: "Mock Venue B" },
      ...base,
    },
  ];
}

// Ensure the two mock venues exist in the database so voting passes FK constraints
export async function ensureMockVenuesInDatabase(location: { lat: number; lng: number } | null | undefined) {
  try {
    if (!location) return;

    const entries = [
      {
        id: MOCK_VENUE_IDS[0] as string,
        name: "Mock Venue A",
        latitude: location.lat,
        longitude: location.lng,
      },
      {
        id: MOCK_VENUE_IDS[1] as string,
        name: "Mock Venue B",
        latitude: location.lat,
        longitude: location.lng,
      },
    ];

    for (const v of entries) {
      const { data: existing, error: selectError } = await supabase
        .from("venues")
        .select("id")
        .eq("id", v.id)
        .maybeSingle();

      if (selectError) {
        console.warn("Failed to check existing mock venue:", v.id, selectError);
        continue;
      }

      if (!existing) {
        const { error: insertError } = await supabase.from("venues").insert({
          id: v.id,
          name: v.name,
          address: "At your location",
          city: "Test City",
          latitude: v.latitude,
          longitude: v.longitude,
          venue_type: "bar",
          source: "mock",
        });
        if (insertError) {
          console.warn("Failed to insert mock venue:", v.id, insertError);
        } else {
          console.log("Inserted mock venue into DB:", v.id);
        }
      }
    }
  } catch (e) {
    console.warn("ensureMockVenuesInDatabase error:", e);
  }
}
