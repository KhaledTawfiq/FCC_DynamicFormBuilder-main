import React from 'react';
import { FormBuilderProps } from './types';
import { useFormBuilder } from './useFormBuilder';
import FormBuilderPreview from './FormBuilderPreview';
import FormBuilderToolbar from './FormBuilderToolbar';
import EditDrawer from './EditDrawer';

/**
 * Pure Custom Form Builder Component
 * No dependency on ReactFormBuilder or ReactFormGenerator
 * Complete custom implementation with full isolation
 */
const FormBuilder: React.FC<FormBuilderProps> = ({
  sectionId,
  sectionUniqueId,
  initialData,
  onDataChange,
  toolbarItems,
  buildWrapId
}) => {
  const {
    formElements,
    editingElement,
    showEditForm,
    addElement,
    removeElement,
    editElement,
    moveElementUp,
    moveElementDown,
    handleEditFormSave,
    handleEditFormCancel
  } = useFormBuilder(sectionId, sectionUniqueId, initialData, onDataChange);
  console.log(formElements, formElements.length, 'FormBuilder Elements');
  return (
    <div className="form-builder">
      <div className="row">
        <FormBuilderPreview
          formElements={formElements}
          onEditElement={editElement}
          onRemoveElement={removeElement}
          onMoveElementUp={moveElementUp}
          onMoveElementDown={moveElementDown}
        />
        
        <FormBuilderToolbar
          toolbarItems={toolbarItems}
          onAddElement={addElement}
        />
      </div>

      <EditDrawer
        isOpen={showEditForm}
        editingElement={editingElement}
        onSave={handleEditFormSave}
        onCancel={handleEditFormCancel}
      />
    </div>
  );
};

export default FormBuilder;
