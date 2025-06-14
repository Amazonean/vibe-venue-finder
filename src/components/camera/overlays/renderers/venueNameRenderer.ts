import { MediaConfiguration } from '../../config/MediaConfig';

export const drawVenueNameOverlay = (
  ctx: CanvasRenderingContext2D,
  config: MediaConfiguration,
  venueName: string
): void => {
  const { overlays } = config;
  const venueOverlay = overlays.venueName;

  // Debug logging
  console.log('venueNameRenderer - venueName:', venueName);
  console.log('venueNameRenderer - venueOverlay:', venueOverlay);

  // Set up text properties  
  ctx.font = `bold ${venueOverlay.fontSize}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Measure text for background sizing
  const text = venueName.toUpperCase();
  const textMetrics = ctx.measureText(text);
  const textWidth = textMetrics.width;
  
  // Calculate background dimensions
  const backgroundWidth = Math.min(textWidth + venueOverlay.padding, venueOverlay.width);
  const backgroundHeight = venueOverlay.height * 0.6;
  const backgroundX = venueOverlay.x + (venueOverlay.width - backgroundWidth) / 2;
  const backgroundY = venueOverlay.y + (venueOverlay.height - backgroundHeight) / 2;

  // Draw background
  ctx.fillStyle = venueOverlay.backgroundColor;
  ctx.roundRect(backgroundX, backgroundY, backgroundWidth, backgroundHeight, 8);
  ctx.fill();

  // Draw text with glow effect
  const textX = venueOverlay.x + venueOverlay.width / 2;
  const textY = venueOverlay.y + venueOverlay.height / 2;

  // White outline
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 6;
  ctx.strokeText(text, textX, textY);

  // Glow effect
  ctx.shadowColor = 'rgba(139, 92, 246, 0.8)';
  ctx.shadowBlur = 20;
  ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
  ctx.lineWidth = 2;
  ctx.strokeText(text, textX, textY);

  // Main text
  ctx.fillStyle = '#8B5CF6';
  ctx.fillText(text, textX, textY);

  // Reset shadow
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';
};