import React, { useEffect, useState } from 'react';
import type { SnackbarProps, SnackbarType } from '../../types';

/**
 * Snackbar Component
 * Displays toast notifications
 */
const Snackbar: React.FC<SnackbarProps & { duration?: number }> = ({ 
  message, 
  type = 'info', 
  duration = 3000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) {
          setTimeout(onClose, 300); // Wait for fade out animation
        }
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  const getSnackbarClass = (): string => {
    const baseClass = 'snackbar';
    const visibilityClass = isVisible ? 'show' : '';
    const typeClass = type;
    
    return `${baseClass} ${visibilityClass} ${typeClass}`.trim();
  };

  return (
    <div 
      id="snackbar" 
      className={getSnackbarClass()}
    >
      {message}
    </div>
  );
};

export default Snackbar;
