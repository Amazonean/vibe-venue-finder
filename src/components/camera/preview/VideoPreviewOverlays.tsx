import React, { useRef } from 'react';
import { VibeType, VibeConfiguration } from '../VibeConfig';
import { useMediaConfiguration } from '../hooks/useMediaConfiguration';
import UnifiedOverlayRenderer from '../overlays/UnifiedOverlayRenderer';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const { config } = useMediaConfiguration(containerRef);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none">
      {config && (
        <UnifiedOverlayRenderer
          config={config}
          venueName={venueName}
          selectedVibe={selectedVibe}
          vibeConfig={vibeConfig}
        />
      )}
    </div>
  );
};

export default VideoPreviewOverlays;