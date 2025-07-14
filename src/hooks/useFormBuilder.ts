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
    onAddField: function (fieldId: string, fieldData: any) {
      console.log('Field added:', fieldId, fieldData);

      // Use setTimeout to ensure the DOM is fully rendered
      setTimeout(() => {
        // updateReadonlyState(fieldId);
      }, 100);
    },
    onUpdateField: function (fieldId: string, fieldData: any) {
      console.log('Field updated:', fieldId, fieldData);

      // Use setTimeout to ensure the DOM is fully updated
      setTimeout(() => {
        // updateReadonlyState(fieldId);
      }, 100);
    },

    // Alternative: Listen for FormBuilder events after initialization
    onRender: function () {
      console.log('FormBuilder rendered');

      // Set up event listeners for readonly field changes
      setTimeout(() => {
        $(document).on('change', 'input[name*="readOnly"], select[name*="readOnly"], input[name*="readOnlyCondition"], select[name*="readOnlyCondition"]', function () {
          const $this = $(this);
          const fieldContainer = $this.closest('.form-elements');

          if (fieldContainer.length > 0) {
            console.log('Readonly-related field changed, updating state');
            // updateReadonlyState(fieldContainer[0]);
          }
        });
      }, 200);
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
// const updateReadonlyState = useCallback((field: any) => {
//   try {
//     console.log('updateReadonlyState field:', field);
    
//     // Handle different field parameter types
//     let $field;
//     let fieldId;
    
//     if (typeof field === 'string') {
//       // If field is a string ID, find the element by ID
//       fieldId = field;
//       $field = $(`#${fieldId}`);
      
//       // If not found by ID, try finding by data-field-id or class
//       if ($field.length === 0) {
//         $field = $(`[data-field-id="${fieldId}"]`);
//       }
      
//       // If still not found, try finding within all .form-elements
//       if ($field.length === 0) {
//         $field = $(`.form-elements`).find(`[id*="${fieldId}"], [name*="${fieldId}"], [data-name*="${fieldId}"]`).first();
//       }
//     } else {
//       // If field is already a DOM element or jQuery object
//       $field = $(field);
//       fieldId = $field.attr('id') || $field.data('field-id') || 'unknown';
//     }
    
//     console.log('$field after processing:', $field);
//     console.log('fieldId:', fieldId);
    
//     if ($field.length === 0) {
//       console.warn('Could not find field element for:', field);
      
//       // Try alternative approach - find the field within the build-wrap
//       const $buildWrap = $('.build-wrap');
//       if ($buildWrap.length > 0) {
//         // Look for the field in form elements that were just added
//         const $allFormElements = $buildWrap.find('.form-elements');
//         const $lastFormElement = $allFormElements.last();
        
//         if ($lastFormElement.length > 0) {
//           console.log('Using last form element as fallback');
//           $field = $lastFormElement;
//         }
//       }
      
//       if ($field.length === 0) {
//         return;
//       }
//     }

//     // Find the container - could be the field itself or a parent
//     let fieldContainer = $field.closest('.form-elements');
    
//     // If $field is already .form-elements, use it directly
//     if ($field.hasClass('form-elements')) {
//       fieldContainer = $field;
//     }
    
//     // If still no container, try finding within .frmb containers
//     if (fieldContainer.length === 0) {
//       fieldContainer = $field.closest('.frmb').find('.form-elements').last();
//     }
    
//     console.log('fieldContainer:', fieldContainer);

//     if (fieldContainer.length === 0) {
//       console.warn('No .form-elements container found for field:', field);
//       return;
//     }

//     // Get current values - be more specific with selectors
//     const $readOnlyField = fieldContainer.find('input[name*="readOnly"], select[name*="readOnly"]');
//     const $conditionField = fieldContainer.find('input[name*="readOnlyConditionField"], select[name*="readOnlyConditionField"]');
//     const $conditionType = fieldContainer.find('input[name*="readOnlyConditionType"], select[name*="readOnlyConditionType"]');
//     const $conditionValue = fieldContainer.find('input[name*="readOnlyConditionValue"], select[name*="readOnlyConditionValue"]');

//     const readOnlyValue = $readOnlyField.val();
//     const conditionField = $conditionField.val();
//     const conditionType = $conditionType.val();
//     const conditionValue = $conditionValue.val();

//     console.log('readOnlyValue:', readOnlyValue);
//     console.log('conditionField:', conditionField);
//     console.log('conditionType:', conditionType);
//     console.log('conditionValue:', conditionValue);

//     // Check if all condition fields have values
//     const hasAllConditionValues = conditionField && 
//                                  conditionField.toString().trim() !== '' && 
//                                  conditionType && 
//                                  conditionType.toString().trim() !== '' && 
//                                  conditionValue && 
//                                  conditionValue.toString().trim() !== '';

//     console.log('hasAllConditionValues:', hasAllConditionValues);

//     // Find the actual form field (input, textarea, select) within this container
//     const $formField = fieldContainer.find('input:not([type="hidden"]):not([name*="readOnly"]):not([name*="Condition"]), textarea, select')
//                                    .not('[name*="readOnly"]')
//                                    .not('[name*="Condition"]')
//                                    .first();

//     console.log('formField found:', $formField);

//     if ($formField.length === 0) {
//       console.warn('No form field found in container');
//       return;
//     }

//     // Apply the readonly condition logic
//     if (hasAllConditionValues) {
//       console.log('All condition values present - applying condition logic');
      
//       // 1. Set readOnly field to false
//       $readOnlyField.val('false');
      
//       // 2. Disable the readOnly field so user can't change it
//       $readOnlyField.prop('disabled', true);
      
//       // 3. Enable the actual form field (it should be interactive)
//       $formField.prop('disabled', false);
//       $formField.prop('readonly', false);
      
//       // 4. Add visual indicators
//       $formField.addClass('readonly-condition');
//       fieldContainer.addClass('has-readonly-condition');
      
//       // 5. Add visual indicator to readOnly field that it's controlled by condition
//       $readOnlyField.addClass('controlled-by-condition');
      
//       console.log('Applied condition logic: readOnly=false and disabled, form field enabled');
      
//     } else {
//       console.log('Not all condition values present - normal readonly logic');
      
//       // Enable the readOnly field so user can change it
//       $readOnlyField.prop('disabled', false);
//       $readOnlyField.removeClass('controlled-by-condition');
      
//       // Apply normal readonly logic based on readOnly field value
//       if (readOnlyValue === 'true') {
//         // Standard readonly behavior
//         $formField.prop('readonly', true);
//         $formField.prop('disabled', false);
//         $formField.removeClass('readonly-condition');
//         fieldContainer.removeClass('has-readonly-condition');
        
//         console.log('Applied standard readonly');
//       } else {
//         // Field is fully editable
//         $formField.prop('readonly', false);
//         $formField.prop('disabled', false);
//         $formField.removeClass('readonly-condition');
//         fieldContainer.removeClass('has-readonly-condition');
        
//         console.log('Field set to fully editable');
//       }
//     }

//   } catch (error) {
//     console.warn('Error updating readonly state:', error);
//   }
// }, []);

  // Process individual form element to handle readonly properties
  const processFormElement = useCallback((element: any) => {
    const processedElement = { ...element };

    // ALWAYS add readonly properties to every element
    const hasReadOnlyCondition = element.readOnlyConditionField && element.readOnlyConditionType;

    if (hasReadOnlyCondition) {
      // If there's a condition, readOnly should be false initially
      // The actual readonly behavior will be determined dynamically based on the condition
      processedElement.readOnly = false;

      // Add the readonly condition object for dynamic evaluation
      processedElement.readOnlyCondition = {
        field: element.readOnlyConditionField || "",
        type: parseInt(element.readOnlyConditionType) || 10,
        value: element.readOnlyConditionValue || ""
      };

      // Don't disable the field - it should be interactive
      // The condition will determine when it becomes readonly
    } else {
      // If no condition, check if readOnly is explicitly set, otherwise default to false
      processedElement.readOnly = (element.readOnly === 'true' || element.readOnly === true) ? true : false;
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
