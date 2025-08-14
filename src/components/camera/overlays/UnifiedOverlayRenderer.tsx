import React from 'react';
import { VibeType, VibeConfiguration } from '../VibeConfig';
import { MediaConfiguration } from '../config/MediaConfig';
import { getVibeBadgeImagePath } from './utils/vibeBadgeUtils';
import { VIBE_FRAME, VIBE_POSITIONING } from './constants';

interface UnifiedOverlayRendererProps {
  config: MediaConfiguration;
  venueName: string;
  selectedVibe: VibeType;
  vibeConfig: Record<VibeType, VibeConfiguration>;
}


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
      {/* Vibe Image Overlay */}
      <div className="absolute inset-0">
        <img
          src={getVibeBadgeImagePath(selectedVibe)}
          alt={`${selectedVibe} vibe frame`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `translateY(${VIBE_POSITIONING[selectedVibe].translateY * 100}%) scale(${VIBE_FRAME.scale})`,
            transformOrigin: 'center'
          }}
        />
      </div>

      {/* Venue Name Overlay (top-right) */}
      <div 
        className="absolute flex items-center justify-end"
        style={{
          right: 16,
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
            className="font-bungee-shade uppercase leading-tight text-right break-words"
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
    </div>
  );
};

export default UnifiedOverlayRenderer;