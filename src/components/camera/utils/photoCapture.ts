import { VibeType, VibeConfiguration } from '../VibeConfig';
import { renderCanvasOverlays } from '../overlays/CanvasOverlayRenderer';

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

  // Apply the filter if one is selected
  if (currentFilter && currentFilter !== 'none') {
    ctx.filter = currentFilter;
  } else {
    ctx.filter = 'none';
  }
  
  // Draw the video frame to canvas with filter applied
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Reset filter before drawing overlays
  ctx.filter = 'none';

  // Draw overlays using unified system
  const config = {
    dimensions: { width: canvas.width, height: canvas.height },
    overlays: {
      venueName: {
        x: canvas.width * 0.05,
        y: canvas.height * 0.08,
        width: canvas.width * 0.9,
        height: canvas.height * 0.08,
        fontSize: Math.floor(canvas.width * 0.06),
        padding: canvas.width * 0.04,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        textColor: '#8B5CF6',
        textShadow: '0 0 20px rgba(139, 92, 246, 0.8), 0 2px 4px rgba(0, 0, 0, 0.9)'
      },
      vibeBadge: {
        x: canvas.width * 0.05,
        y: canvas.height * 0.18,
        width: Math.min(224, canvas.width * 0.6),
        height: Math.min(156, canvas.height * 0.2)
      },
      logo: {
        x: canvas.width - 80 - (canvas.width * 0.05),
        y: canvas.height - 80 - (canvas.height * 0.05),
        width: 80,
        height: 80
      }
    },
    responsive: { isSmallScreen: false, scaleFactor: 1 }
  };
  await renderCanvasOverlays(ctx, config, venueName, selectedVibe, vibeConfig);

  // Convert to image
  return canvas.toDataURL('image/jpeg', 0.9);
};