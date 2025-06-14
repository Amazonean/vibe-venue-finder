import { VibeType, VibeConfiguration } from '../VibeConfig';
import { drawOverlays } from '../overlays';

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

  // Draw overlays (await for logo loading)
  await drawOverlays(ctx, canvas.width, canvas.height, venueName, selectedVibe, vibeConfig);

  // Convert to image
  return canvas.toDataURL('image/jpeg', 0.9);
};