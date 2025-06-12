import { VibeType, VibeConfiguration } from './VibeConfig';

export const drawOverlays = async (
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number,
  venueName: string,
  selectedVibe: VibeType,
  vibeConfig: Record<VibeType, VibeConfiguration>
): Promise<void> => {
  // Add color overlay filter
  ctx.fillStyle = vibeConfig[selectedVibe].overlayColor;
  ctx.fillRect(0, 0, width, height);

  // Venue name background
  const venueY = height * 0.1;
  const venueBackgroundHeight = height * 0.08;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.roundRect(width * 0.1, venueY - venueBackgroundHeight/2, width * 0.8, venueBackgroundHeight, 15);
  ctx.fill();

  // Venue name text with purple glow effect
  ctx.fillStyle = '#C26AF5';
  ctx.strokeStyle = 'rgba(194, 106, 245, 0.5)';
  ctx.lineWidth = 8;
  ctx.font = `bold ${Math.floor(width * 0.06)}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  
  // Create glow effect
  ctx.shadowColor = 'rgba(194, 106, 245, 0.8)';
  ctx.shadowBlur = 20;
  ctx.strokeText(venueName, width / 2, venueY);
  ctx.fillText(venueName, width / 2, venueY);
  ctx.shadowBlur = 0;

  // Vibe badge in bottom-left
  const badgeText = vibeConfig[selectedVibe].badge;
  const badgeX = width * 0.05;
  const badgeY = height * 0.85;
  const badgeWidth = width * 0.3;
  const badgeHeight = height * 0.08;

  // Badge colors matching live view
  const badgeColors = {
    turnt: '#FF3B1F',
    decent: '#B47AFF',
    chill: '#4BD5FF'
  };

  // Badge background with rounded corners and shadow
  ctx.fillStyle = badgeColors[selectedVibe];
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetX = 4;
  ctx.shadowOffsetY = 4;
  ctx.roundRect(badgeX, badgeY - badgeHeight, badgeWidth, badgeHeight, badgeHeight / 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Badge glow effect
  ctx.shadowColor = badgeColors[selectedVibe];
  ctx.shadowBlur = 15;
  ctx.roundRect(badgeX, badgeY - badgeHeight, badgeWidth, badgeHeight, badgeHeight / 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Badge text
  ctx.fillStyle = 'white';
  ctx.font = `bold ${Math.floor(width * 0.045)}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(badgeText, badgeX + badgeWidth / 2, badgeY - badgeHeight / 2 + height * 0.015);

  // TurntUp logo in bottom-right
  try {
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    
    return new Promise<void>((resolve) => {
      logoImg.onload = () => {
        const logoSize = width * 0.15;
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
  vibeConfig: Record<VibeType, VibeConfiguration>
): Promise<string | null> => {
  if (!videoRef.current || !canvasRef.current) return null;

  const canvas = canvasRef.current;
  const video = videoRef.current;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return null;

  // Set canvas size to match video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Apply vibe filter
  ctx.filter = vibeConfig[selectedVibe].filter;
  
  // Draw video frame
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Reset filter for overlays
  ctx.filter = 'none';

  // Draw overlays (await for logo loading)
  await drawOverlays(ctx, canvas.width, canvas.height, venueName, selectedVibe, vibeConfig);

  // Convert to image
  return canvas.toDataURL('image/jpeg', 0.9);
};