import { useState, useCallback, useEffect } from 'react';
import { DEFAULT_FORM_CONFIG } from '../config/constants';
import { useFormDataGeneratorReact } from './utils/formDataGeneratorReact';
import { useSectionManagementReact } from './utils/sectionManagementReact';
import { useApiOperationsReact } from './utils/apiOperationsReact';
import type { FormConfig } from '../types';
import type { UseFormBuilderReturn, SectionWithRef } from './types/formBuilderTypes';

/**
 * Custom hook for managing FormBuilder functionality - React Native Implementation
 */
export const useFormBuilderReact = (): UseFormBuilderReturn => {
  const [formConfig, setFormConfig] = useState<FormConfig>(DEFAULT_FORM_CONFIG);
  const [sections, setSections] = useState<SectionWithRef[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoadingForm, setIsLoadingForm] = useState<boolean>(false);

  // Get form data generation utilities
  const { generateFormData: generateFormDataFn } = useFormDataGeneratorReact();

  // Get section management utilities
  const { addSection, removeSection, updateSection, reorderSections } = 
    useSectionManagementReact(sections, setSections);

  // Get API operations
  const { submitForm: submitFormFn, loadJson: loadJsonFn } = 
    useApiOperationsReact(formConfig, setFormConfig, setSections, generateFormDataFn);

  // Generate form data wrapper
  const generateFormData = useCallback(() => ({ 
    formattedTemplateJson: generateFormDataFn(formConfig, sections).formattedTemplateJson 
  }), [generateFormDataFn, formConfig, sections]);

  // Submit form wrapper
  const submitForm = useCallback(() => {
    return submitFormFn(sections, setIsSubmitting);
  }, [submitFormFn, sections]);

  // Load JSON wrapper
  const loadJson = useCallback(() => {
    return loadJsonFn(setIsLoadingForm);
  }, [loadJsonFn]);

  return {
    formConfig,
    setFormConfig,
    sections,
    formBuilderOptions: {}, // No longer needed for React implementation
    isSubmitting,
    isLoadingForm,
    generateFormData,
    submitForm,
    loadJson,
    addSection,
    removeSection,
    updateSection,
    reorderSections
  };
};
