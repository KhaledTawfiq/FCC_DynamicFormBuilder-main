import React from 'react';
import { FormBuilderPreviewProps } from './types';
import ElementActions from './ElementActions';
import ElementPreview from './ElementPreview';

const FormBuilderPreview: React.FC<FormBuilderPreviewProps> = ({
  formElements,
  onEditElement,
  onRemoveElement,
  onMoveElementUp,
  onMoveElementDown
}) => {
  return (
    <div className="col-md-9">
      <div className="form-builder-preview">
        {formElements.length === 0 ? (
          <div className="form-place-holder">
            <div className="text-center">
              <h4>No form elements yet</h4>
              <p>Click elements from the toolbar to build your form</p>
            </div>
          </div>
        ) : (
          <div className="form-elements-sortable">
            {formElements.map((element, index) => (
              <div 
                key={element.id} 
                className="form-element-item"
              >
                <ElementActions
                  index={index}
                  totalElements={formElements.length}
                  onMoveUp={onMoveElementUp}
                  onMoveDown={onMoveElementDown}
                  onEdit={() => onEditElement(element)}
                  onDelete={() => onRemoveElement(element.id)}
                />

                <div className="element-preview-container">
                  <ElementPreview element={element} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormBuilderPreview;
