import React from 'react';

interface PageBackgroundProps {
  lightSrc: string;
  darkSrc: string;
  className?: string;
  children: React.ReactNode;
}

const PageBackground: React.FC<PageBackgroundProps> = ({ lightSrc, darkSrc, className, children }) => {
  return (
    <section className={`relative min-h-screen pb-20 overflow-hidden ${className ?? ''}`}>
      {/* Light mode background */}
      <img
        src={lightSrc}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="fixed inset-0 z-0 h-full w-full object-cover opacity-90 block dark:hidden pointer-events-none"
      />
      {/* Dark mode background */}
      <img
        src={darkSrc}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="fixed inset-0 z-0 h-full w-full object-cover opacity-90 hidden dark:block pointer-events-none"
      />
      {/* Subtle overlay for readability */}
      <div className="pointer-events-none fixed inset-0 z-10 bg-gradient-to-b from-background/60 via-background/30 to-background/80" />

      <div className="relative z-20">{children}</div>
    </section>
  );
};

export default PageBackground;
