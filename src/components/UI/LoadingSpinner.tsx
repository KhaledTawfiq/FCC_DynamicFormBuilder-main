import React from 'react';

type SpinnerSize = 'small' | 'medium' | 'large';

interface LoadingSpinnerProps {
  isVisible: boolean;
  size?: SpinnerSize;
  overlay?: boolean;
}

/**
 * Loading spinner component
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  isVisible, 
  size = 'medium', 
  overlay = false 
}) => {
  if (!isVisible) return null;

  const sizeClasses: Record<SpinnerSize, string> = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large',
  };

  const spinnerContent = (
    <div className={`loader-container ${overlay ? 'overlay' : ''}`}>
      <div className={`loader ${sizeClasses[size]}`}></div>
    </div>
  );

  return spinnerContent;
};

export default LoadingSpinner;
