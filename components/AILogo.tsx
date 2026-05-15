import React from 'react';

const AILogo: React.FC<{ size?: 'sm' | 'md' | 'lg', className?: string }> = ({ size = 'sm', className = '' }) => {
  const dims = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`${dims[size]} relative flex items-center justify-center ${className}`}>
      <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full animate-pulse" />
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full relative z-10 text-blue-400">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" className="animate-pulse" />
        <circle cx="12" cy="12" r="3" fill="black" />
        <circle cx="12" cy="12" r="1.5" fill="white" className="animate-ping" />
      </svg>
    </div>
  );
};

export default AILogo;
