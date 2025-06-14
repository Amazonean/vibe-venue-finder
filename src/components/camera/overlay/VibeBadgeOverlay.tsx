import React from 'react';
import { VibeType } from '../VibeConfig';

interface VibeBadgeOverlayProps {
  selectedVibe: VibeType;
}

const getVibeBadgeImage = (vibe: VibeType) => {
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

const VibeBadgeOverlay: React.FC<VibeBadgeOverlayProps> = ({ selectedVibe }) => {
  return (
    <div className="absolute top-18 left-4">
      <img 
        src={getVibeBadgeImage(selectedVibe)}
        alt={`${selectedVibe} vibe`}
        className="w-56 h-auto drop-shadow-lg"
        style={{
          filter: 'drop-shadow(2px 2px 8px rgba(0, 0, 0, 0.8))'
        }}
      />
    </div>
  );
};

export default VibeBadgeOverlay;