export interface FilterDefinition {
  id: string;
  name: string;
  cssFilter: string;
  webglShader?: string; // For future WebGL implementation
}

export const FILTER_DEFINITIONS: FilterDefinition[] = [
  {
    id: 'none',
    name: 'Original',
    cssFilter: 'none'
  },
  {
    id: 'clarendon',
    name: 'Clarendon',
    cssFilter: 'brightness(1.1) contrast(1.2) saturate(1.35)'
  },
  {
    id: 'juno',
    name: 'Juno',
    cssFilter: 'sepia(0.3) saturate(1.4) hue-rotate(15deg) brightness(1.1)'
  },
  {
    id: 'gingham',
    name: 'Gingham',
    cssFilter: 'sepia(0.4) saturate(0.8) brightness(1.1) contrast(0.9)'
  },
  {
    id: 'vintage',
    name: 'Vintage',
    cssFilter: 'sepia(0.6) contrast(1.1) brightness(0.9) saturate(1.2)'
  },
  {
    id: 'warm',
    name: 'Warm',
    cssFilter: 'sepia(0.2) saturate(1.3) hue-rotate(10deg) brightness(1.05)'
  }
];

export const getFilterById = (filterId: string): FilterDefinition => {
  return FILTER_DEFINITIONS.find(f => f.id === filterId) || FILTER_DEFINITIONS[0];
};

export const getNextFilter = (currentFilterId: string): FilterDefinition => {
  const currentIndex = FILTER_DEFINITIONS.findIndex(f => f.id === currentFilterId);
  const nextIndex = (currentIndex + 1) % FILTER_DEFINITIONS.length;
  return FILTER_DEFINITIONS[nextIndex];
};

export const getPreviousFilter = (currentFilterId: string): FilterDefinition => {
  const currentIndex = FILTER_DEFINITIONS.findIndex(f => f.id === currentFilterId);
  const prevIndex = currentIndex === 0 ? FILTER_DEFINITIONS.length - 1 : currentIndex - 1;
  return FILTER_DEFINITIONS[prevIndex];
};