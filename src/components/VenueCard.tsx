import React from 'react';
import { MapPin, Music, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Venue {
  id: number;
  name: string;
  address: string;
  vibeLevel: 'chill' | 'decent' | 'turnt';
  distance: number;
  musicType: string;
  venueType: string;
  voteCount: number;
  lastUpdated: string;
  description: string;
}

interface VenueCardProps {
  venue: Venue;
  showDistance: boolean;
}

const getVibeColor = (vibe: string) => {
  switch (vibe) {
    case 'chill':
      return 'bg-accent/20 text-accent-foreground border border-accent/30';
    case 'decent':
      return 'bg-secondary text-secondary-foreground border border-border';
    case 'turnt':
      return 'bg-primary/20 text-primary border border-primary/30';
    default:
      return 'bg-muted text-muted-foreground border border-border';
  }
};

const getVibeEmoji = (vibe: string) => {
  switch (vibe) {
    case 'chill':
      return '😌';
    case 'decent':
      return '🙂';
    case 'turnt':
      return '🔥';
    default:
      return '😐';
  }
};

const VenueCard: React.FC<VenueCardProps> = ({ venue, showDistance }) => {
  return (
    <Card className="overflow-hidden bg-muted border-none">
      <div className="flex">
        {/* Image Section */}
        <div 
          className="w-24 h-24 bg-center bg-cover bg-no-repeat flex-shrink-0"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=200&h=200&fit=crop")`
          }}
        />
        
        {/* Content Section */}
        <div className="flex-1 p-3">
          <CardHeader className="p-0 pb-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-foreground text-sm font-bold leading-tight truncate">
                  {venue.name}
                </h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{venue.address}</span>
                </div>
              </div>
              {showDistance && (
                <Badge variant="secondary" className="text-xs flex-shrink-0 bg-background border-border">
                  {venue.distance}km
                </Badge>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="p-0 space-y-2">
            {/* Description */}
            <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
              {venue.description}
            </p>
            
            {/* Badges Row */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={`${getVibeColor(venue.vibeLevel)} text-xs font-medium`}>
                {getVibeEmoji(venue.vibeLevel)} {venue.vibeLevel}
              </Badge>
              <Badge variant="outline" className="text-xs border-border bg-background/50">
                {venue.venueType}
              </Badge>
            </div>
            
            {/* Bottom Info Row */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Music className="h-3 w-3" />
                  <span>{venue.musicType}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{venue.voteCount}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{venue.lastUpdated}</span>
              </div>
            </div>

            {/* Vote Button */}
            <div className="pt-1">
              <Button 
                size="sm" 
                className="h-7 px-3 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Vote
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
};

export default VenueCard;