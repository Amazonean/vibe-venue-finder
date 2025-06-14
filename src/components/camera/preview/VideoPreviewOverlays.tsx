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
  // Don't render overlays in preview since they're already baked into the video
  // The video was recorded with canvas overlays, so showing React overlays would create duplicates
  return null;
};

export default VideoPreviewOverlays;