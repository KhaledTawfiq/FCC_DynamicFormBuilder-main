/**
 * ReadOnly Attribute Processor
 * Handles processing of readOnly attributes in form elements
 */

export interface ReadOnlyCondition {
  field: string;
  type: number;
  value: string;
}

export interface ReadOnlyConfig {
  readOnly: boolean;
  readOnlyCondition: ReadOnlyCondition;
}

/**
 * Checks if readOnly condition has any data
 */
export const hasConditionData = (condition: ReadOnlyCondition | undefined): boolean => {
  if (!condition) return false;
  
  return !!(
    condition.field || 
    condition.value || 
    (condition.type && condition.type !== 10)
  );
};

/**
 * Processes readOnly attribute for a form element
 * 
 * Logic:
 * - If readOnly is true and no condition data → only set readOnly: true
 * - If any condition field has data → set readOnly: false and include condition
 * - If readOnly is false and no condition data → only set readOnly: false
 * 
 * @param element - The form element to process
 * @returns The processed element with flattened readOnly properties
 */
export const processReadOnlyAttribute = (element: any): any => {
  if (!element.readOnly) {
    return element;
  }

  try {
    let readOnlyConfig: ReadOnlyConfig;
    
    // Parse the readOnly configuration
    if (typeof element.readOnly === 'string') {
      readOnlyConfig = JSON.parse(element.readOnly);
    } else if (typeof element.readOnly === 'object' && element.readOnly.readOnly !== undefined) {
      readOnlyConfig = element.readOnly;
    } else {
      // Invalid format, skip processing
      return element;
    }
    
    const condition = readOnlyConfig.readOnlyCondition || {};
    const hasCondition = hasConditionData(condition);
    
    if (hasCondition) {
      // If condition has data, set readOnly to false and include condition
      element.readOnly = false;
      element.readOnlyCondition = condition;
    } else if (readOnlyConfig.readOnly === true) {
      // If readOnly is true and no condition data, only set readOnly (no condition object)
      element.readOnly = true;
      // Don't include readOnlyCondition in output
    } else {
      // If readOnly is false and no condition data, set readOnly to false
      element.readOnly = false;
      // Don't include readOnlyCondition since it's empty
    }
    
  } catch (error) {
    // If parsing fails, create default
    console.error('Error parsing readOnly attribute:', error);
    element.readOnly = false;
  }
  
  return element;
};

/**
 * Processes multiple form elements with readOnly attributes
 * 
 * @param elements - Array of form elements to process
 * @returns Array of processed elements
 */
export const processElementsReadOnly = (elements: any[]): any[] => {
  return elements.map(processReadOnlyAttribute);
};

/**
 * Creates default readOnly configuration
 */
export const createDefaultReadOnlyConfig = (): ReadOnlyConfig => ({
  readOnly: false,
  readOnlyCondition: {
    field: "",
    type: 10,
    value: ""
  }
});