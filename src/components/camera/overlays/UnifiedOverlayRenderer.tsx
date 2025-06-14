import React from 'react';
import { VibeType, VibeConfiguration } from '../VibeConfig';
import { MediaConfiguration } from '../config/MediaConfig';

interface UnifiedOverlayRendererProps {
  config: MediaConfiguration;
  venueName: string;
  selectedVibe: VibeType;
  vibeConfig: Record<VibeType, VibeConfiguration>;
}

const getVibeBadgeImage = (vibe: VibeType): string => {
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

const UnifiedOverlayRenderer: React.FC<UnifiedOverlayRendererProps> = ({
  config,
  venueName,
  selectedVibe,
  vibeConfig
}) => {
  const { overlays } = config;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Venue Name Overlay */}
      <div 
        className="absolute flex items-center justify-center"
        style={{
          left: overlays.venueName.x,
          top: overlays.venueName.y,
          width: overlays.venueName.width,
          height: overlays.venueName.height
        }}
      >
        <div 
          className="inline-block rounded-lg max-w-full overflow-hidden"
          style={{
            backgroundColor: overlays.venueName.backgroundColor,
            padding: `${overlays.venueName.padding / 2}px ${overlays.venueName.padding}px`
          }}
        >
          <h1 
            className="font-bungee-shade uppercase leading-tight text-center break-words"
            style={{ 
              color: overlays.venueName.textColor,
              textShadow: overlays.venueName.textShadow,
              fontSize: `${overlays.venueName.fontSize}px`,
              wordWrap: 'break-word',
              hyphens: 'auto'
            }}
          >
            {venueName}
          </h1>
        </div>
      </div>

      {/* Vibe Badge Overlay */}
      <div 
        className="absolute"
        style={{
          left: overlays.vibeBadge.x,
          top: overlays.vibeBadge.y,
          width: overlays.vibeBadge.width,
          height: overlays.vibeBadge.height
        }}
      >
        <img 
          src={getVibeBadgeImage(selectedVibe)}
          alt={`${selectedVibe} vibe`}
          className="w-full h-auto drop-shadow-lg"
          style={{
            filter: 'drop-shadow(2px 2px 8px rgba(0, 0, 0, 0.8))',
            maxWidth: '100%',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* TurntUp Logo Overlay */}
      <div 
        className="absolute"
        style={{
          left: overlays.logo.x,
          top: overlays.logo.y,
          width: overlays.logo.width,
          height: overlays.logo.height
        }}
      >
        <img 
          src="/lovable-uploads/4798e35a-824c-4ddc-9916-74b59aac299d.png"
          alt="TurntUp Logo"
          className="w-full h-auto drop-shadow-lg"
          style={{
            filter: 'drop-shadow(2px 2px 8px rgba(0, 0, 0, 0.8))',
            maxWidth: '100%',
            objectFit: 'contain'
          }}
        />
      </div>
    </div>
  );
};

export default UnifiedOverlayRenderer;