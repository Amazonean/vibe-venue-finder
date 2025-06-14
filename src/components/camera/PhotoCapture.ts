import { VibeType, VibeConfiguration } from './VibeConfig';

export const drawOverlays = async (
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number,
  venueName: string,
  selectedVibe: VibeType,
  vibeConfig: Record<VibeType, VibeConfiguration>
): Promise<void> => {
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

  // Custom Vibe Badge - Bottom left
  const getVibeBadgeImage = (vibe: VibeType) => {
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

  try {
    const vibeBadgeImg = new Image();
    vibeBadgeImg.crossOrigin = 'anonymous';
    
    await new Promise<void>((resolve) => {
      vibeBadgeImg.onload = () => {
        const badgeSize = width * 0.15;
        const badgeX = width * 0.05;
        const badgeY = height - badgeSize - height * 0.15;
        
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
        // Fallback to text badge if image fails to load
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
        
        resolve();
      };
      
      vibeBadgeImg.src = getVibeBadgeImage(selectedVibe);
    });
  } catch (error) {
    console.error('Error loading vibe badge:', error);
  }

  // TurntUp logo in bottom-right
  try {
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    
    return new Promise<void>((resolve) => {
      logoImg.onload = () => {
        const logoSize = width * 0.12;
        const logoX = width - logoSize - width * 0.05;
        const logoY = height - logoSize - height * 0.05;
        
        // Add drop shadow for logo
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize * (logoImg.height / logoImg.width));
        
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        resolve();
      };
      
      logoImg.onerror = () => {
        // Fallback to text if image fails to load
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        const logoSize = width * 0.12;
        ctx.fillRect(width - logoSize - width * 0.05, height - logoSize - height * 0.05, logoSize, logoSize);
        
        ctx.fillStyle = 'white';
        ctx.font = `bold ${Math.floor(logoSize * 0.3)}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('TURNT', width - logoSize / 2 - width * 0.05, height - logoSize / 2 - height * 0.05 + logoSize * 0.1);
        
        resolve();
      };
      
      logoImg.src = '/lovable-uploads/4798e35a-824c-4ddc-9916-74b59aac299d.png';
    });
  } catch (error) {
    // Fallback to text
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    const logoSize = width * 0.12;
    ctx.fillRect(width - logoSize - width * 0.05, height - logoSize - height * 0.05, logoSize, logoSize);
    
    ctx.fillStyle = 'white';
    ctx.font = `bold ${Math.floor(logoSize * 0.3)}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('TURNT', width - logoSize / 2 - width * 0.05, height - logoSize / 2 - height * 0.05 + logoSize * 0.1);
  }
};

export const capturePhoto = async (
  videoRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  venueName: string,
  selectedVibe: VibeType,
  vibeConfig: Record<VibeType, VibeConfiguration>,
  currentFilter: string = 'none'
): Promise<string | null> => {
  if (!videoRef.current || !canvasRef.current) return null;

  const canvas = canvasRef.current;
  const video = videoRef.current;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return null;

  // Set canvas size to match video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Apply current filter instead of vibe-specific filter
  ctx.filter = currentFilter;
  
  // Draw video frame
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Reset filter for overlays
  ctx.filter = 'none';

  // Draw overlays (await for logo loading)
  await drawOverlays(ctx, canvas.width, canvas.height, venueName, selectedVibe, vibeConfig);

  // Convert to image
  return canvas.toDataURL('image/jpeg', 0.9);
};