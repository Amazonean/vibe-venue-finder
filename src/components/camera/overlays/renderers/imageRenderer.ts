import { loadImage } from '../utils/imageCache';

export const drawImageOverlay = async (
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