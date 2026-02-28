import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizes = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-32 h-32'
  };

  return (
    <div className={`relative flex items-center justify-center ${sizes[size]} ${className}`}>
      {/* Neural Pulse Rings */}
      <div className="absolute inset-0 rounded-full border border-blue-500/30 animate-neural-pulse" />
      <div className="absolute inset-0 rounded-full border border-blue-400/20 animate-neural-pulse [animation-delay:1s]" />
      <div className="absolute inset-0 rounded-full border border-blue-300/10 animate-neural-pulse [animation-delay:2s]" />
      
      {/* Minimalist V */}
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        className="w-full h-full logo-glow relative z-10"
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path 
          d="M5 8l7 8 7-8" 
          className="text-white"
          style={{ filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.5))' }}
        />
      </svg>
    </div>
  );
};

export default Logo;
