import React, { useEffect } from 'react';

// This component loads the Google Maps API key from Supabase secrets
const GoogleMapLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Replace the API key placeholder with the actual secret
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return <>{children}</>;
};

export default GoogleMapLoader;