import { useCallback } from 'react';
import $ from 'jquery';
import { toPascalCase, formatJSON } from '../../utils/helpers';
import { ensureFieldNames } from './fieldNameUpdater';
import type { FormConfig, SectionWithRef } from '../types/formBuilderTypes';

export interface GenerateFormDataResult {
  generatedObject: any;
  formattedJson: string;
  formattedTemplateJson: string;
}

/**
 * Custom hook for form data generation
 */
export const useFormDataGenerator = () => {
  const generateFormData = useCallback((
    formConfig: FormConfig, 
    sections: SectionWithRef[]
  ): GenerateFormDataResult => {
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

    // Collect section data and process field names
    sections.forEach((section) => {
      if (section.ref?.current?.getFormData) {
        // Ensure all fields have proper names before collecting data
        ensureFieldNames(section.ref);
        
        const elements = section.ref.current.getFormData();
        
        // Process each element to ensure proper name generation and persistence
        const processedElements = elements.map((element: any) => {
          // Generate name from label if label exists and name is missing or default
          if (element.label && (!element.name || element.name.startsWith('field-'))) {
            const generatedName = toPascalCase(element.label);
            element.name = generatedName;
            
            // Update the FormBuilder's internal data to persist the change
            if (section.ref?.current?.formBuilder) {
              const fieldData = section.ref.current.formBuilder.actions.getData();
              const fieldIndex = fieldData.findIndex((field: any) => 
                field.type === element.type && field.label === element.label
              );
              
              if (fieldIndex !== -1) {
                fieldData[fieldIndex].name = generatedName;
                section.ref.current.formBuilder.actions.setData(fieldData);
              }
            }
          }

          // Process Events attribute
          if (element.events) {
            try {
              // If events is a string, parse it
              if (typeof element.events === 'string') {
                element.Events = JSON.parse(element.events);
              } else if (Array.isArray(element.events)) {
                element.Events = element.events;
              }
              // Remove the lowercase events property
              delete element.events;
            } catch (error) {
              // If parsing fails, create an empty events array
              element.Events = [];
              delete element.events;
            }
          } else {
            // Ensure Events property exists as empty array if not set
            element.Events = [];
          }
          
          return element;
        });
        
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
  }, []);

  return { generateFormData };
};
