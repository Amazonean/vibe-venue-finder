import { VibeType, VibeConfiguration } from './VibeConfig';

export interface CameraOverlayProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  venueName: string;
  selectedVibe: VibeType;
  vibeConfig: Record<VibeType, VibeConfiguration>;
  countdown: number | null;
  showPosePrompt: boolean;
  cameraError: string | null;
  onStartCountdown: () => void;
  onStartCamera: () => void;
  currentFilter?: string;
  onFilterChange?: (filter: string) => void;
  isRecording?: boolean;
  recordingTime?: number;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
}

// Filter types moved to config/FilterConfig.ts