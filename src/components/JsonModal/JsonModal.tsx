import React, { useEffect } from 'react';
import type { JsonModalProps } from '../../types';

/**
 * JsonModal Component
 * Modal for displaying generated JSON data
 */
const JsonModal: React.FC<JsonModalProps & { title?: string }> = ({ 
  isOpen,
  jsonData,
  onClose,
  title = "JSON Data"
}) => {  // Manage body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonData || '');
      // Could add a toast notification here
    } catch (error) {
      // Failed to copy - ignore silently
    }
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };  return (
    <div
      className="modal fade show"
      id="jsonModal"
      role="dialog"
      tabIndex={-1}
      aria-labelledby="jsonModalLabel"
      aria-hidden="false"
      style={{ 
        display: 'block', 
        backgroundColor: 'rgba(0,0,0,0.5)',
        overflow: 'hidden'
      }}
      onClick={handleBackdropClick}
    >
      <div className="modal-dialog modal-xl" style={{ height: '90vh', margin: '5vh auto' }}>
        <div className="modal-content" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div className="modal-header" style={{ flexShrink: 0 }}>
            <h5 className="modal-title" id="jsonModalLabel">
              {title}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            />
          </div>
          
          <div className="modal-body" style={{ 
            flex: 1, 
            overflow: 'hidden', 
            padding: 0,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <pre className="json-modal-content">
              {jsonData || 'No data available'}
            </pre>
          </div>
          
          <div className="modal-footer" style={{ flexShrink: 0 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleCopyToClipboard}
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonModal;
