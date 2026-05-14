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
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4facfe" />
            <stop offset="40%" stopColor="#8a2be2" />
            <stop offset="70%" stopColor="#f093fb" />
            <stop offset="100%" stopColor="#f6d365" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Soft, rounded, 3D looking V */}
        <path 
          d="M20 25 C 20 25, 40 85, 50 85 C 60 85, 80 25, 80 25 C 80 25, 75 22, 70 25 C 70 25, 55 70, 50 70 C 45 70, 30 25, 30 25 C 30 25, 25 22, 20 25" 
          fill="url(#logoGradient)"
          filter="url(#glow)"
        />
        
        {/* Overlapping fold for 3D effect */}
        <path 
          d="M50 85 C 60 85, 80 25, 80 25 C 80 25, 75 22, 70 25 C 70 25, 55 70, 50 70" 
          fill="rgba(0,0,0,0.15)"
        />
      </svg>
    </div>
  );
};

export default Logo;
