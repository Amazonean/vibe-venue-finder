const drawFallbackLogo = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void => {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  const logoSize = width * 0.12;
  ctx.fillRect(width - logoSize - width * 0.05, height - logoSize - height * 0.05, logoSize, logoSize);
  
  ctx.fillStyle = 'white';
  ctx.font = `bold ${Math.floor(logoSize * 0.3)}px Arial`;
  ctx.textAlign = 'center';
  ctx.fillText('TURNT', width - logoSize / 2 - width * 0.05, height - logoSize / 2 - height * 0.05 + logoSize * 0.1);
};

export const drawTurntUpLogo = async (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): Promise<void> => {
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
        drawFallbackLogo(ctx, width, height);
        resolve();
      };
      
      logoImg.src = '/lovable-uploads/4798e35a-824c-4ddc-9916-74b59aac299d.png';
    });
  } catch (error) {
    console.error('Error loading TurntUp logo:', error);
    drawFallbackLogo(ctx, width, height);
  }
};