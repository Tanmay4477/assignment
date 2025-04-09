'use client'

import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8'
};

const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  className = ''
}) => {
  return (
    <div 
      className={`animate-spin rounded-full border-b-2 border-gray-500 ${sizeMap[size]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
};

export default Spinner;