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

  // Clear any existing styles
  ctx.save();

  try {
    // Draw venue name
    drawVenueNameOverlay(ctx, config, venueName);

    // Draw vibe badge
    await drawImageOverlay(
      ctx,
      getVibeBadgeImagePath(selectedVibe),
      overlays.vibeBadge.x,
      overlays.vibeBadge.y,
      overlays.vibeBadge.width,
      overlays.vibeBadge.height,
      true
    );

    // Draw logo
    await drawImageOverlay(
      ctx,
      '/lovable-uploads/4798e35a-824c-4ddc-9916-74b59aac299d.png',
      overlays.logo.x,
      overlays.logo.y,
      overlays.logo.width,
      overlays.logo.height,
      true
    );
  } finally {
    ctx.restore();
  }
};

// Re-export for backward compatibility
export { preloadOverlayImages } from './utils/imageCache';