import React from 'react';
import LoadingSpinner from '../UI/LoadingSpinner';
import type { ActionButtonsProps } from '../../types';

/**
 * ActionButtons Component
 * Contains all the action buttons for the form builder
 */
const ActionButtons: React.FC<ActionButtonsProps & { className?: string }> = ({ 
  onAddSection,
  onViewJson,
  onSubmit,
  onLoadJson,
  isSubmitting = false,
  isLoading = false,
  className = ""
}) => {
  return (
    <div className={`generic-buttons ${className}`}>
      <button 
        onClick={onAddSection} 
        className="btn btn-primary"
        disabled={isSubmitting || isLoading}
        type='button'
      >
        Add Section
      </button>
      
      <button 
        onClick={onViewJson} 
        className="btn btn-primary"
        disabled={isSubmitting || isLoading}
        type='button'
      >
        View Json
      </button>
      
      <span className="submit-button-wrapper">
        <LoadingSpinner isVisible={isSubmitting} size="small" />
        <button 
          onClick={onSubmit} 
          className="btn btn-primary" 
          disabled={isLoading}
          type='button'
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </span>
      
      <span className="submit-button-wrapper">
        <LoadingSpinner isVisible={isLoading} size="small" />
        <button 
          onClick={onLoadJson} 
          className="btn btn-primary"
          disabled={isSubmitting}
          type='button'
        >
          {isLoading ? 'Loading...' : 'Load Json'}
        </button>
      </span>
    </div>
  );
};

export default ActionButtons;
