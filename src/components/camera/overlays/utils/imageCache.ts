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
    '/lovable-uploads/d1bee350-8142-4601-b853-a5fdd7672d20.png', // Turnt
    '/lovable-uploads/d0c24398-1f3d-49ba-a4a6-fd4f3d80d1e1.png', // Chill
    '/lovable-uploads/404d6f24-b71f-4c3b-acf0-f2ef07dd4b21.png'  // Quiet
  ];

  try {
    await Promise.all(imagePaths.map(loadImage));
    console.log('All overlay images preloaded successfully');
  } catch (error) {
    console.warn('Some overlay images failed to preload:', error);
  }
};