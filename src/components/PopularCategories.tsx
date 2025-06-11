import React from 'react';

const categories = ['Clubs', 'Bars', 'Restaurants', 'Live Music'];

const PopularCategories: React.FC = () => {
  return (
    <div className="flex gap-3 flex-wrap mb-4">
      {categories.map((category) => (
        <div 
          key={category}
          className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-muted pl-4 pr-4"
        >
          <p className="text-white text-sm font-medium leading-normal">{category}</p>
        </div>
      ))}
    </div>
  );
};

export default PopularCategories;