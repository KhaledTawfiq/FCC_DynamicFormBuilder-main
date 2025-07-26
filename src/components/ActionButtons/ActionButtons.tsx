import React from 'react';
import LoadingSpinner from '../UI/LoadingSpinner';
import type { ActionButtonsProps } from '../../types';

/**
 * ActionButtons Component
 * Contains all the action buttons for the form builder with modern styling
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
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Add Section
      </button>
      
      <button 
        onClick={onViewJson} 
        className="btn btn-primary"
        disabled={isSubmitting || isLoading}
        type='button'
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        View JSON
      </button>
      
      <div className="submit-button-wrapper">
        {isSubmitting && <LoadingSpinner isVisible={true} size="small" />}
        <button 
          onClick={onSubmit} 
          className="btn btn-primary" 
          disabled={isLoading || isSubmitting}
          type='button'
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
      
      <div className="submit-button-wrapper">
        {isLoading && <LoadingSpinner isVisible={true} size="small" />}
        <button 
          onClick={onLoadJson} 
          className="btn btn-primary"
          disabled={isSubmitting || isLoading}
          type='button'
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 18V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 15L12 12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {isLoading ? 'Loading...' : 'Load JSON'}
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;
