import React, { useCallback, useEffect } from 'react';
import FormElementsEdit from './FormElementsEdit';
import { EditDrawerProps } from './types';

const EditDrawer: React.FC<EditDrawerProps> = ({
  isOpen,
  editingElement,
  onSave,
  onCancel
}) => {
  // Handle backdrop click (prevent closing when clicking inside drawer)
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  }, [onCancel]);

  // Prevent drawer from closing when clicking inside it
  const handleDrawerClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent body scroll when drawer is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onCancel]);

  if (!isOpen || !editingElement) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="drawer-backdrop" 
        onClick={handleBackdropClick}
      />
      
      {/* Drawer */}
      <div 
        className={`edit-form-drawer ${isOpen ? 'open' : ''}`}
        onClick={handleDrawerClick}
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Edit {editingElement.element} Element</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onCancel}
              aria-label="Close"
            ></button>
          </div>
        </div>
        
        {/* Drawer Body */}
        <div className="drawer-body">
          <FormElementsEdit
            element={editingElement}
            updateElement={onSave}
            preview={false}
            editForm={true}
          />
        </div>
      </div>
    </>
  );
};

export default EditDrawer;
