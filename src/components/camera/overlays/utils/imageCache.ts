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
    '/lovable-uploads/20a93d55-cfbc-417d-b442-a073caa5158f.png', // Turnt
    '/lovable-uploads/4b5069a8-223b-47a6-b22b-5439eade3e91.png', // Chill
    '/lovable-uploads/750b5511-5654-47b1-93a5-1bb9063ad60c.png', // Quiet
    '/lovable-uploads/4798e35a-824c-4ddc-9916-74b59aac299d.png'  // Logo
  ];

  try {
    await Promise.all(imagePaths.map(loadImage));
    console.log('All overlay images preloaded successfully');
  } catch (error) {
    console.warn('Some overlay images failed to preload:', error);
  }
};