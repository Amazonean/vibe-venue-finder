import React, { useRef } from 'react';

interface CameraButtonProps {
  countdown: number | null;
  isRecording: boolean;
  recordingTime: number;
  onStartCountdown: () => void;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
}

const CameraButton: React.FC<CameraButtonProps> = ({
  countdown,
  isRecording,
  recordingTime,
  onStartCountdown,
  onStartRecording,
  onStopRecording
}) => {
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  if (countdown) return null;

  return (
    <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-auto">
      <button
        onClick={onStartCountdown}
        onContextMenu={(e) => {
          e.preventDefault();
          if (onStartRecording) {
            onStartRecording();
          }
        }}
        onMouseDown={(e) => {
          // Only start recording on long press (right click or hold)
          if (e.button === 0 && onStartRecording) { // Left mouse button
            longPressTimerRef.current = setTimeout(() => {
              onStartRecording();
            }, 500); // 500ms long press
          }
        }}
        onMouseUp={() => {
          if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
          }
          if (onStopRecording) {
            onStopRecording();
          }
        }}
        onTouchStart={() => {
          if (onStartRecording) {
            longPressTimerRef.current = setTimeout(() => {
              onStartRecording();
            }, 500); // 500ms long press
          }
        }}
        onTouchEnd={() => {
          if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
          }
          if (onStopRecording) {
            onStopRecording();
          }
        }}
        className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 active:scale-95 relative group"
        style={{
          background: 'linear-gradient(145deg, #C26AF5, #8A3FFC)',
          boxShadow: '0 8px 32px rgba(194, 106, 245, 0.4), inset 0 2px 8px rgba(255, 255, 255, 0.2), inset 0 -2px 8px rgba(0, 0, 0, 0.3)',
          border: '3px solid rgba(43, 43, 64, 0.8)',
        }}
      >
        {/* Glow effect */}
        <div 
          className="absolute inset-0 rounded-full animate-pulse"
          style={{
            background: 'linear-gradient(145deg, #C26AF5, #8A3FFC)',
            filter: 'blur(8px)',
            opacity: '0.6',
            zIndex: -1,
          }}
        />
        
        {/* Camera icon */}
        <div className="relative">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            className="text-white drop-shadow-lg group-active:scale-90 transition-transform duration-100"
          >
            <path 
              d="M9 3H15L17 5H21C21.5523 5 22 5.44772 22 6V18C22 18.5523 21.5523 19 21 19H3C2.44772 19 2 18.5523 2 18V6C2 5.44772 2.44772 5 3 5H7L9 3Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <circle 
              cx="12" 
              cy="12" 
              r="3" 
              stroke="currentColor" 
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Recording progress ring for video mode */}
        {isRecording && (
          <div className="absolute inset-0 rounded-full">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/30"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                d="M18 2.5a15.5 15.5 0 1 1 0 31 15.5 15.5 0 1 1 0-31"
              />
              <path
                className="text-white"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeDasharray={`${(recordingTime / 10) * 97.4}, 97.4`}
                d="M18 2.5a15.5 15.5 0 1 1 0 31 15.5 15.5 0 1 1 0-31"
              />
            </svg>
          </div>
        )}
      </button>
    </div>
  );
};

export default CameraButton;