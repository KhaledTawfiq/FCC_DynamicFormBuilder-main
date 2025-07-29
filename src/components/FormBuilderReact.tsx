import React, { useState } from 'react';
import { useFormBuilderReact } from '../hooks/useFormBuilderReact';
import SectionReact from './Section/SectionReact';
import ActionButtons from './ActionButtons/ActionButtons';
import LoadingSpinner from './UI/LoadingSpinner';
import Snackbar from './Snackbar/Snackbar';
import JsonModal from './JsonModal/JsonModal';
import FormConfiguration from './FormConfiguration/FormConfiguration';
import GroupIdComponent from './custom-attrs/GroupId';

/**
 * FormBuilder Component - React Native Implementation
 * Main form builder interface using react-form-builder2
 */
const FormBuilderReact: React.FC = () => {
  const {
    formConfig,
    setFormConfig,
    sections,
    isSubmitting,
    isLoadingForm,
    addSection,
    removeSection,
    updateSection,
    reorderSections,
    generateFormData,
    submitForm,
    loadJson
  } = useFormBuilderReact();

  // UI state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [generatedJsonData, setGeneratedJsonData] = useState<any>(null);
  const [snackbar, setSnackbar] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success'
  });
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);

  // Show snackbar message
  const showSnackbar = (message: string, type: 'success' | 'error' = 'success') => {
    setSnackbar({ show: true, message, type });
  };

  // Hide snackbar
  const hideSnackbar = () => {
    setSnackbar(prev => ({ ...prev, show: false }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      await submitForm();
      showSnackbar('Form submitted successfully!', 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Submission failed';
      showSnackbar(errorMessage, 'error');
    }
  };

  // Handle JSON generation
  const handleGenerateJson = () => {
    try {
      const { formattedTemplateJson } = generateFormData();
      // Keep as string for display in JsonModal
      setGeneratedJsonData(formattedTemplateJson);
      setShowJsonModal(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'JSON generation failed';
      showSnackbar(errorMessage, 'error');
    }
  };

  // Handle JSON loading
  const handleLoadJson = async () => {
    try {
      await loadJson();
      showSnackbar('JSON loaded successfully!', 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'JSON loading failed';
      showSnackbar(errorMessage, 'error');
    }
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (index: number) => {
    // Update drag visual feedback if needed
  };

  const handleDrop = (index: number) => {
    setDraggedIndex(null);
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    reorderSections(fromIndex, toIndex);
    setDraggedIndex(null);
  };

  if (isLoadingForm) {
    return (
      <div className="form-builder-container">
        <LoadingSpinner isVisible={true} overlay={true} />
      </div>
    );
  }

  return (
    <div className="form-builder-container">
      {/* Form Configuration */}
      <FormConfiguration
        formConfig={formConfig}
        onConfigChange={setFormConfig}
      />
      
      {/* Sections */}
      <div className="sections-container">
        {sections.length === 0 ? (
          <div className="empty-state">
            <p>No sections yet. Click "Add Section" to get started.</p>
          </div>
        ) : (
          <div className="accordion sections-accordion" id="sectionsAccordion">
            {sections.map((section, index) => (
              <SectionReact
                key={section.id}
                section={section}
                index={index}
                formBuilderOptions={{}} // Empty for React implementation
                onRemove={removeSection}
                onUpdate={updateSection}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onReorder={handleReorder}
                draggedIndex={draggedIndex}
                className={draggedIndex === index ? 'dragging' : ''}
              />
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <ActionButtons
        onAddSection={addSection}
        onViewJson={handleGenerateJson}
        onSubmit={handleSubmit}
        onLoadJson={handleLoadJson}
        isSubmitting={isSubmitting}
        isLoading={isLoadingForm}
      />


      {/* Loading Spinner for Submission */}
      {isSubmitting && (
        <LoadingSpinner isVisible={true} overlay={true} />
      )}

      {/* Snackbar for Messages */}
      <Snackbar
        message={snackbar.show ? snackbar.message : null}
        type={snackbar.type}
        onClose={hideSnackbar}
      />

      {/* JSON Modal */}
      {showJsonModal && generatedJsonData && (
        <JsonModal
          isOpen={showJsonModal}
          onClose={() => setShowJsonModal(false)}
          jsonData={generatedJsonData}
        />
      )}
      <GroupIdComponent />
    </div>
  );
};

export default FormBuilderReact;
