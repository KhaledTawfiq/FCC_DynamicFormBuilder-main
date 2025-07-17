import { useState, useCallback, useEffect } from 'react';
import $ from 'jquery';
import { DEFAULT_FORM_CONFIG } from '../config/constants';
import { initializeLibraries, getFormBuilderOptions } from './utils/formBuilderConfig';
import { useFormDataGenerator } from './utils/formDataGenerator';
import { useSectionManagement } from './utils/sectionManagement';
import { useApiOperations } from './utils/apiOperations';
import type { FormConfig } from '../types';
import type { UseFormBuilderReturn, SectionWithRef } from './types/formBuilderTypes';

// Extend Window interface for jQuery and formBuilder
declare global {
  interface Window {
    $: typeof $;
    jQuery: typeof $;
    fbControls: any[];
  }
}

/**
 * Custom hook for managing FormBuilder functionality
 */
export const useFormBuilder = (): UseFormBuilderReturn => {
  const [formConfig, setFormConfig] = useState<FormConfig>(DEFAULT_FORM_CONFIG);
  const [sections, setSections] = useState<SectionWithRef[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoadingForm, setIsLoadingForm] = useState<boolean>(false);

  // Initialize jQuery libraries
  useEffect(() => {
    initializeLibraries();
  }, []);

  // Get form data generation utilities
  const { generateFormData: generateFormDataFn } = useFormDataGenerator();

  // Get section management utilities
  const { addSection, removeSection, updateSection, reorderSections } = 
    useSectionManagement(sections, setSections);

  // Get API operations
  const { submitForm: submitFormFn, loadJson: loadJsonFn } = 
    useApiOperations(formConfig, setFormConfig, setSections, generateFormDataFn);

  // FormBuilder options configuration
  const formBuilderOptions = getFormBuilderOptions();

  // Generate form data wrapper
  const generateFormData = useCallback(() => ({ 
    formattedTemplateJson: generateFormDataFn(formConfig, sections).formattedTemplateJson 
  }), [formConfig, sections, generateFormDataFn]);

  // Submit form wrapper
  const submitForm = useCallback(async (): Promise<void> => {
    return submitFormFn(sections, setIsSubmitting);
  }, [submitFormFn, sections]);

  // Load JSON wrapper
  const loadJson = useCallback(async (): Promise<void> => {
    return loadJsonFn(setIsLoadingForm);
  }, [loadJsonFn]);

  return {
    formConfig,
    sections: sections as any[], // Cast to match the expected return type
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
  };
};
