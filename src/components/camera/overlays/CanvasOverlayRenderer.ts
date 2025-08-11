import { VibeType, VibeConfiguration } from '../VibeConfig';
import { MediaConfiguration } from '../config/MediaConfig';
import { drawVenueNameOverlay } from './renderers/venueNameRenderer';
import { drawImageOverlay } from './renderers/imageRenderer';
import { getVibeBadgeImagePath } from './utils/vibeBadgeUtils';

export const renderCanvasOverlays = async (
  ctx: CanvasRenderingContext2D,
  config: MediaConfiguration,
  venueName: string,
  selectedVibe: VibeType,
  vibeConfig: Record<VibeType, VibeConfiguration>
): Promise<void> => {
  const { overlays } = config;

  // Debug logging
  console.log('CanvasOverlayRenderer - venueName:', venueName);
  console.log('CanvasOverlayRenderer - config.overlays.venueName:', overlays.venueName);

  // Clear any existing styles
  ctx.save();

  try {
    // Draw vibe image first so venue name appears on top
    await drawImageOverlay(
      ctx,
      getVibeBadgeImagePath(selectedVibe),
      overlays.vibeBadge.x,
      overlays.vibeBadge.y,
      overlays.vibeBadge.width,
      overlays.vibeBadge.height,
      true
    );

    // Draw venue name on top-right
    drawVenueNameOverlay(ctx, config, venueName);

  } finally {
    ctx.restore();
  }
};

// Re-export for backward compatibility
export { preloadOverlayImages } from './utils/imageCache';