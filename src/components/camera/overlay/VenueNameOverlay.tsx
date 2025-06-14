import React from 'react';

interface VenueNameOverlayProps {
  venueName: string;
}

const VenueNameOverlay: React.FC<VenueNameOverlayProps> = ({ venueName }) => {
  return (
    <div className="absolute top-8 left-0 right-0 text-center px-4 z-10">
      <div className="inline-block bg-black/40 px-4 py-2 rounded-lg max-w-[90%]">
        <h1 
          className="text-2xl sm:text-3xl font-bold uppercase drop-shadow-lg leading-tight"
          style={{ 
            color: '#C26AF5',
            textShadow: '0 0 10px rgba(194, 106, 245, 0.5), 0 2px 4px rgba(0, 0, 0, 0.8)',
            wordWrap: 'break-word',
            hyphens: 'auto'
          }}
        >
          {venueName}
        </h1>
      </div>
    </div>
  );
};

export default VenueNameOverlay;