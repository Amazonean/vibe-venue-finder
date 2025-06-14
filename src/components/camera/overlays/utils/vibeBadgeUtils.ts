import { VibeType } from '../../VibeConfig';

export const getVibeBadgeImagePath = (vibe: VibeType): string => {
  switch (vibe) {
    case 'turnt':
      return '/lovable-uploads/20a93d55-cfbc-417d-b442-a073caa5158f.png';
    case 'chill':
      return '/lovable-uploads/4b5069a8-223b-47a6-b22b-5439eade3e91.png';
    case 'quiet':
      return '/lovable-uploads/750b5511-5654-47b1-93a5-1bb9063ad60c.png';
    default:
      return '/lovable-uploads/20a93d55-cfbc-417d-b442-a073caa5158f.png';
  }
};