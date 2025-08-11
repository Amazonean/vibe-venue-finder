import { MediaConfiguration } from '../../config/MediaConfig';

export const drawVenueNameOverlay = (
  ctx: CanvasRenderingContext2D,
  config: MediaConfiguration,
  venueName: string
): void => {
  const { overlays } = config;
  const venueOverlay = overlays.venueName;

  // Enhance styling: pill background with gradient stroke, glowing gradient text
  // Set up text properties
  const fontSize = venueOverlay.fontSize || 36;
  ctx.font = `800 ${fontSize}px Arial, sans-serif`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';

  // Prepare text
  const text = venueName.toUpperCase();
  const textMetrics = ctx.measureText(text);
  const textWidth = textMetrics.width;

  // Background (pill) dimensions
  const padding = Math.max(20, (venueOverlay.padding || 24));
  const bgWidth = Math.min(textWidth + padding * 2, venueOverlay.width);
  const bgHeight = Math.max(venueOverlay.height * 0.6, fontSize * 1.4);
  const bgX = venueOverlay.x + (venueOverlay.width - bgWidth); // right-aligned pill
  const bgY = venueOverlay.y + (venueOverlay.height - bgHeight) / 2;

  // Draw pill background
  ctx.save();
  const bgRadius = Math.min(16, bgHeight / 2);
  ctx.beginPath();
  ctx.roundRect(bgX, bgY, bgWidth, bgHeight, bgRadius);

  // Fill with subtle translucent backdrop
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fill();

  // Gradient stroke around the pill
  const strokeGrad = ctx.createLinearGradient(bgX, bgY, bgX + bgWidth, bgY);
  strokeGrad.addColorStop(0, 'rgba(167, 139, 250, 0.9)'); // purple-300
  strokeGrad.addColorStop(1, 'rgba(139, 92, 246, 0.9)');  // violet-500
  ctx.strokeStyle = strokeGrad;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // Text position
  const textX = bgX + bgWidth - padding / 2; // near right edge inside pill
  const textY = venueOverlay.y + venueOverlay.height / 2;

  // Create gradient for text fill
  const textGrad = ctx.createLinearGradient(bgX, bgY, bgX + bgWidth, bgY + bgHeight);
  textGrad.addColorStop(0, '#E9D5FF'); // fuchsia-100
  textGrad.addColorStop(0.5, '#C4B5FD'); // violet-200
  textGrad.addColorStop(1, '#8B5CF6'); // violet-500

  // Outer white highlight stroke
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.lineWidth = 5;
  ctx.strokeText(text, textX, textY);

  // Soft glow shadow + subtle colored stroke
  ctx.shadowColor = 'rgba(139, 92, 246, 0.7)';
  ctx.shadowBlur = 18;
  ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
  ctx.lineWidth = 2;
  ctx.strokeText(text, textX, textY);

  // Main gradient-filled text
  ctx.shadowBlur = 8;
  ctx.shadowColor = 'rgba(167, 139, 250, 0.6)';
  ctx.fillStyle = textGrad;
  ctx.fillText(text, textX, textY);

  // Reset shadows
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';
};