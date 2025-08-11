// Cache for loaded images
const imageCache = new Map<string, HTMLImageElement>();

export const loadImage = async (src: string): Promise<HTMLImageElement> => {
  if (imageCache.has(src)) {
    return imageCache.get(src)!;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    
    img.onerror = () => {
      reject(new Error(`Failed to load image: ${src}`));
    };
    
    img.src = src;
  });
};

// Preload all overlay images
export const preloadOverlayImages = async (): Promise<void> => {
  const imagePaths = [
    '/lovable-uploads/0dc1d262-1376-40b9-b7df-d4f9f9f3e576.png', // Turnt
    '/lovable-uploads/a3037181-7ea9-4b1a-a45f-3587fddeb3ad.png', // Chill
    '/lovable-uploads/aeb22338-3739-4a42-b534-1c81ec69ff48.png'  // Quiet
  ];

  try {
    await Promise.all(imagePaths.map(loadImage));
    console.log('All overlay images preloaded successfully');
  } catch (error) {
    console.warn('Some overlay images failed to preload:', error);
  }
};