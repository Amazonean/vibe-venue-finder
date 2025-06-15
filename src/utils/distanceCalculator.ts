// Haversine formula to calculate distance between two points on Earth
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
  unit: 'km' | 'miles' = 'km'
): number {
  const R = unit === 'km' ? 6371 : 3959; // Earth's radius in km or miles
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Calculate distance from search location or user location to venue
export function getVenueDistance(
  venue: { latitude?: number; longitude?: number; distance?: number },
  searchLocation: { lat: number; lng: number } | null,
  userLocation: { lat: number; lng: number } | null,
  unit: 'km' | 'miles' = 'km'
): number {
  // If venue has real coordinates, calculate actual distance
  if (venue.latitude && venue.longitude) {
    const referenceLocation = searchLocation || userLocation;
    if (referenceLocation) {
      return calculateDistance(
        referenceLocation.lat,
        referenceLocation.lng,
        venue.latitude,
        venue.longitude,
        unit
      );
    }
  }
  
  // Fallback to mock distance
  return venue.distance || 0;
}