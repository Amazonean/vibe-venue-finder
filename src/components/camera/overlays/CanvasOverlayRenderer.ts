import { VibeType, VibeConfiguration } from '../VibeConfig';
import { MediaConfiguration } from '../config/MediaConfig';

// Cache for loaded images
const imageCache = new Map<string, HTMLImageElement>();

const loadImage = async (src: string): Promise<HTMLImageElement> => {
  if (imageCache.has(src)) {
    return imageCache.get(src)!;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    
    img.onerror = () => {
      reject(new Error(`Failed to load image: ${src}`));
    };
    
    img.src = src;
  });
};

const getVibeBadgeImagePath = (vibe: VibeType): string => {
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

const drawVenueNameOverlay = (
  ctx: CanvasRenderingContext2D,
  config: MediaConfiguration,
  venueName: string
): void => {
  const { overlays } = config;
  const venueOverlay = overlays.venueName;

  // Set up text properties
  ctx.font = `${venueOverlay.fontSize}px "Bungee Shade", cursive`;
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

  // Glow effect
  ctx.shadowColor = 'rgba(194, 106, 245, 0.8)';
  ctx.shadowBlur = 20;
  ctx.strokeStyle = 'rgba(194, 106, 245, 0.5)';
  ctx.lineWidth = 4;
  ctx.strokeText(text, textX, textY);

  // Main text
  ctx.fillStyle = venueOverlay.textColor;
  ctx.fillText(text, textX, textY);

  // Reset shadow
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';
};

const drawImageOverlay = async (
  ctx: CanvasRenderingContext2D,
  imagePath: string,
  x: number,
  y: number,
  width: number,
  height: number,
  maintainAspectRatio: boolean = true
): Promise<void> => {
  try {
    const img = await loadImage(imagePath);
    
    let drawWidth = width;
    let drawHeight = height;
    let drawX = x;
    let drawY = y;

    if (maintainAspectRatio) {
      const imgAspectRatio = img.width / img.height;
      const targetAspectRatio = width / height;

      if (imgAspectRatio > targetAspectRatio) {
        // Image is wider - fit to width
        drawHeight = width / imgAspectRatio;
        drawY = y + (height - drawHeight) / 2;
      } else {
        // Image is taller - fit to height
        drawWidth = height * imgAspectRatio;
        drawX = x + (width - drawWidth) / 2;
      }
    }

    // Add drop shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

    // Reset shadow
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowColor = 'transparent';
  } catch (error) {
    console.error('Error drawing image overlay:', error);
  }
};

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

// Preload all overlay images
export const preloadOverlayImages = async (): Promise<void> => {
  const imagePaths = [
    '/lovable-uploads/20a93d55-cfbc-417d-b442-a073caa5158f.png', // Turnt
    '/lovable-uploads/4b5069a8-223b-47a6-b22b-5439eade3e91.png', // Chill
    '/lovable-uploads/750b5511-5654-47b1-93a5-1bb9063ad60c.png', // Quiet
    '/lovable-uploads/4798e35a-824c-4ddc-9916-74b59aac299d.png'  // Logo
  ];

  try {
    await Promise.all(imagePaths.map(loadImage));
    console.log('All overlay images preloaded successfully');
  } catch (error) {
    console.warn('Some overlay images failed to preload:', error);
  }
};