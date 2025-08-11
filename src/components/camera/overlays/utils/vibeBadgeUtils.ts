import { VibeType } from '../../VibeConfig';

export const getVibeBadgeImagePath = (vibe: VibeType): string => {
  switch (vibe) {
    case 'turnt':
      return '/lovable-uploads/0dc1d262-1376-40b9-b7df-d4f9f9f3e576.png';
    case 'chill':
      return '/lovable-uploads/a3037181-7ea9-4b1a-a45f-3587fddeb3ad.png';
    case 'quiet':
      return '/lovable-uploads/aeb22338-3739-4a42-b534-1c81ec69ff48.png';
    default:
      return '/lovable-uploads/0dc1d262-1376-40b9-b7df-d4f9f9f3e576.png';
  }
};