import { VibeType } from '../VibeConfig';

export const drawVenueName = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  venueName: string
): void => {
  // Venue name background and text
  const venueY = height * 0.12;
  const venueBackgroundHeight = height * 0.08;
  
  // Measure text to make background fit properly
  ctx.font = `bold ${Math.floor(width * 0.06)}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  const textMetrics = ctx.measureText(venueName.toUpperCase());
  const textWidth = textMetrics.width;
  const padding = width * 0.04;
  
  // Draw venue name background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  const backgroundX = (width - textWidth - padding) / 2;
  const backgroundWidth = textWidth + padding;
  ctx.roundRect(backgroundX, venueY - venueBackgroundHeight/2, backgroundWidth, venueBackgroundHeight, 8);
  ctx.fill();

  // Venue name text with purple glow effect
  ctx.fillStyle = '#C26AF5';
  ctx.strokeStyle = 'rgba(194, 106, 245, 0.5)';
  ctx.lineWidth = 4;
  
  // Create glow effect
  ctx.shadowColor = 'rgba(194, 106, 245, 0.8)';
  ctx.shadowBlur = 20;
  ctx.strokeText(venueName.toUpperCase(), width / 2, venueY);
  ctx.fillText(venueName.toUpperCase(), width / 2, venueY);
  ctx.shadowBlur = 0;
};