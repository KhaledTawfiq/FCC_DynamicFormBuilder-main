import { useState, useCallback, useRef, useEffect } from 'react';
import $ from 'jquery';
import { FORM_BUILDER_CONFIG, DEFAULT_FORM_CONFIG } from '../config/constants';
import { toPascalCase, generateUniqueId, formatJSON } from '../utils/helpers';
import apiService from '../services/apiService';
import type { FormConfig, Section, UseFormBuilderReturn } from '../types';

// Extend Window interface for jQuery and formBuilder
declare global {
  interface Window {
    $: typeof $;
    jQuery: typeof $;
  }
}

interface GenerateFormDataResult {
  generatedObject: any;
  formattedJson: string;
  formattedTemplateJson: string;
}

interface SectionWithRef extends Section {
  ref?: { current: any };
  elements?: any[];
  icon?: string;
}

interface LoadedTemplate {
  title?: string;
  sections?: Array<{
    title?: string;
    icon?: string;
    elements?: any[];
  }>;
}

interface LoadedResponse {
  template?: LoadedTemplate;
  key?: string;
  version?: string;
  companyId?: string;
}

/**
 * Custom hook for managing FormBuilder functionality
 */
export const useFormBuilder = (): UseFormBuilderReturn => {
  const [formConfig, setFormConfig] = useState<FormConfig>(DEFAULT_FORM_CONFIG);
  const [sections, setSections] = useState<SectionWithRef[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoadingForm, setIsLoadingForm] = useState<boolean>(false);

  const isAddingSection = useRef<boolean>(false);

  // Initialize jQuery libraries
  useEffect(() => {
    const loadLibraries = async (): Promise<void> => {
      try {
        // Make jQuery globally available
        window.$ = window.jQuery = $;

        // Dynamically import jQuery UI and formBuilder
        await import("jquery-ui-sortable");
        await import("formBuilder");
      } catch (error) {
        // Error loading libraries - fail silently
      }
    };

    loadLibraries();
  }, []);

  // FormBuilder options configuration
  const formBuilderOptions = {
    controlOrder: FORM_BUILDER_CONFIG.CONTROL_ORDER,
    stickyControls: FORM_BUILDER_CONFIG.STICKY_CONTROLS,
    typeUserAttrs: {
      date: {
        defaultValue: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.DEFAULT_VALUE,
        other: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.OTHER,
        subtype: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.SUBTYPE,
        groupId: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.GROUP_ID,
        values: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.VALUES,
        validations: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.VALIDATIONS,
        condition: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.CONDITION,
      },
      text: {
        defaultValue: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.DEFAULT_VALUE,
        other: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.OTHER,
        subtype: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.SUBTYPE,
        groupId: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.GROUP_ID,
        values: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.VALUES,
        validations: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.VALIDATIONS,
        condition: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.CONDITION,
      },
      email: {
        defaultValue: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.DEFAULT_VALUE,
        other: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.OTHER,
        subtype: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.SUBTYPE,
        groupId: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.GROUP_ID,
        values: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.VALUES,
        validations: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.VALIDATIONS,
        condition: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.CONDITION,
      },
      password: {
        defaultValue: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.DEFAULT_VALUE,
        subtype: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.SUBTYPE,
        groupId: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.GROUP_ID,
        validations: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.VALIDATIONS,
        condition: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.CONDITION,
      },
      select: {
        defaultValue: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.DEFAULT_VALUE,
        other: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.OTHER,
        subtype: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.SUBTYPE,
        groupId: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.GROUP_ID,
        validations: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.VALIDATIONS,
        condition: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.CONDITION,
      },
      "radio-group": {
        defaultValue: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.DEFAULT_VALUE,
        subtype: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.SUBTYPE,
        groupId: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.GROUP_ID,
        condition: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.CONDITION,
        validations: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.VALIDATIONS,
      },
      "checkbox-group": {
        defaultValue: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.DEFAULT_VALUE,
        subtype: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.SUBTYPE,
        groupId: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.GROUP_ID,
        listPropertyKey: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.LIST_PROPERTY_KEY,
        condition: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.CONDITION,
        validations: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.VALIDATIONS,
      },
      textarea: {
        defaultValue: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.DEFAULT_VALUE,
        other: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.OTHER,
        subtype: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.SUBTYPE,
        groupId: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.GROUP_ID,
        values: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.VALUES,
        validations: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.VALIDATIONS,
        condition: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.CONDITION,
      },
      address: {
        defaultValue: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.DEFAULT_VALUE,
        subtype: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.SUBTYPE,
        groupId: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.GROUP_ID,
        validations: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.VALIDATIONS,
        condition: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.CONDITION,
      },
    },
    fields: [{
      icon: '🏠',
      i18n: {
        default: 'Address'
      },
      defaultAttrs: {
        includeAddressCountry: {
          label: 'Include Country',
          type: 'checkbox',
          value: true
        },
        includeAddressApartment: {
          label: 'Include Apartment',
          type: 'checkbox',
          value: true
        }
      }
    }],
  };

  // Add a new section
  const addSection = useCallback((): void => {
    if (isAddingSection.current) return;
    isAddingSection.current = true;

    const newSection: SectionWithRef = {
      id: generateUniqueId(),
      title: '',
      fields: [],
      icon: '',
      elements: [],
      ref: { current: null }
    };

    setSections(prev => [...prev, newSection]);
    setTimeout(() => {
      isAddingSection.current = false;
    }, 100);
  }, []);

  // Remove a section
  const removeSection = useCallback((index: number): void => {
    setSections(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Update a section
  const updateSection = useCallback((index: number, updatedSection: Section): void => {
    setSections(prev =>
      prev.map((section, i) =>
        i === index ? { ...section, ...updatedSection, ref: section.ref } : section
      )
    );
  }, []);

  // Reorder sections
  const reorderSections = useCallback((fromIndex: number, toIndex: number): void => {
    setSections(prev => {
      const newSections = [...prev];
      const [movedSection] = newSections.splice(fromIndex, 1);
      newSections.splice(toIndex, 0, movedSection);
      return newSections;
    });
  }, []);

  // Generate form data
  const generateFormData = useCallback((): GenerateFormDataResult => {
    const generatedObject = {
      key: formConfig.formKey,
      version: formConfig.version || 0,
      companyId: formConfig.companyId || 0,
      template: {
        title: formConfig.formTitle || "Default Form",
        sections: [] as any[],
        Buttons: [
          {
            Type: "submit",
            Label: "Submit",
            Url: "DynamicForms/submit",
            Method: "post",
            Icon: "submit-icon",
          },
        ],
      },
    };

    // Process field labels to generate names
    $('.fld-label').each((index: number, element: HTMLElement) => {
      $(element).closest('.form-elements').find('.fld-name').val(toPascalCase($(element).text()));
    });

    // Collect section data
    sections.forEach((section) => {
      if (section.ref?.current?.getFormData) {
        const elements = section.ref.current.getFormData();
        generatedObject.template.sections.push({
          title: section.title,
          icon: section.icon || '',
          elements: elements,
        });
      }
    });

    const formattedJson = formatJSON(generatedObject);
    const formattedTemplateJson = formatJSON(generatedObject.template);

    return { generatedObject, formattedJson, formattedTemplateJson };
  }, [formConfig, sections]);
  // Submit form to API
  const submitForm = useCallback(async (): Promise<void> => {
    setIsSubmitting(true);

    try {
      const { generatedObject } = generateFormData();

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
  }, [generateFormData, formConfig]);

  // Load JSON file
  const loadJson = useCallback(async (): Promise<void> => {
    setIsLoadingForm(true);
    try {
      const result = await apiService.loadForm(formConfig)
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
  }, [formConfig]);

  return {
    formConfig,
    sections: sections as Section[],
    formBuilderOptions,
    isSubmitting,
    isLoadingForm,
    addSection,
    removeSection,
    updateSection,
    reorderSections,
    generateFormData: () => ({ formattedTemplateJson: generateFormData().formattedTemplateJson }),
    submitForm,
    loadJson,
    setFormConfig
  };
};
