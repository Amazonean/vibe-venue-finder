import React from 'react';

const LogoOverlay: React.FC = () => {
  return (
    <div className="absolute bottom-8 right-4">
      <img 
        src="/lovable-uploads/4798e35a-824c-4ddc-9916-74b59aac299d.png"
        alt="TurntUp Logo"
        className="w-20 h-auto drop-shadow-lg"
        style={{
          filter: 'drop-shadow(2px 2px 8px rgba(0, 0, 0, 0.8))'
        }}
      />
    </div>
  );
};

export default LogoOverlay;