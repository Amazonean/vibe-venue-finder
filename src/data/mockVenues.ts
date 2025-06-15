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
    name: "Electric Dreams",
    address: "1234 Broadway, New York, NY 10001",
    vibeLevel: "turnt" as const,
    distance: 0.8,
    musicType: "Electronic",
    venueType: "Clubs",
    voteCount: 127,
    lastUpdated: "2 min ago",
    description: "High-energy electronic music venue with amazing sound system",
    isFeatured: true,
    latitude: 40.7505,
    longitude: -73.9934
  },
  {
    id: 2,
    name: "Jazz Corner",
    address: "52 W 8th St, New York, NY 10011",
    vibeLevel: "quiet" as const,
    distance: 1.2,
    musicType: "Jazz",
    venueType: "Bars",
    voteCount: 89,
    lastUpdated: "15 min ago",
    description: "Intimate jazz bar featuring local musicians and craft cocktails",
    isFeatured: true,
    latitude: 40.7326,
    longitude: -73.9974
  },
  {
    id: 3,
    name: "Rock Haven",
    address: "315 Bowery, New York, NY 10003",
    vibeLevel: "chill" as const,
    distance: 2.1,
    musicType: "Rock",
    venueType: "Clubs",
    voteCount: 203,
    lastUpdated: "1 hour ago",
    description: "Live rock music venue with energetic crowd",
    isFeatured: true,
    latitude: 40.7233,
    longitude: -73.9927
  },
  {
    id: 4,
    name: "Silent Sanctuary",
    address: "200 E 79th St, New York, NY 10075",
    vibeLevel: "quiet" as const,
    distance: 1.7,
    musicType: "Ambient",
    venueType: "Lounges",
    voteCount: 45,
    lastUpdated: "30 min ago",
    description: "Peaceful lounge with ambient music, perfect for relaxation",
    latitude: 40.7732,
    longitude: -73.9578
  },
  {
    id: 5,
    name: "Groove Central",
    address: "25 St Marks Pl, New York, NY 10003",
    vibeLevel: "chill" as const,
    distance: 1.4,
    musicType: "Hip Hop",
    venueType: "Bars",
    voteCount: 78,
    lastUpdated: "45 min ago",
    description: "Hip hop bar with laid-back vibe and excellent DJ lineup",
    latitude: 40.7286,
    longitude: -73.9889
  },
  {
    id: 6,
    name: "Whisper Lounge",
    address: "170 E 61st St, New York, NY 10065",
    vibeLevel: "quiet" as const,
    distance: 2.3,
    musicType: "Classical",
    venueType: "Lounges",
    voteCount: 156,
    lastUpdated: "1 hour ago",
    description: "Elegant lounge featuring classical music and sophisticated ambiance",
    latitude: 40.7648,
    longitude: -73.9665
  }
];

export const mockFavoriteVenues = [
  {
    id: 1,
    name: "Electric Dreams",
    address: "1234 Broadway, New York, NY 10001",
    vibeLevel: "turnt" as const,
    distance: 0.8,
    musicType: "Electronic",
    venueType: "Clubs",
    voteCount: 127,
    lastUpdated: "2 min ago",
    description: "High-energy electronic music venue with amazing sound system",
    latitude: 40.7505,
    longitude: -73.9934
  },
  {
    id: 4,
    name: "Silent Sanctuary",
    address: "200 E 79th St, New York, NY 10075",
    vibeLevel: "quiet" as const,
    distance: 1.7,
    musicType: "Ambient",
    venueType: "Lounges",
    voteCount: 45,
    lastUpdated: "30 min ago",
    description: "Peaceful lounge with ambient music, perfect for relaxation",
    latitude: 40.7732,
    longitude: -73.9578
  }
];