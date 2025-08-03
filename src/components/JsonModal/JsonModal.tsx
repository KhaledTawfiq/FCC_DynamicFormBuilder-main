import React, { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';
import type { JsonModalProps } from '../../types';

/**
 * JsonModal Component
 * Modal for displaying generated JSON data with syntax highlighting
 */
const JsonModal: React.FC<JsonModalProps & { title?: string }> = ({ 
  isOpen,
  jsonData,
  onClose,
  title = "JSON Data"
}) => {

  // Manage body scroll when modal is open
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

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Prepare data for ReactJson
  const jsonDataForDisplay = (() => {
    if (typeof jsonData === 'string') {
      try {
        return JSON.parse(jsonData);
      } catch {
        return { rawData: jsonData };
      }
    }
    return jsonData;
  })();

  return (
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
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
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
          
          <div className="modal-body">
            <div className="json-viewer-container">
              <ReactJson
                src={jsonDataForDisplay}
                theme="rjv-default"
                displayDataTypes={false}
                displayObjectSize={true}
                indentWidth={2}
                collapsed={false}
                enableClipboard={true}
                name={false}
            
              />
            </div>
          </div>
          
     
        </div>
      </div>
    </div>
  );
};

export default JsonModal;
