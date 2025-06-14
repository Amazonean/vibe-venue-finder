import React from 'react';

interface FilterNameDisplayProps {
  showFilterName: boolean;
  filterName: string;
}

const FilterNameDisplay: React.FC<FilterNameDisplayProps> = ({
  showFilterName,
  filterName
}) => {
  if (!showFilterName) return null;

  return (
    <div className="absolute top-1/2 left-0 right-0 text-center z-30">
      <div className="inline-block bg-black/70 px-6 py-3 rounded-full animate-fade-in backdrop-blur-sm">
        <p className="text-white text-lg font-semibold tracking-wide">
          {filterName}
        </p>
      </div>
    </div>
  );
};

export default FilterNameDisplay;