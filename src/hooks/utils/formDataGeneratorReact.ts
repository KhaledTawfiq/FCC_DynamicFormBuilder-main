import { useCallback } from 'react';
import type { FormConfig } from '../../types';
import type { SectionWithRef } from '../types/formBuilderTypes';

export interface GenerateFormDataResult {
  formattedTemplateJson: string;
  generatedObject: {
    key: string;
    version: string;
    companyId: string;
    template: {
      title: string;
      sections: Array<{
        title: string;
        icon?: string;
        elements: any[];
      }>;
    };
  };
}

/**
 * Clean element data by removing react-form-builder2 internal properties
 */
const cleanElementData = (element: any) => {
  const {
    // Remove internal react-form-builder2 properties
    canHaveAnswer,
    canHavePageBreakBefore,
    canHaveAlternateForm,
    canHaveDisplayHorizontal,
    canHaveOptionCorrect,
    canHaveOptionValue,
    canPopulateFromApi,
    // Remove other internal properties
    dirty,
    static: _static,
    field_name,
    // Keep all other properties
    ...cleanElement
  } = element;

  return cleanElement;
};

/**
 * Custom hook for form data generation - React Implementation with Clean JSON
 */
export const useFormDataGeneratorReact = () => {
  const generateFormData = useCallback((
    formConfig: FormConfig,
    sections: SectionWithRef[]
  ): GenerateFormDataResult => {
    // Generate the form template object with cleaned elements
    const generatedObject = {
      key: formConfig.formKey || 'tw',
      version: formConfig.version || '1.0',
      companyId: formConfig.companyId || '0',
      template: {
        title: formConfig.formTitle || 'Dynamic Form',
        sections: sections.map(section => ({
          title: section.title || '',
          icon: (section as any).icon || '',
          elements: ((section as any).elements || []).map(cleanElementData)
        }))
      }
    };

    // Format as JSON string
    const formattedTemplateJson = JSON.stringify(generatedObject, null, 2);

    return {
      formattedTemplateJson,
      generatedObject
    };
  }, []);

  return { generateFormData };
};




















// import { useCallback } from 'react';
// import type { FormConfig } from '../../types';
// import type { SectionWithRef } from '../types/formBuilderTypes';

// export interface GenerateFormDataResult {
//   formattedTemplateJson: string;
//   generatedObject: {
//     key: string;
//     version: string;
//     companyId: string;
//     template: {
//       title: string;
//       sections: Array<{
//         title: string;
//         icon?: string;
//         elements: any[];
//       }>;
//     };
//   };
// }

// /**
//  * Custom hook for form data generation - React Native Implementation
//  */
// export const useFormDataGeneratorReact = () => {
//   const generateFormData = useCallback((
//     formConfig: FormConfig,
//     sections: SectionWithRef[]
//   ): GenerateFormDataResult => {
//     // Generate the form template object
//     const generatedObject = {
//       key: formConfig.formKey || 'tw',
//       version: formConfig.version || '1.0',
//       companyId: formConfig.companyId || '0',
//       template: {
//         title: formConfig.formTitle || 'Dynamic Form',
//         sections: sections.map(section => ({
//           title: section.title || '',
//           icon: (section as any).icon || '',
//           elements: (section as any).elements || []
//         }))
//       }
//     };

//     // Format as JSON string
//     const formattedTemplateJson = JSON.stringify(generatedObject, null, 2);

//     return {
//       formattedTemplateJson,
//       generatedObject
//     };
//   }, []);

//   return { generateFormData };
// };
