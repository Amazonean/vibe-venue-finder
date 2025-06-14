import { VibeType, VibeConfiguration } from '../VibeConfig';

const getVibeBadgeImage = (vibe: VibeType): string => {
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

const drawFallbackBadge = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  selectedVibe: VibeType,
  vibeConfig: Record<VibeType, VibeConfiguration>
): void => {
  const badgeText = vibeConfig[selectedVibe].badge;
  const badgeX = width * 0.05;
  const badgeY = height * 0.85;
  const badgeWidth = width * 0.25;
  const badgeHeight = height * 0.06;

  const badgeColors = {
    turnt: '#FF3B1F',
    chill: '#B47AFF',
    quiet: '#4BD5FF'
  };

  ctx.fillStyle = badgeColors[selectedVibe];
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.roundRect(badgeX, badgeY - badgeHeight, badgeWidth, badgeHeight, badgeHeight / 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  ctx.fillStyle = 'white';
  ctx.font = `bold ${Math.floor(width * 0.035)}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(badgeText, badgeX + badgeWidth / 2, badgeY - badgeHeight / 2 + height * 0.01);
};

export const drawVibeBadge = async (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  selectedVibe: VibeType,
  vibeConfig: Record<VibeType, VibeConfiguration>
): Promise<void> => {
  try {
    const vibeBadgeImg = new Image();
    vibeBadgeImg.crossOrigin = 'anonymous';
    
    return new Promise<void>((resolve) => {
      vibeBadgeImg.onload = () => {
        const badgeSize = width * 0.18;
        const badgeX = width * 0.05;
        const badgeY = height * 0.18; // Position at top-18 equivalent
        
        // Add drop shadow for vibe badge
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        ctx.drawImage(vibeBadgeImg, badgeX, badgeY, badgeSize, badgeSize * (vibeBadgeImg.height / vibeBadgeImg.width));
        
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        resolve();
      };
      
      vibeBadgeImg.onerror = () => {
        drawFallbackBadge(ctx, width, height, selectedVibe, vibeConfig);
        resolve();
      };
      
      vibeBadgeImg.src = getVibeBadgeImage(selectedVibe);
    });
  } catch (error) {
    console.error('Error loading vibe badge:', error);
    drawFallbackBadge(ctx, width, height, selectedVibe, vibeConfig);
  }
};