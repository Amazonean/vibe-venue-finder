export const VIBE_FRAME = {
  scale: 0.98,           // Slightly smaller than full frame
  translateY: 0.012,     // Shift down by 1.2%
  marginPct: 0.01        // 1% margin on canvas overlays
} as const;

export type VibeFrameConfig = typeof VIBE_FRAME;
