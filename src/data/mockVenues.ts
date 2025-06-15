export interface Venue {
  id: number | string;
  name: string;
  address: string;
  vibeLevel: 'quiet' | 'chill' | 'turnt';
  distance: number;
  musicType: string;
  venueType: string;
  voteCount: number;
  lastUpdated: string;
  description: string;
  isFeatured?: boolean;
  latitude?: number;
  longitude?: number;
}

export const mockVenues: Venue[] = [
  {
    id: 1,
    name: "The Underground",
    address: "123 Music St, Downtown",
    vibeLevel: "turnt" as const,
    distance: 0.8,
    musicType: "Electronic",
    venueType: "Clubs",
    voteCount: 127,
    lastUpdated: "2 min ago",
    description: "High-energy electronic music venue with amazing sound system",
    isFeatured: true,
    latitude: 40.7128,
    longitude: -74.0060
  },
  {
    id: 2,
    name: "Rooftop Lounge",
    address: "456 Skyline Ave, Midtown",
    vibeLevel: "quiet" as const,
    distance: 1.2,
    musicType: "Jazz",
    venueType: "Rooftops",
    voteCount: 89,
    lastUpdated: "15 min ago",
    description: "Relaxed atmosphere with panoramic city views",
    isFeatured: true
  },
  {
    id: 3,
    name: "Neon Nights",
    address: "789 Party Blvd, Entertainment District",
    vibeLevel: "chill" as const,
    distance: 2.1,
    musicType: "Pop/Hip-Hop",
    venueType: "Clubs",
    voteCount: 203,
    lastUpdated: "1 hour ago",
    description: "Popular nightclub with diverse music selection",
    isFeatured: true
  },
  {
    id: 4,
    name: "Acoustic Corner",
    address: "321 Melody Lane, Arts Quarter",
    vibeLevel: "quiet" as const,
    distance: 1.7,
    musicType: "Live Acoustic",
    venueType: "Live Music",
    voteCount: 45,
    lastUpdated: "30 min ago",
    description: "Intimate venue featuring local acoustic artists"
  },
  {
    id: 5,
    name: "The Vintage Bar",
    address: "555 Classic St, Old Town",
    vibeLevel: "chill" as const,
    distance: 1.4,
    musicType: "Classic Rock",
    venueType: "Bars",
    voteCount: 78,
    lastUpdated: "45 min ago",
    description: "Cozy bar with vintage atmosphere and craft cocktails"
  },
  {
    id: 6,
    name: "Bella Vista Restaurant",
    address: "777 Dining Ave, Food District",
    vibeLevel: "quiet" as const,
    distance: 2.3,
    musicType: "Ambient",
    venueType: "Restaurants",
    voteCount: 156,
    lastUpdated: "1 hour ago",
    description: "Fine dining with live ambient music and city views"
  }
];

export const mockFavoriteVenues = [
  {
    id: 1,
    name: "The Underground",
    address: "123 Music St, Downtown",
    vibeLevel: "turnt" as const,
    distance: 0.8,
    musicType: "Electronic",
    venueType: "Clubs",
    voteCount: 127,
    lastUpdated: "2 min ago",
    description: "High-energy electronic music venue with amazing sound system"
  },
  {
    id: 4,
    name: "Acoustic Corner",
    address: "321 Melody Lane, Arts Quarter",
    vibeLevel: "quiet" as const,
    distance: 1.7,
    musicType: "Live Acoustic",
    venueType: "Live Music",
    voteCount: 45,
    lastUpdated: "30 min ago",
    description: "Intimate venue featuring local acoustic artists"
  }
];