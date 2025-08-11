import { useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { VibeType, VibeConfiguration } from '../VibeConfig';
import { VideoCanvasRecorder } from '../utils/videoCanvasRecorder';
import { downloadVideo } from '../utils/videoDownloader';
import { RecordingTimer } from '../utils/recordingTimer';

export const useVideoRecording = (venueName: string, selectedVibe: VibeType, onVideoCapture: (videoDataUrl: string) => void) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const isRecordingRef = useRef(false);
  const canvasRecorderRef = useRef<VideoCanvasRecorder | null>(null);
  const timerRef = useRef<RecordingTimer | null>(null);
  const { toast } = useToast();

  const startVideoRecording = async (
    streamRef: React.RefObject<MediaStream | null>,
    videoRef: React.RefObject<HTMLVideoElement>,
    currentFilter: string,
    vibeConfig: Record<VibeType, VibeConfiguration>,
    zoomScale: number = 1
  ) => {
    if (!streamRef.current || !videoRef.current) return;
    
    setIsRecording(true);
    isRecordingRef.current = true;
    setRecordingTime(0);
    recordedChunksRef.current = [];
    
    try {
      // Create canvas recorder
      canvasRecorderRef.current = new VideoCanvasRecorder(isRecordingRef);
      
      const mediaRecorder = await canvasRecorderRef.current.setupRecording(
        videoRef.current,
        streamRef.current,
        { venueName, selectedVibe, currentFilter, vibeConfig, zoomScale }
      );
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        // Create video blob and data URL for preview
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const videoDataUrl = URL.createObjectURL(blob);
        
        onVideoCapture(videoDataUrl);
        
        toast({
          title: "Video Recorded",
          description: "Your 10-second vibe video is ready for preview!",
        });
        
        cleanup();
      };
      
      mediaRecorder.start();
      
      // Start timer
      timerRef.current = new RecordingTimer(
        setRecordingTime,
        stopVideoRecording,
        10
      );
      timerRef.current.start();
      
    } catch (error) {
      console.error('Video recording error:', error);
      setIsRecording(false);
      isRecordingRef.current = false;
      cleanup();
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
    
    setIsRecording(false);
    isRecordingRef.current = false;
    setRecordingTime(0);
  };

  const cleanup = () => {
    timerRef.current?.cleanup();
    canvasRecorderRef.current?.cleanup();
    timerRef.current = null;
    canvasRecorderRef.current = null;
  };

  return {
    isRecording,
    recordingTime,
    startVideoRecording,
    stopVideoRecording
  };
};