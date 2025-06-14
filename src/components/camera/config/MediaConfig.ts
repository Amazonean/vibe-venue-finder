export interface MediaDimensions {
  width: number;
  height: number;
}

export interface OverlayPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface MediaConfiguration {
  dimensions: MediaDimensions;
  overlays: {
    venueName: OverlayPosition & {
      fontSize: number;
      padding: number;
      backgroundColor: string;
      textColor: string;
      textShadow: string;
    };
    vibeBadge: OverlayPosition;
    logo: OverlayPosition;
  };
  responsive: {
    isSmallScreen: boolean;
    scaleFactor: number;
  };
}

export const createMediaConfiguration = (
  containerWidth: number,
  containerHeight: number
): MediaConfiguration => {
  const isSmallScreen = containerWidth < 768;
  const scaleFactor = Math.min(containerWidth / 390, containerHeight / 844); // Based on iPhone 12 Pro
  
  const safeScaleFactor = Math.max(0.5, Math.min(2, scaleFactor));
  
  return {
    dimensions: {
      width: containerWidth,
      height: containerHeight
    },
    overlays: {
      venueName: {
        x: containerWidth * 0.05,
        y: containerHeight * 0.08,
        width: containerWidth * 0.9,
        height: containerHeight * 0.08,
        fontSize: Math.floor(containerWidth * 0.06 * safeScaleFactor),
        padding: containerWidth * 0.04,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        textColor: '#C26AF5',
        textShadow: '0 0 20px rgba(194, 106, 245, 0.8), 0 2px 4px rgba(0, 0, 0, 0.9)'
      },
      vibeBadge: {
        x: containerWidth * 0.05,
        y: containerHeight * 0.18,
        width: Math.min(224 * safeScaleFactor, containerWidth * 0.6),
        height: Math.min(224 * safeScaleFactor * 0.7, containerHeight * 0.2)
      },
      logo: {
        x: containerWidth - (80 * safeScaleFactor) - (containerWidth * 0.05),
        y: containerHeight - (80 * safeScaleFactor) - (containerHeight * 0.05),
        width: 80 * safeScaleFactor,
        height: 80 * safeScaleFactor
      }
    },
    responsive: {
      isSmallScreen,
      scaleFactor: safeScaleFactor
    }
  };
};