import { VibeType } from '../../VibeConfig';

export const getVibeBadgeImagePath = (vibe: VibeType): string => {
  switch (vibe) {
    case 'turnt':
      return '/lovable-uploads/d1bee350-8142-4601-b853-a5fdd7672d20.png';
    case 'chill':
      return '/lovable-uploads/d0c24398-1f3d-49ba-a4a6-fd4f3d80d1e1.png';
    case 'quiet':
      return '/lovable-uploads/404d6f24-b71f-4c3b-acf0-f2ef07dd4b21.png';
    default:
      return '/lovable-uploads/d1bee350-8142-4601-b853-a5fdd7672d20.png';
  }
};