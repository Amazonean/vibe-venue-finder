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
}

export interface VenueCardProps {
  venue: Venue;
  showDistance: boolean;
  isFavorite?: boolean;
  onFavoriteChange?: (venueId: number | string, isFavorited: boolean) => void;
}