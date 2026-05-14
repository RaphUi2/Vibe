import React from 'react';

interface AILogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const AILogo: React.FC<AILogoProps> = ({ className = '', size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-14 h-14',
    lg: 'w-32 h-32'
  };

  return (
    <div className={`relative flex items-center justify-center ${sizes[size]} ${className}`}>
      {/* Background Pulse */}
      <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
      
      <svg viewBox="0 0 100 100" className="w-full h-full relative z-10">
        <defs>
          <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d2ff" />
            <stop offset="50%" stopColor="#3a7bd5" />
            <stop offset="100%" stopColor="#8e44ad" />
          </linearGradient>
          
          <filter id="aiGlow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* The "Brain" or "Aura" Core */}
        <circle cx="50" cy="50" r="35" fill="black" stroke="url(#aiGradient)" strokeWidth="0.5" opacity="0.5" />
        
        {/* Dynamic Nodes */}
        <circle cx="50" cy="50" r="15" fill="url(#aiGradient)" filter="url(#aiGlow)">
            <animate attributeName="r" values="15;18;15" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
        </circle>

        {/* Orbit Rings */}
        <ellipse cx="50" cy="50" rx="40" ry="15" fill="none" stroke="url(#aiGradient)" strokeWidth="1" opacity="0.4" transform="rotate(45 50 50)">
            <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="10s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="50" cy="50" rx="40" ry="15" fill="none" stroke="url(#aiGradient)" strokeWidth="1" opacity="0.4" transform="rotate(-45 50 50)">
            <animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="10s" repeatCount="indefinite" />
        </ellipse>

        {/* Center Sparkle */}
        <path d="M50 35 L52 48 L65 50 L52 52 L50 65 L48 52 L35 50 L48 48 Z" fill="white">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
        </path>
      </svg>
    </div>
  );
};

export default AILogo;
