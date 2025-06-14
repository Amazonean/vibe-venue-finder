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

export interface Filter {
  name: string;
  style: string;
}

export const filters: Filter[] = [
  { name: 'Default', style: 'none' },
  { name: 'Clarendon', style: 'brightness(1.1) contrast(1.2) saturate(1.35)' },
  { name: 'Juno', style: 'sepia(0.3) saturate(1.4) hue-rotate(15deg) brightness(1.1)' },
  { name: 'Gingham', style: 'sepia(0.4) saturate(0.8) brightness(1.1) contrast(0.9)' }
];