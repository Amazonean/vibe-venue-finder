import { loadImage } from '../utils/imageCache';

export const drawImageOverlay = async (
  ctx: CanvasRenderingContext2D,
  imagePath: string,
  x: number,
  y: number,
  width: number,
  height: number,
  fit: 'contain' | 'cover' = 'contain'
): Promise<void> => {
  try {
    const img = await loadImage(imagePath);
    
    let drawWidth = width;
    let drawHeight = height;
    let drawX = x;
    let drawY = y;

    if (fit === 'contain') {
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
    } else if (fit === 'cover') {
      // Fill the target area edge-to-edge, cropping overflow
      const imgAspectRatio = img.width / img.height;
      const targetAspectRatio = width / height;

      if (imgAspectRatio > targetAspectRatio) {
        // Image is wider - match height, crop sides
        drawHeight = height;
        drawWidth = height * imgAspectRatio;
        drawX = x + (width - drawWidth) / 2;
        drawY = y;
      } else {
        // Image is taller - match width, crop top/bottom
        drawWidth = width;
        drawHeight = width / imgAspectRatio;
        drawX = x;
        drawY = y + (height - drawHeight) / 2;
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