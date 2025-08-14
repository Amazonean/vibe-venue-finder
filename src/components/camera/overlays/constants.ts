export const VIBE_FRAME = {
  scale: 0.98,           // Slightly smaller than full frame
  translateY: 0.012,     // Shift down by 1.2% (base for turnt)
  marginPct: 0.01        // 1% margin on canvas overlays
} as const;

export const VIBE_POSITIONING = {
  turnt: { translateY: 0.012 },    // Base position
  chill: { translateY: 0.025 },    // Lower position
  quiet: { translateY: 0.025 }     // Lower position
} as const;

export type VibeFrameConfig = typeof VIBE_FRAME;
export type VibePositioning = typeof VIBE_POSITIONING;
