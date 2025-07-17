import { useCallback } from 'react';
import { generateUniqueId } from '../../utils/helpers';
import apiService from '../../services/apiService';
import type { FormConfig, SectionWithRef } from '../types/formBuilderTypes';
import type { GenerateFormDataResult } from './formDataGenerator';

/**
 * Custom hook for API operations
 */
export const useApiOperations = (
  formConfig: FormConfig,
  setFormConfig: React.Dispatch<React.SetStateAction<FormConfig>>,
  setSections: React.Dispatch<React.SetStateAction<SectionWithRef[]>>,
  generateFormData: (formConfig: FormConfig, sections: SectionWithRef[]) => GenerateFormDataResult
) => {
  // Submit form to API
  const submitForm = useCallback(async (
    sections: SectionWithRef[],
    setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<void> => {
    setIsSubmitting(true);

    try {
      const { generatedObject } = generateFormData(formConfig, sections);

      // Prepare data for API submission
      const submitData = {
        key: generatedObject.key || formConfig.formKey || 'tw',
        version: generatedObject.version || formConfig.version || 0,
        companyId: generatedObject.companyId || formConfig.companyId || 0,
        template: JSON.stringify(generatedObject.template)
      };

      // Submit to API
      const result = await apiService.submitForm(submitData);

      if (!result.success) {
        throw new Error(result.error || 'Submit failed');
      }

    } catch (error) {
      throw error; // Re-throw to let FormBuilder handle the error display
    } finally {
      setIsSubmitting(false);
    }
  }, [formConfig, generateFormData]);

  // Load JSON file
  const loadJson = useCallback(async (
    setIsLoadingForm: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<void> => {
    setIsLoadingForm(true);
    try {
      const result = await apiService.loadForm(formConfig);
      if (!result.success) {
        throw new Error(result.error || 'Submit failed');
      }
      if (result.success && result.data) {
        setFormConfig({
          formKey: result.data.key || formConfig.formKey,
          version: result.data.version || formConfig.version,
          companyId: result.data.companyId || formConfig.companyId,
          formTitle: result.data.template?.title || formConfig.formTitle,
        });
        let sections = result.data?.template?.sections;
        if (sections.length > 0) {
          const newSections = sections.map((section: any) => ({
            id: generateUniqueId(),
            title: section.title || '',
            icon: section.icon || '',
            fields: [],
            elements: section.elements || [],
            ref: { current: null }
          }));
          setSections(newSections);
        }
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingForm(false);
    }
  }, [formConfig, setFormConfig, setSections]);

  return {
    submitForm,
    loadJson
  };
};
