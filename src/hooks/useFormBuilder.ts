import { useState, useCallback, useEffect } from 'react';
import $ from 'jquery';
import { DEFAULT_FORM_CONFIG } from '../config/constants';
import { initializeLibraries, getFormBuilderOptions } from './utils/formBuilderConfig';
import { useFormDataGenerator } from './utils/formDataGenerator';
import { useSectionManagement } from './utils/sectionManagement';
import { useApiOperations } from './utils/apiOperations';
import { useEnumGroups } from './useEnumGroups';
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
 * Enhanced custom hook for managing FormBuilder functionality with enum groups support
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

  // Fetch enum groups for dropdown population
  const { 
    enumGroups, 
    isLoading: isLoadingEnums, 
    error: enumsError,
    refetch: refetchEnums 
  } = useEnumGroups(formConfig.companyId || '78');

  // Log enum groups status for debugging
  useEffect(() => {
    if (enumsError) {
      console.warn('Error loading enum groups:', enumsError);
    } else if (enumGroups.length > 0) {
      console.log('Enum groups loaded:', enumGroups.length, 'groups');
    }
  }, [enumGroups, enumsError]);

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

  // Enhanced formConfig setter that refreshes enums when companyId changes
  const setFormConfigEnhanced = useCallback((config: FormConfig) => {
    const previousCompanyId = formConfig.companyId;
    setFormConfig(config);
    
    // If companyId changed, refetch enum groups
    if (config.companyId && config.companyId !== previousCompanyId) {
      refetchEnums();
    }
  }, [formConfig.companyId, refetchEnums]);

  return {
    formConfig,
    sections: sections as any[], // Cast to match the expected return type
    formBuilderOptions,
    isSubmitting,
    isLoadingForm: isLoadingForm || isLoadingEnums, // Include enum loading state
    addSection,
    removeSection,
    updateSection,
    reorderSections,
    generateFormData,
    submitForm,
    loadJson,
    setFormConfig: setFormConfigEnhanced,
    // Additional properties for enum groups (extend the interface if needed)
    enumGroups,
    enumsError,
    refetchEnums
  } as UseFormBuilderReturn & {
    enumGroups: Array<{label: string, value: string}>;
    enumsError: string | null;
    refetchEnums: () => Promise<void>;
  };
};