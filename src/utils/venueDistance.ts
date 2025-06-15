// Function to calculate distance between two coordinates using Haversine formula
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  
  return distance * 1000; // Convert to meters
};

const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

// Check if user is within 200 meters of a venue
export const isUserAtVenue = (
  userLat: number,
  userLng: number,
  venueLat: number,
  venueLng: number
): boolean => {
  const distance = calculateDistance(userLat, userLng, venueLat, venueLng);
  return distance <= 200; // 200 meters threshold
};