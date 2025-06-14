import React from 'react';
import { VibeType, VibeConfiguration } from '../VibeConfig';

interface VideoPreviewOverlaysProps {
  venueName: string;
  selectedVibe: VibeType;
  vibeConfig: Record<VibeType, VibeConfiguration>;
}

const VideoPreviewOverlays: React.FC<VideoPreviewOverlaysProps> = ({
  venueName,
  selectedVibe,
  vibeConfig
}) => {
  return (
    <div className="absolute inset-2 pointer-events-none">
      {/* Venue Name Overlay */}
      <div className="absolute top-8 left-0 right-0 text-center px-4 z-10">
        <div className="inline-block bg-black/40 px-4 py-2 rounded-lg max-w-[90%]">
          <h1 
            className="text-2xl sm:text-3xl font-bold uppercase drop-shadow-lg leading-tight"
            style={{ 
              color: '#C26AF5',
              textShadow: '0 0 10px rgba(194, 106, 245, 0.5), 0 2px 4px rgba(0, 0, 0, 0.8)',
              wordWrap: 'break-word',
              hyphens: 'auto'
            }}
          >
            {venueName}
          </h1>
        </div>
      </div>

      {/* Vibe Badge Overlay */}
      <div className="absolute top-18 left-4">
        <img 
          src={vibeConfig[selectedVibe].badge === 'Turnt' ? '/lovable-uploads/20a93d55-cfbc-417d-b442-a073caa5158f.png' :
               vibeConfig[selectedVibe].badge === 'Chill' ? '/lovable-uploads/4b5069a8-223b-47a6-b22b-5439eade3e91.png' :
               '/lovable-uploads/750b5511-5654-47b1-93a5-1bb9063ad60c.png'}
          alt={`${selectedVibe} vibe`}
          className="w-56 h-auto drop-shadow-lg"
          style={{
            filter: 'drop-shadow(2px 2px 8px rgba(0, 0, 0, 0.8))'
          }}
        />
      </div>

      {/* TurntUp Logo Overlay */}
      <div className="absolute bottom-8 right-4">
        <img 
          src="/lovable-uploads/4798e35a-824c-4ddc-9916-74b59aac299d.png"
          alt="TurntUp Logo"
          className="w-20 h-auto drop-shadow-lg"
          style={{
            filter: 'drop-shadow(2px 2px 8px rgba(0, 0, 0, 0.8))'
          }}
        />
      </div>
    </div>
  );
};

export default VideoPreviewOverlays;