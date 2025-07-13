import React, { useState, useCallback, useRef } from 'react';
import FormConfiguration from './FormConfiguration/FormConfiguration';
import Section from './Section/Section';
import ActionButtons from './ActionButtons/ActionButtons';
import JsonModal from './JsonModal/JsonModal';
import Snackbar from './Snackbar/Snackbar';
import { useFormBuilder } from '../hooks/useFormBuilder';
import type { FormConfig, Section as SectionType, SnackbarState } from '../types';

interface JsonModalState {
  isOpen: boolean;
  data: any;
}

/**
 * Main FormBuilder Component
 * Orchestrates all form building functionality
 */
const FormBuilder: React.FC = () => {
  const {
    formConfig,
    sections,
    formBuilderOptions,
    isSubmitting,
    isLoadingForm,
    addSection,
    removeSection,
    updateSection,
    reorderSections,
    generateFormData,
    submitForm,
    loadJson,
    setFormConfig
  } = useFormBuilder();

  const [jsonModal, setJsonModal] = useState<JsonModalState>({
    isOpen: false,
    data: null
  });

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    message: null,
    type: 'info'
  });

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const accordionRef = useRef<HTMLDivElement>(null);

  // Handle form configuration changes
  const handleConfigChange = useCallback((newConfig: FormConfig) => {
    setFormConfig(newConfig);
  }, [setFormConfig]);

  // Handle section updates
  const handleSectionUpdate = useCallback((index: number, updatedSection: SectionType) => {
    updateSection(index, updatedSection);
  }, [updateSection]);

  // Show snackbar notification
  const showSnackbar = useCallback((message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    setSnackbar({ message, type });
  }, []);

  // Handle section removal
  const handleSectionRemove = useCallback((index: number) => {
    removeSection(index);
    showSnackbar('Section removed successfully', 'success');
  }, [removeSection, showSnackbar]);

  // Add new section
  const handleAddSection = useCallback(() => {
    addSection();
    showSnackbar('Section added successfully', 'success');
  }, [addSection, showSnackbar]);

  // Handle section reordering
  const handleSectionReorder = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    
    // Save all section data before reordering to prevent data loss
    console.log('💾 Saving all sections data before reordering...');
    sections.forEach((section, idx) => {
      const sectionWithRef = section as any;
      if (sectionWithRef.ref?.current?.getFormData) {
        try {
          const formData = sectionWithRef.ref.current.getFormData();
          if (formData && formData.length > 0) {
            // Update the section with current form data
            updateSection(idx, {
              ...section,
              elements: formData
            } as any);
          }
        } catch (error) {
          console.error(`Error saving section ${idx} data before reordering:`, error);
        }
      }
    });
    
    // Small delay to ensure updates are processed before reordering
    setTimeout(() => {
      reorderSections(fromIndex, toIndex);
      showSnackbar('Section reordered successfully', 'success');
    }, 100);
  }, [reorderSections, showSnackbar, sections, updateSection]);

  // Handle drag start
  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  // Handle drag over event
  const handleDragOver = useCallback((overIndex: number) => {
    setDraggedIndex(overIndex);
  }, []);

  // Handle drop event
  const handleDrop = useCallback((toIndex: number) => {
    setDraggedIndex(null);
  }, []);



  // View JSON data
  const handleViewJson = useCallback(() => {
    if (sections.length === 0) {
      showSnackbar('Please add sections first', 'info');
      return;
    }

    const { formattedTemplateJson } = generateFormData();
    setJsonModal({
      isOpen: true,
      data: formattedTemplateJson
    });
  }, [sections.length, generateFormData, showSnackbar]);
  // Submit form
  const handleSubmit = useCallback(async () => {
    if (sections.length === 0) {
      showSnackbar('Please add sections first', 'info');
      return;
    }

    try {
      await submitForm();
      showSnackbar('Form submitted successfully', 'success');
    } catch (err) {
      console.error('FormBuilder: Submit error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      showSnackbar(`Error submitting form: ${errorMessage}`, 'error');
    }
  }, [sections.length, submitForm, showSnackbar]);

  // Load JSON file
  const handleLoadJson =  useCallback(async () => {
   

    try {
      await loadJson();
      showSnackbar('Form loaded successfully', 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      showSnackbar(`Error load form: ${errorMessage}`, 'error');
    }
  }, [ loadJson, showSnackbar]);

  // Close JSON modal
  const handleCloseJsonModal = useCallback(() => {
    setJsonModal({ isOpen: false, data: null });
  }, []);

  // Close snackbar
  const handleCloseSnackbar = useCallback(() => {
    setSnackbar({ message: null, type: 'info' });
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <FormConfiguration
            formConfig={formConfig}
            onConfigChange={handleConfigChange}
          />
          
          <div className="accordion" id="accordionExample" ref={accordionRef}>
            {sections.map((section, index) => (
              <Section
                key={section.id}
                section={section}
                index={index}
                formBuilderOptions={formBuilderOptions}
                onRemove={handleSectionRemove}
                onUpdate={handleSectionUpdate}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                draggedIndex={draggedIndex}
                onReorder={handleSectionReorder}
              />
            ))}
          </div>

          <ActionButtons
            onAddSection={handleAddSection}
            onViewJson={handleViewJson}
            onSubmit={handleSubmit}
            onLoadJson={handleLoadJson}
            isSubmitting={isSubmitting}
            isLoading={isLoadingForm}
          />
        </div>
      </div>

      <JsonModal
        isOpen={jsonModal.isOpen}
        jsonData={jsonModal.data}
        onClose={handleCloseJsonModal}
      />

      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        onClose={handleCloseSnackbar}
      />
    </div>
  );
};

export default FormBuilder;
