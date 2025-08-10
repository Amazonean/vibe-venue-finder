import { NearbyPlace } from "@/hooks/useNearbyPlaces";

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
