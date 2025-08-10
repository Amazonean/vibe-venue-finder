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

  // Debug logging
  console.log('UnifiedOverlayRenderer - venueName:', venueName);
  console.log('UnifiedOverlayRenderer - config:', config);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Venue Name Overlay */}
      <div 
        className="absolute flex items-center justify-center"
        style={{
          left: overlays.venueName.x,
          top: `calc(${overlays.venueName.y}px + env(safe-area-inset-top) + var(--top-nav-height, 64px))`,
          width: overlays.venueName.width,
          height: overlays.venueName.height
        }}
      >
        <div 
          className="inline-block rounded-full max-w-full overflow-hidden"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.35)',
            border: '2px solid rgba(139, 92, 246, 0.9)',
            borderRadius: '9999px',
            boxShadow: '0 8px 18px rgba(139, 92, 246, 0.35)',
            padding: `${overlays.venueName.padding / 2}px ${overlays.venueName.padding}px`
          }}
        >
          <h1 
            className="font-bungee-shade uppercase leading-tight text-center break-words"
            style={{ 
              fontSize: `${overlays.venueName.fontSize}px`,
              backgroundImage: 'linear-gradient(90deg, #E9D5FF, #C4B5FD, #8B5CF6)',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              WebkitTextFillColor: 'transparent',
              wordWrap: 'break-word',
              hyphens: 'auto',
              WebkitTextStroke: '5px rgba(255,255,255,0.9)',
              textShadow: '0 0 18px rgba(139, 92, 246, 0.7), 0 2px 4px rgba(0, 0, 0, 0.9)'
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
          top: `calc(${overlays.vibeBadge.y}px + env(safe-area-inset-top) + var(--top-nav-height, 64px))`,
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
          bottom: 'calc(env(safe-area-inset-bottom) + var(--bottom-nav-height, 72px) + 16px)',
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