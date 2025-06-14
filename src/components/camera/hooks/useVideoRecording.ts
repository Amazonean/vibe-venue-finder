import { useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { VibeType, VibeConfiguration } from '../VibeConfig';
import { drawOverlays } from '../PhotoCapture';

export const useVideoRecording = (venueName: string, selectedVibe: VibeType) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isRecordingRef = useRef(false);
  const { toast } = useToast();

  const startVideoRecording = async (
    streamRef: React.RefObject<MediaStream | null>,
    videoRef: React.RefObject<HTMLVideoElement>,
    currentFilter: string,
    vibeConfig: Record<VibeType, VibeConfiguration>
  ) => {
    if (!streamRef.current || !videoRef.current) return;
    
    setIsRecording(true);
    isRecordingRef.current = true;
    setRecordingTime(0);
    recordedChunksRef.current = [];
    
    try {
      // Create canvas for recording with filters and overlays
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      
      const video = videoRef.current;
      
      // Set canvas size to match video in portrait orientation
      canvas.width = video.videoHeight; // Swap width/height for portrait
      canvas.height = video.videoWidth;
      
      // Get canvas stream for recording
      const canvasStream = canvas.captureStream(30); // 30 FPS
      
      // Add audio track from original stream to canvas stream
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        canvasStream.addTrack(audioTrack);
      }
      
      const mediaRecorder = new MediaRecorder(canvasStream, {
        mimeType: 'video/webm;codecs=vp8,opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      
      // Animation loop to draw frames with filters and overlays
      let animationId: number;
      const drawFrame = async () => {
        if (!isRecordingRef.current) return;
        
        ctx.save();
        
        // Rotate canvas 90 degrees for portrait orientation
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(Math.PI / 2);
        ctx.translate(-canvas.height / 2, -canvas.width / 2);
        
        // Apply filter
        ctx.filter = currentFilter;
        
        // Draw video frame
        ctx.drawImage(video, 0, 0, canvas.height, canvas.width);
        
        // Reset filter for overlays
        ctx.filter = 'none';
        
        ctx.restore();
        
        // Draw overlays on the rotated canvas
        await drawOverlays(ctx, canvas.width, canvas.height, venueName, selectedVibe, vibeConfig);
        
        if (mediaRecorderRef.current?.state === 'recording') {
          animationId = requestAnimationFrame(drawFrame);
        }
      };
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        cancelAnimationFrame(animationId);
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        
        // Create download link for the video
        const link = document.createElement('a');
        link.href = url;
        link.download = `vibe-video-${venueName.replace(/\s+/g, '-')}-${selectedVibe}.webm`;
        link.click();
        
        toast({
          title: "Video Recorded",
          description: "Your 10-second vibe video has been saved with filters and overlays!",
        });
        
        URL.revokeObjectURL(url);
      };
      
      mediaRecorder.start();
      drawFrame(); // Start the animation loop
      
      // Start timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 9) {
            stopVideoRecording();
            return 10;
          }
          return prev + 1;
        });
      }, 1000);
      
      // Auto-stop after 10 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          stopVideoRecording();
        }
      }, 10000);
      
    } catch (error) {
      console.error('Video recording error:', error);
      setIsRecording(false);
      isRecordingRef.current = false;
      toast({
        title: "Recording Failed",
        description: "Unable to record video. Please try again.",
        variant: "destructive"
      });
    }
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    
    setIsRecording(false);
    isRecordingRef.current = false;
    setRecordingTime(0);
  };

  return {
    isRecording,
    recordingTime,
    startVideoRecording,
    stopVideoRecording
  };
};