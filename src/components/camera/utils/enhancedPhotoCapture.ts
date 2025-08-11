import { VibeType, VibeConfiguration } from '../VibeConfig';
import { renderCanvasOverlays } from '../overlays/CanvasOverlayRenderer';
import { createMediaConfiguration } from '../config/MediaConfig';

export const captureEnhancedPhoto = async (
  videoRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  venueName: string,
  selectedVibe: VibeType,
  vibeConfig: Record<VibeType, VibeConfiguration>,
  currentFilter: string,
  zoomScale: number = 1
): Promise<string | null> => {
  if (!videoRef.current || !canvasRef.current) {
    console.error('Video or canvas ref not available');
    return null;
  }

  const video = videoRef.current;
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    console.error('Could not get canvas context');
    return null;
  }

  try {
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply filter if specified
    if (currentFilter && currentFilter !== 'none') {
      ctx.filter = currentFilter;
    } else {
      ctx.filter = 'none';
    }

    // Draw the video frame with filter and digital zoom if needed
    const zoom = Math.max(1, zoomScale ?? 1);
    if (zoom > 1) {
      const srcW = video.videoWidth / zoom;
      const srcH = video.videoHeight / zoom;
      const sx = (video.videoWidth - srcW) / 2;
      const sy = (video.videoHeight - srcH) / 2;
      ctx.drawImage(video, sx, sy, srcW, srcH, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    // Reset filter before drawing overlays
    ctx.filter = 'none';

    // Draw overlays using unified system
    const config = createMediaConfiguration(canvas.width, canvas.height);
    await renderCanvasOverlays(ctx, config, venueName, selectedVibe, vibeConfig);

    // Convert to data URL
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    return dataUrl;
  } catch (error) {
    console.error('Error capturing photo:', error);
    return null;
  }
};