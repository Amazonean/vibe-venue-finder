import { VibeType, VibeConfiguration } from '../VibeConfig';
import { drawOverlays } from '../overlays';

export interface VideoRecorderOptions {
  venueName: string;
  selectedVibe: VibeType;
  currentFilter: string;
  vibeConfig: Record<VibeType, VibeConfiguration>;
}

export class VideoCanvasRecorder {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private mediaRecorder: MediaRecorder | null = null;
  private animationId: number | null = null;
  private isRecordingRef: { current: boolean };

  constructor(isRecordingRef: { current: boolean }) {
    this.canvas = document.createElement('canvas');
    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    this.ctx = ctx;
    this.isRecordingRef = isRecordingRef;
  }

  async setupRecording(
    videoElement: HTMLVideoElement,
    audioStream: MediaStream,
    options: VideoRecorderOptions
  ): Promise<MediaRecorder> {
    // Set canvas size to match video (no swapping for correct orientation)
    this.canvas.width = videoElement.videoWidth;
    this.canvas.height = videoElement.videoHeight;

    // Get canvas stream for recording
    const canvasStream = this.canvas.captureStream(30); // 30 FPS

    // Add audio track from original stream to canvas stream
    const audioTrack = audioStream.getAudioTracks()[0];
    if (audioTrack) {
      canvasStream.addTrack(audioTrack);
    }

    this.mediaRecorder = new MediaRecorder(canvasStream, {
      mimeType: 'video/webm;codecs=vp8,opus'
    });

    // Start the animation loop
    this.startDrawingFrames(videoElement, options);

    return this.mediaRecorder;
  }

  private startDrawingFrames(
    videoElement: HTMLVideoElement,
    options: VideoRecorderOptions
  ): void {
    const drawFrame = async () => {
      if (!this.isRecordingRef.current) return;

      // Clear canvas first
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Apply filter if specified and not 'none'
      if (options.currentFilter && options.currentFilter !== 'none') {
        this.ctx.filter = options.currentFilter;
      } else {
        this.ctx.filter = 'none';
      }

      // Draw video frame with filter applied
      this.ctx.drawImage(videoElement, 0, 0, this.canvas.width, this.canvas.height);

      // Reset filter before drawing overlays
      this.ctx.filter = 'none';

      // Draw overlays on top
      try {
        await drawOverlays(
          this.ctx, 
          this.canvas.width, 
          this.canvas.height, 
          options.venueName, 
          options.selectedVibe, 
          options.vibeConfig
        );
      } catch (error) {
        console.error('Error drawing overlays:', error);
      }

      // Continue animation loop while recording
      if (this.isRecordingRef.current && this.mediaRecorder?.state === 'recording') {
        this.animationId = requestAnimationFrame(drawFrame);
      }
    };

    // Start drawing immediately and continuously
    drawFrame();
  }

  stopDrawing(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  cleanup(): void {
    this.stopDrawing();
    this.mediaRecorder = null;
  }
}