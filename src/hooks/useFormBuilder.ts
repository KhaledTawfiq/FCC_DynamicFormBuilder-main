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
    // Add event handlers to manage readonly behavior in the UI
    onAddField: function (field: any) {
      console.log('Field added:', field);
      updateReadonlyState(field);
      // setTimeout(() => {
      // }, 100);
    },
    onUpdateField: function (field: any) {
      updateReadonlyState(field);
      // setTimeout(() => {
      // }, 100);
    },
    typeUserAttrs: {
      date: {
        defaultValue: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.DEFAULT_VALUE,
        other: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.OTHER,
        subtype: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.SUBTYPE,
        groupId: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.GROUP_ID,
        values: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.VALUES,
        validations: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.VALIDATIONS,
        condition: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.CONDITION,
        readOnly: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.READONLY,
        readOnlyConditionField: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.READONLY_CONDITION_FIELD,
        readOnlyConditionType: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.READONLY_CONDITION_TYPE,
        readOnlyConditionValue: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.READONLY_CONDITION_VALUE,
      },
      text: {
        defaultValue: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.DEFAULT_VALUE,
        other: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.OTHER,
        subtype: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.SUBTYPE,
        groupId: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.GROUP_ID,
        values: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.VALUES,
        validations: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.VALIDATIONS,
        condition: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.CONDITION,
        readOnly: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.READONLY,
        readOnlyConditionField: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.READONLY_CONDITION_FIELD,
        readOnlyConditionType: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.READONLY_CONDITION_TYPE,
        readOnlyConditionValue: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.READONLY_CONDITION_VALUE,
      },
      email: {
        defaultValue: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.DEFAULT_VALUE,
        other: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.OTHER,
        subtype: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.SUBTYPE,
        groupId: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.GROUP_ID,
        values: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.VALUES,
        validations: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.VALIDATIONS,
        condition: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.CONDITION,
        readOnly: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.READONLY,
        readOnlyConditionField: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.READONLY_CONDITION_FIELD,
        readOnlyConditionType: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.READONLY_CONDITION_TYPE,
        readOnlyConditionValue: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.READONLY_CONDITION_VALUE,
      },
      password: {
        defaultValue: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.DEFAULT_VALUE,
        subtype: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.SUBTYPE,
        groupId: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.GROUP_ID,
        validations: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.VALIDATIONS,
        condition: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.CONDITION,
        readOnly: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.READONLY,
        readOnlyConditionField: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.READONLY_CONDITION_FIELD,
        readOnlyConditionType: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.READONLY_CONDITION_TYPE,
        readOnlyConditionValue: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.READONLY_CONDITION_VALUE,
      },
      select: {
        defaultValue: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.DEFAULT_VALUE,
        other: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.OTHER,
        subtype: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.SUBTYPE,
        groupId: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.GROUP_ID,
        validations: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.VALIDATIONS,
        condition: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.CONDITION,
        readOnly: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.READONLY,
        readOnlyConditionField: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.READONLY_CONDITION_FIELD,
        readOnlyConditionType: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.READONLY_CONDITION_TYPE,
        readOnlyConditionValue: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.READONLY_CONDITION_VALUE,
      },
      "radio-group": {
        defaultValue: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.DEFAULT_VALUE,
        subtype: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.SUBTYPE,
        groupId: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.GROUP_ID,
        condition: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.CONDITION,
        readOnly: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.READONLY,
        readOnlyConditionField: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.READONLY_CONDITION_FIELD,
        readOnlyConditionType: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.READONLY_CONDITION_TYPE,
        readOnlyConditionValue: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.READONLY_CONDITION_VALUE,
        validations: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.VALIDATIONS,
      },
      "checkbox-group": {
        defaultValue: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.DEFAULT_VALUE,
        subtype: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.SUBTYPE,
        groupId: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.GROUP_ID,
        listPropertyKey: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.LIST_PROPERTY_KEY,
        condition: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.CONDITION,
        readOnly: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.READONLY,
        readOnlyConditionField: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.READONLY_CONDITION_FIELD,
        readOnlyConditionType: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.READONLY_CONDITION_TYPE,
        readOnlyConditionValue: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.READONLY_CONDITION_VALUE,
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
        readOnly: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.READONLY,
        readOnlyConditionField: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.READONLY_CONDITION_FIELD,
        readOnlyConditionType: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.READONLY_CONDITION_TYPE,
        readOnlyConditionValue: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.READONLY_CONDITION_VALUE,
      },
      address: {
        defaultValue: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.DEFAULT_VALUE,
        subtype: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.SUBTYPE,
        groupId: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.GROUP_ID,
        validations: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.VALIDATIONS,
        condition: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.CONDITION,
        readOnly: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.READONLY,
        readOnlyConditionField: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.READONLY_CONDITION_FIELD,
        readOnlyConditionType: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.READONLY_CONDITION_TYPE,
        readOnlyConditionValue: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.READONLY_CONDITION_VALUE,
      },
    },
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

  // Function to update readonly state in the FormBuilder UI
  const updateReadonlyState = useCallback((field: any) => {
    try {
      console.log('updateReadonlyState field:', field);
      const $field = $(field);
      console.log('$field:', $field);

      const fieldContainer = $field.closest('.form-elements');
      console.log('fieldContainer:', fieldContainer);

      if (fieldContainer.length === 0) {
        console.warn('No .form-elements container found for field:', field);
        return;
      }

      // Get current values
      const readOnlyValue = fieldContainer.find('[name*="readOnly"]').val();
      const conditionField = fieldContainer.find('[name*="readOnlyConditionField"]').val();
      const conditionType = fieldContainer.find('[name*="readOnlyConditionType"]').val();

console.log('readOnly input:', fieldContainer.find('[name*="readOnly"]'));
console.log('conditionField input:', fieldContainer.find('[name*="readOnlyConditionField"]'));
console.log('conditionType input:', fieldContainer.find('[name*="readOnlyConditionType"]'));


      const hasCondition = conditionField && conditionType;

      // Update the actual form field based on readonly state
      const formField = fieldContainer.find('input, textarea, select').not('[type="hidden"]').first();
      console.log('formField:', formField);

      if (hasCondition) {
        fieldContainer.find('[name*="readOnly"]').val('false');
        formField.prop('disabled', true);
        formField.addClass('readonly-condition');
      } else if (readOnlyValue === 'true') {
        formField.prop('readonly', true);
        formField.prop('disabled', false);
        formField.removeClass('readonly-condition');
      } else {
        formField.prop('readonly', false);
        formField.prop('disabled', false);
        formField.removeClass('readonly-condition');
      }

      // Add visual indicators
      if (hasCondition) {
        fieldContainer.addClass('has-readonly-condition');
      } else {
        fieldContainer.removeClass('has-readonly-condition');
      }

    } catch (error) {
      console.warn('Error updating readonly state:', error);
    }
  }, []);

  // Process individual form element to handle readonly properties
  const processFormElement = useCallback((element: any) => {
    const processedElement = { ...element };

    // ALWAYS add readonly properties to every element
    const hasReadOnlyCondition = element.readOnlyConditionField && element.readOnlyConditionType;

    if (hasReadOnlyCondition) {
      // If there's a condition, readOnly should be false and make the input disabled
      processedElement.readOnly = false;
      // processedElement.disabled = true;
      processedElement.readOnlyCondition = {
        field: element.readOnlyConditionField || "",
        type: parseInt(element.readOnlyConditionType) || 10,
        value: element.readOnlyConditionValue || ""
      };
    } else {
      // If no condition, check if readOnly is explicitly set, otherwise default to false
      processedElement.readOnly = (element.readOnly === 'true' || element.readOnly === true) ? true : false;
      // Don't set disabled if there's no condition (unless already set)
      // if (!element.disabled) {
      //   processedElement.disabled = false;
      // }
    }

    // Always clean up individual readonly condition properties from output
    delete processedElement.readOnlyConditionField;
    delete processedElement.readOnlyConditionType;
    delete processedElement.readOnlyConditionValue;

    return processedElement;
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

        // Process each element to handle readonly properties
        const processedElements = elements.map(processFormElement);

        generatedObject.template.sections.push({
          title: section.title,
          icon: section.icon || '',
          elements: processedElements,
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
