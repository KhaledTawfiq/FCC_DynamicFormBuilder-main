import { useCallback } from 'react';
import type { FormConfig, Section } from '../../types';


export interface GenerateFormDataResult {
  title: string;
  sections: {title: string, elements: any[], icon?: string}[];
}

/**
 * Clean element data by removing internal properties
 */
const cleanElementForOutput = (el: any) => {
  const {

    
    // Remove other internal properties
    static: _static,
    field_name,
    elementId,
    description,
    icon,
    maxlength,
    condition,
    element,
    sectionId,
    key,
    other,
    subtype,
    text,
    // Keep all other properties
    ...cleanElement
  } = el;
  // Handle special type mapping for custom components
  if (el.key === 'SearchLookupComponent' || el.element === 'SearchLookupComponent') {
    cleanElement.type = 'search-lookup';
  }
    
  if (el.key === 'AddressComponent' || el.element === 'AddressComponent') {
    cleanElement.type = 'address';
  }
  return cleanElement;
};
const cleanSectionForOutput = (section: Section) => {
  const {
    // Remove internal properties that aren't needed for final form
    id,
    title,
    icon,
  } = section;
  return {
    title,
    icon,
    elements: (section.elements || []).map(cleanElementForOutput),
  };
};  
/**
 * Custom hook for form data generation - Updated to match desired output format
 */
export const useFormDataGenerator = () => {
  const generateFormData = useCallback((
    formConfig: FormConfig,
    sections: any[]
  ): GenerateFormDataResult => {

  // Clean each section and its elements
  const cleanedSections = sections.map(cleanSectionForOutput);

    return {
      title: formConfig.formTitle || '',
      sections: cleanedSections || [],
    };
  }, []);
  return {
    generateFormData,
  };
};