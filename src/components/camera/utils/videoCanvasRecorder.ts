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
    // Set canvas size to match video in portrait orientation
    this.canvas.width = videoElement.videoHeight; // Swap width/height for portrait
    this.canvas.height = videoElement.videoWidth;

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

      this.ctx.save();

      // Rotate canvas 90 degrees for portrait orientation
      this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.rotate(Math.PI / 2);
      this.ctx.translate(-this.canvas.height / 2, -this.canvas.width / 2);

      // Apply filter
      this.ctx.filter = options.currentFilter;

      // Draw video frame
      this.ctx.drawImage(videoElement, 0, 0, this.canvas.height, this.canvas.width);

      // Reset filter for overlays
      this.ctx.filter = 'none';

      this.ctx.restore();

      // Draw overlays on the rotated canvas
      await drawOverlays(
        this.ctx, 
        this.canvas.width, 
        this.canvas.height, 
        options.venueName, 
        options.selectedVibe, 
        options.vibeConfig
      );

      if (this.mediaRecorder?.state === 'recording') {
        this.animationId = requestAnimationFrame(drawFrame);
      }
    };

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