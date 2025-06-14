import { VibeType, VibeConfiguration } from '../VibeConfig';
import { drawVenueName } from './venueNameOverlay';
import { drawVibeBadge } from './vibeBadgeOverlay';
import { drawTurntUpLogo } from './logoOverlay';

export const drawOverlays = async (
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number,
  venueName: string,
  selectedVibe: VibeType,
  vibeConfig: Record<VibeType, VibeConfiguration>
): Promise<void> => {
  // Draw venue name
  drawVenueName(ctx, width, height, venueName);
  
  // Draw vibe badge
  await drawVibeBadge(ctx, width, height, selectedVibe, vibeConfig);
  
  // Draw TurntUp logo
  await drawTurntUpLogo(ctx, width, height);
};