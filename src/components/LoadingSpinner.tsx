import React from 'react';

interface LoadingSpinnerProps {
  small?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ small = false }) => {
  const sizeClasses = small ? 'w-5 h-5 border-2' : 'w-12 h-12 border-4';
  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses} border-sky-400 border-t-transparent rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      ></div>
    </div>
  );
};
