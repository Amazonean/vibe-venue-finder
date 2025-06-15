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
  // London venues
  {
    id: 1,
    name: "Electric Dreams",
    address: "1 Leicester Square, London WC2H 7NA",
    vibeLevel: "turnt" as const,
    distance: 0.8,
    musicType: "Electronic",
    venueType: "Clubs",
    voteCount: 127,
    lastUpdated: "2 min ago",
    description: "High-energy electronic music venue in the heart of London",
    isFeatured: true,
    latitude: 51.5106,
    longitude: -0.1297
  },
  {
    id: 2,
    name: "The Jazz Cellar",
    address: "100 Oxford Street, London W1D 1LL",
    vibeLevel: "chill" as const,
    distance: 1.2,
    musicType: "Jazz",
    venueType: "Bars",
    voteCount: 89,
    lastUpdated: "15 min ago",
    description: "Intimate underground jazz venue with craft cocktails",
    isFeatured: true,
    latitude: 51.5154,
    longitude: -0.1447
  },
  {
    id: 3,
    name: "Shoreditch Sound",
    address: "15 Brick Lane, London E1 6PU",
    vibeLevel: "turnt" as const,
    distance: 2.1,
    musicType: "Techno",
    venueType: "Clubs",
    voteCount: 203,
    lastUpdated: "1 hour ago",
    description: "Underground techno club in trendy Shoreditch",
    isFeatured: true,
    latitude: 51.5204,
    longitude: -0.0718
  },
  
  // Manchester venues
  {
    id: 4,
    name: "Northern Quarter Vibes",
    address: "45 Oldham Street, Manchester M1 1JG",
    vibeLevel: "chill" as const,
    distance: 1.7,
    musicType: "Indie Rock",
    venueType: "Bars",
    voteCount: 45,
    lastUpdated: "30 min ago",
    description: "Cool indie bar in Manchester's creative quarter",
    latitude: 53.4839,
    longitude: -2.2374
  },
  {
    id: 5,
    name: "The Warehouse",
    address: "50 Store Street, Manchester M1 2WD",
    vibeLevel: "turnt" as const,
    distance: 1.4,
    musicType: "House",
    venueType: "Clubs",
    voteCount: 78,
    lastUpdated: "45 min ago",
    description: "Manchester's premier house music venue",
    latitude: 53.4794,
    longitude: -2.2418
  },
  
  // Birmingham venues
  {
    id: 6,
    name: "Digbeth Lounge",
    address: "25 Digbeth High Street, Birmingham B5 6DY",
    vibeLevel: "quiet" as const,
    distance: 2.3,
    musicType: "Ambient",
    venueType: "Lounges",
    voteCount: 156,
    lastUpdated: "1 hour ago",
    description: "Sophisticated lounge in Birmingham's cultural quarter",
    latitude: 52.4751,
    longitude: -1.8901
  },
  
  // Edinburgh venues
  {
    id: 7,
    name: "Royal Mile Sessions",
    address: "150 Royal Mile, Edinburgh EH1 1QS",
    vibeLevel: "chill" as const,
    distance: 0.5,
    musicType: "Folk",
    venueType: "Bars",
    voteCount: 92,
    lastUpdated: "10 min ago",
    description: "Traditional Scottish pub with live folk music",
    latitude: 55.9495,
    longitude: -3.1914
  },
  {
    id: 8,
    name: "Grassmarket Bass",
    address: "85 Grassmarket, Edinburgh EH1 2HJ",
    vibeLevel: "turnt" as const,
    distance: 0.9,
    musicType: "Drum & Bass",
    venueType: "Clubs",
    voteCount: 134,
    lastUpdated: "5 min ago",
    description: "Underground D&B venue in historic Grassmarket",
    latitude: 55.9468,
    longitude: -3.1962
  },
  
  // Liverpool venues
  {
    id: 9,
    name: "Cavern Quarter",
    address: "10 Mathew Street, Liverpool L2 6RE",
    vibeLevel: "chill" as const,
    distance: 1.1,
    musicType: "Rock",
    venueType: "Bars",
    voteCount: 87,
    lastUpdated: "20 min ago",
    description: "Rock bar near the famous Cavern Club",
    latitude: 53.4084,
    longitude: -2.9916
  },
  
  // Bristol venues
  {
    id: 10,
    name: "Harbourside Beats",
    address: "25 The Grove, Bristol BS1 4RB",
    vibeLevel: "turnt" as const,
    distance: 1.8,
    musicType: "Dubstep",
    venueType: "Clubs",
    voteCount: 167,
    lastUpdated: "25 min ago",
    description: "Bristol's bass music headquarters",
    latitude: 51.4545,
    longitude: -2.5879
  },
  
  // Leeds venues
  {
    id: 11,
    name: "Call Lane Social",
    address: "40 Call Lane, Leeds LS1 7BT",
    vibeLevel: "chill" as const,
    distance: 1.3,
    musicType: "Hip Hop",
    venueType: "Bars",
    voteCount: 73,
    lastUpdated: "35 min ago",
    description: "Hip hop bar in Leeds' nightlife district",
    latitude: 53.7960,
    longitude: -1.5432
  },
  
  // Glasgow venues
  {
    id: 12,
    name: "Merchant City Sounds",
    address: "75 Ingram Street, Glasgow G1 1EX",
    vibeLevel: "quiet" as const,
    distance: 2.0,
    musicType: "Classical",
    venueType: "Lounges",
    voteCount: 64,
    lastUpdated: "40 min ago",
    description: "Elegant venue featuring classical and contemporary music",
    latitude: 55.8580,
    longitude: -4.2426
  }
];

export const mockFavoriteVenues = [
  {
    id: 1,
    name: "Electric Dreams",
    address: "1 Leicester Square, London WC2H 7NA",
    vibeLevel: "turnt" as const,
    distance: 0.8,
    musicType: "Electronic",
    venueType: "Clubs",
    voteCount: 127,
    lastUpdated: "2 min ago",
    description: "High-energy electronic music venue in the heart of London",
    latitude: 51.5106,
    longitude: -0.1297
  },
  {
    id: 7,
    name: "Royal Mile Sessions",
    address: "150 Royal Mile, Edinburgh EH1 1QS",
    vibeLevel: "chill" as const,
    distance: 0.5,
    musicType: "Folk",
    venueType: "Bars",
    voteCount: 92,
    lastUpdated: "10 min ago",
    description: "Traditional Scottish pub with live folk music",
    latitude: 55.9495,
    longitude: -3.1914
  }
];