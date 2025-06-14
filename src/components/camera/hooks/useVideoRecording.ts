import { useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useVideoRecording = (venueName: string, selectedVibe: string) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const startVideoRecording = async (streamRef: React.RefObject<MediaStream | null>) => {
    if (!streamRef.current) return;
    
    setIsRecording(true);
    setRecordingTime(0);
    recordedChunksRef.current = [];
    
    try {
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: 'video/webm'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        
        // Create download link for the video
        const link = document.createElement('a');
        link.href = url;
        link.download = `vibe-video-${venueName.replace(/\s+/g, '-')}-${selectedVibe}.webm`;
        link.click();
        
        toast({
          title: "Video Recorded",
          description: "Your 10-second vibe video has been saved!",
        });
        
        URL.revokeObjectURL(url);
      };
      
      mediaRecorder.start();
      
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
    setRecordingTime(0);
  };

  return {
    isRecording,
    recordingTime,
    startVideoRecording,
    stopVideoRecording
  };
};