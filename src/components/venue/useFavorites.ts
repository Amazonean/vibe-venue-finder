import { useState } from 'react';
import { Venue } from './types';

export const useFavorites = (
  venue: Venue,
  isFavorite: boolean,
  onFavoriteChange?: (venueId: number | string, isFavorited: boolean) => void
) => {
  const [isFavorited, setIsFavorited] = useState(isFavorite);

  const toggleFavorite = () => {
    const newFavoriteState = !isFavorited;
    setIsFavorited(newFavoriteState);
    onFavoriteChange?.(venue.id, newFavoriteState);
    
    // Save to localStorage for favorites page
    const existingFavorites = JSON.parse(localStorage.getItem('favoriteVenues') || '[]');
    if (newFavoriteState) {
      // Add to favorites if not already there
      if (!existingFavorites.find((v: any) => v.id === venue.id)) {
        existingFavorites.push(venue);
        localStorage.setItem('favoriteVenues', JSON.stringify(existingFavorites));
      }
    } else {
      // Remove from favorites
      const updatedFavorites = existingFavorites.filter((v: any) => v.id !== venue.id);
      localStorage.setItem('favoriteVenues', JSON.stringify(updatedFavorites));
    }
  };

  return {
    isFavorited,
    toggleFavorite
  };
};