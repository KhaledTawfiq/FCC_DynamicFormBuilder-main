/**
 * Updated Element Defaults Configuration
 * Configured to match the desired output format
 */

export interface EventRule {
  Type: string;
  On: string;
  Url: string;
  Parameters: string;
}

export interface ReadOnlyCondition {
  field: string;
  type: string;
  value: string;
}

export interface OptionValue {
  label: string;
  value: string;
  selected: boolean;
}

export interface ElementDefaults {
  type: string;
  required: boolean;
  label: string;
  className?: string;
  name: string;
  access: boolean;
  subtype?: string;
  multiple?: boolean;
  values?: OptionValue[];
  inline?: boolean;
  toggle?: boolean;
  style?: string;
  // Address-specific properties
  includeAddressCountry?: boolean;
  includeAddressApartment?: boolean;
  // Search lookup properties
  searchUrl?: string;
  searchParameters?: string;
  // Readonly and Group ID properties
  readOnly?: boolean;
  readOnlyCondition?: ReadOnlyCondition;
  groupId?: string;
  description?: string;
  placeholder?: string;
  defaultValue?: string;
  maxlength?: number;
  other?: string;
  condition?: string;
  validations?: Array<{ type: string; message: string }>;
  Events?: Array<EventRule>;
}

/**
 * Counter for generating unique element names
 */
let elementCounter = 0;

/**
 * Generate a unique element name with the pattern: {type}-{timestamp}-{counter}
 */
export const generateElementName = (elementType: string): string => {
  const timestamp = Date.now();
  const index = elementCounter++;
  const normalizedType = elementType.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${normalizedType}-${timestamp}-${index}`;
};

/**
 * Default configurations for all form elements matching the desired output format
 */
export const ELEMENT_DEFAULTS: Record<string, Partial<ElementDefaults>> = {
  // Date Field
  DatePicker: {
    type: 'date',
    required: false,
    label: 'Date Field',
    className: 'form-control',
    access: false,
    readOnly: false,
    readOnlyCondition: { field: '', type: '10', value: '' },
    groupId: '',
    description: '',
    placeholder: 'Select date...',
    defaultValue: '',
    maxlength: 0,
    other: '',
    condition: '',
    validations: [],
    Events: []
  },

  // Text Input
  TextInput: {
    type: 'text',
    required: false,
    label: 'Text Field',
    className: 'form-control',
    access: false,
    subtype: 'text',
    readOnly: false,
    readOnlyCondition: { field: '', type: '10', value: '' },
    groupId: '',
    description: '',
    placeholder: 'Enter text here...',
    defaultValue: '',
    maxlength: 255,
    other: '',
    condition: '',
    validations: [],
    Events: []
  },

  // Dropdown/Select
  Dropdown: {
    type: 'select',
    required: false,
    label: 'Select',
    className: 'form-control',
    access: false,
    multiple: false,
    readOnly: false,
    readOnlyCondition: { field: '', type: '10', value: '' },
    groupId: '',
    description: '',
    placeholder: 'Select an option...',
    defaultValue: '',
    maxlength: 0,
    other: '',
    condition: '',
    validations: [],
    Events: [],
    values: [
      { label: 'Option 1', value: 'option-1', selected: true },
      { label: 'Option 2', value: 'option-2', selected: false },
      { label: 'Option 3', value: 'option-3', selected: false }
    ]
  },

  // Radio Group
  RadioButtons: {
    type: 'radio-group',
    required: false,
    label: 'Radio Group',
    inline: false,
    access: false,
    readOnly: false,
    readOnlyCondition: { field: '', type: '10', value: '' },
    groupId: '',
    description: '',
    placeholder: '',
    defaultValue: '',
    maxlength: 0,
    condition: '',
    validations: [],
    Events: [],
    values: [
      { label: 'Option 1', value: 'option-1', selected: false },
      { label: 'Option 2', value: 'option-2', selected: false },
      { label: 'Option 3', value: 'option-3', selected: false }
    ]
  },

  // Number Input
  NumberInput: {
    type: 'number',
    required: false,
    label: 'Number',
    className: 'form-control',
    access: false,
    subtype: 'number',
    readOnly: false,
    readOnlyCondition: { field: '', type: '10', value: '' },
    groupId: '',
    description: '',
    placeholder: 'Enter number here...',
    defaultValue: '',
    maxlength: 50,
    other: '',
    condition: '',
    validations: [
      { type: 'number', message: 'Please enter a valid number' }
    ],
    Events: []
  },

  // Text Area
  TextArea: {
    type: 'textarea',
    required: false,
    label: 'Text Area',
    className: 'form-control',
    access: false,
    subtype: 'textarea',
    readOnly: false,
    readOnlyCondition: { field: '', type: '10', value: '' },
    groupId: '',
    description: '',
    placeholder: 'Enter your text here...',
    defaultValue: '',
    maxlength: 1000,
    other: '',
    condition: '',
    validations: [],
    Events: []
  },

  // Checkbox Group
  Checkboxes: {
    type: 'checkbox-group',
    required: false,
    label: 'Checkbox Group',
    toggle: false,
    inline: false,
    access: false,
    readOnly: false,
    readOnlyCondition: { field: '', type: '10', value: '' },
    groupId: '',
    description: '',
    placeholder: '',
    defaultValue: '',
    maxlength: 0,
    condition: '',
    validations: [],
    Events: [],
    values: [
      { label: 'Option 1', value: 'option-1', selected: true }
    ]
  },

  // Paragraph
  Paragraph: {
    type: 'paragraph',
    subtype: 'p',
    label: 'Paragraph',
    access: false,
    readOnly: false,
    readOnlyCondition: { field: '', type: '10', value: '' },
    groupId: '',
    description: '',
    placeholder: '',
    defaultValue: 'Paragraph text content...',
    maxlength: 0,
    other: '',
    condition: '',
    validations: [],
    Events: []
  },

  // Button
  Button: {
    type: 'button',
    label: 'Button',
    subtype: 'button',
    className: 'btn-default btn',
    access: false,
    style: 'default',
    readOnly: false,
    readOnlyCondition: { field: '', type: '10', value: '' },
    groupId: '',
    description: '',
    placeholder: '',
    defaultValue: 'Click Me',
    maxlength: 0,
    other: '',
    condition: '',
    validations: [],
    Events: []
  },

  // Address Component
  address: {
    type: 'address',
    required: false,
    label: 'Address Field',
    className: 'form-control',
    access: false,
    includeAddressCountry: true,
    includeAddressApartment: true,
    readOnly: false,
    readOnlyCondition: { field: '', type: '10', value: '' },
    groupId: '',
    description: '',
    placeholder: 'Enter address...',
    defaultValue: '',
    maxlength: 500,
    other: '',
    condition: '',
    validations: [],
    Events: []
  },

  // Address Component (alternative key)
  AddressComponent: {
    type: 'address',
    required: false,
    label: 'Address Field',
    className: 'form-control',
    access: false,
    includeAddressCountry: true,
    includeAddressApartment: true,
    readOnly: false,
    readOnlyCondition: { field: '', type: '10', value: '' },
    groupId: '',
    description: '',
    placeholder: 'Enter address...',
    defaultValue: '',
    maxlength: 500,
    other: '',
    condition: '',
    validations: [],
    Events: []
  },

  // Search Lookup Component
  SearchLookupComponent: {
    type: 'search-lookup',
    required: false,
    label: 'Search Field',
    className: 'form-control',
    access: false,
    searchUrl: '',
    searchParameters: '',
    readOnly: false,
    readOnlyCondition: { field: '', type: '10', value: '' },
    groupId: '',
    description: '',
    placeholder: 'Search...',
    defaultValue: '',
    maxlength: 255,
    other: '',
    condition: '',
    validations: [],
    Events: []
  }
};

/**
 * Apply default properties to a form element
 */
export const applyElementDefaults = (elementType: string, existingElement?: any): any => {
  const defaults = ELEMENT_DEFAULTS[elementType];

  if (!defaults) {
    console.warn(`No defaults found for element type: ${elementType}`);
    return { type: elementType.toLowerCase(), ...existingElement };
  }

  // Generate unique name for elements that need it
  const needsName = !['paragraph'].includes(defaults.type || '');
  const elementName = needsName ? generateElementName(defaults.type || elementType) : undefined;

  // Merge defaults with existing element properties
  const element = {
    ...defaults,
    ...existingElement,
    ...(needsName && { name: elementName })
  };

  console.log(`Applied defaults for ${elementType}:`, element);
  return element;
};

/**
 * Process form data to apply defaults to new elements
 */
export const processFormData = (data: any[]): any[] => {
  if (!Array.isArray(data)) {
    console.warn('processFormData expects an array, received:', typeof data);
    return [];
  }

  return data.map((element, index) => {
    // Map element types from your form builder to the desired output format
    const typeMapping: Record<string, string> = {
      'TextInput': 'TextInput',
      'TextArea': 'TextArea', 
      'NumberInput': 'NumberInput',
      'Dropdown': 'Dropdown',
      'RadioButtons': 'RadioButtons',
      'Checkboxes': 'Checkboxes',
      'Button': 'Button',
      'DatePicker': 'DatePicker',
      'Paragraph': 'Paragraph',
      'address': 'address',
      'AddressComponent': 'address',
      'SearchLookupComponent': 'SearchLookupComponent',
      'search-lookup': 'SearchLookupComponent'
    };

    let elementType = element.element || element.type || 'TextInput';
    
    // Special handling for SearchLookupComponent
    if (elementType === 'SearchLookupComponent' || element.key === 'SearchLookupComponent') {
      elementType = 'SearchLookupComponent';
    }
    
    elementType = typeMapping[elementType] || elementType;

    return applyElementDefaults(elementType, element);
  });
};

/**
 * Clean and format element data for final output
 * PRESERVES ALL readonly, group ID, Events, and advanced properties
 */
export const cleanElementForOutput = (element: any): any => {
  const cleanElement: any = {};

  // Map element types to the desired output types
  let outputType = element.type;
  
  // Handle special type mappings
  if (element.element === 'SearchLookupComponent' || element.key === 'SearchLookupComponent' || element.type === 'searchlookupcomponent') {
    outputType = 'search-lookup';
  } else if (element.element === 'AddressComponent' || element.key === 'address' || element.type === 'addresscomponent') {
    outputType = 'address';
  }

  // Always include type
  cleanElement.type = outputType;

  // ALWAYS include these common properties for ALL elements (preserve everything)
  if (element.required !== undefined) cleanElement.required = element.required;
  if (element.label) cleanElement.label = element.label;
  if (element.className) cleanElement.className = element.className;
  if (element.name) cleanElement.name = element.name;
  if (element.access !== undefined) cleanElement.access = element.access;
  
  // READONLY PROPERTIES - Always preserve
  if (element.readOnly !== undefined) cleanElement.readOnly = element.readOnly;
  if (element.readOnlyCondition) cleanElement.readOnlyCondition = element.readOnlyCondition;
  
  // GROUP ID - Always preserve
  if (element.groupId) cleanElement.groupId = element.groupId;
  
  // EVENTS - Always preserve
  if (element.Events && Array.isArray(element.Events)) {
    cleanElement.Events = element.Events;
  }
  
  // ADVANCED PROPERTIES - Always preserve
  if (element.description) cleanElement.description = element.description;
  if (element.placeholder) cleanElement.placeholder = element.placeholder;
  if (element.defaultValue !== undefined) cleanElement.defaultValue = element.defaultValue;
  if (element.maxlength !== undefined) cleanElement.maxlength = element.maxlength;
  if (element.other) cleanElement.other = element.other;
  if (element.condition) cleanElement.condition = element.condition;
  
  // VALIDATIONS - Always preserve
  if (element.validations && Array.isArray(element.validations) && element.validations.length > 0) {
    cleanElement.validations = element.validations;
  }

  // Add element-specific properties based on type
  switch (outputType) {
    case 'date':
      // Set defaults if not provided
      if (cleanElement.required === undefined) cleanElement.required = false;
      if (!cleanElement.label) cleanElement.label = 'Date Field';
      if (!cleanElement.className) cleanElement.className = 'form-control';
      if (cleanElement.access === undefined) cleanElement.access = false;
      break;

    case 'text':
      cleanElement.subtype = 'text';
      // Set defaults if not provided
      if (cleanElement.required === undefined) cleanElement.required = false;
      if (!cleanElement.label) cleanElement.label = 'Text Field';
      if (!cleanElement.className) cleanElement.className = 'form-control';
      if (cleanElement.access === undefined) cleanElement.access = false;
      break;

    case 'select':
      if (element.multiple !== undefined) cleanElement.multiple = element.multiple;
      if (element.values) cleanElement.values = element.values;
      // Set defaults if not provided
      if (cleanElement.required === undefined) cleanElement.required = false;
      if (!cleanElement.label) cleanElement.label = 'Select';
      if (!cleanElement.className) cleanElement.className = 'form-control';
      if (cleanElement.access === undefined) cleanElement.access = false;
      if (cleanElement.multiple === undefined) cleanElement.multiple = false;
      if (!cleanElement.values) cleanElement.values = [];
      break;

    case 'radio-group':
      if (element.inline !== undefined) cleanElement.inline = element.inline;
      if (element.other !== undefined) cleanElement.other = element.other;
      if (element.values) cleanElement.values = element.values;
      // Set defaults if not provided
      if (cleanElement.required === undefined) cleanElement.required = false;
      if (!cleanElement.label) cleanElement.label = 'Radio Group';
      if (cleanElement.access === undefined) cleanElement.access = false;
      if (cleanElement.inline === undefined) cleanElement.inline = false;
      if (cleanElement.other === undefined) cleanElement.other = false;
      if (!cleanElement.values) cleanElement.values = [];
      break;

    case 'number':
      cleanElement.subtype = 'number';
      // Set defaults if not provided
      if (cleanElement.required === undefined) cleanElement.required = false;
      if (!cleanElement.label) cleanElement.label = 'Number';
      if (!cleanElement.className) cleanElement.className = 'form-control';
      if (cleanElement.access === undefined) cleanElement.access = false;
      break;

    case 'textarea':
      cleanElement.subtype = 'textarea';
      // Set defaults if not provided
      if (cleanElement.required === undefined) cleanElement.required = false;
      if (!cleanElement.label) cleanElement.label = 'Text Area';
      if (!cleanElement.className) cleanElement.className = 'form-control';
      if (cleanElement.access === undefined) cleanElement.access = false;
      break;

    case 'checkbox-group':
      if (element.toggle !== undefined) cleanElement.toggle = element.toggle;
      if (element.inline !== undefined) cleanElement.inline = element.inline;
      if (element.other !== undefined) cleanElement.other = element.other;
      if (element.values) cleanElement.values = element.values;
      // Set defaults if not provided
      if (cleanElement.required === undefined) cleanElement.required = false;
      if (!cleanElement.label) cleanElement.label = 'Checkbox Group';
      if (cleanElement.access === undefined) cleanElement.access = false;
      if (cleanElement.toggle === undefined) cleanElement.toggle = false;
      if (cleanElement.inline === undefined) cleanElement.inline = false;
      if (cleanElement.other === undefined) cleanElement.other = false;
      if (!cleanElement.values) cleanElement.values = [];
      break;

    case 'paragraph':
      cleanElement.subtype = 'p';
      // Set defaults if not provided
      if (!cleanElement.label) cleanElement.label = 'Paragraph';
      if (cleanElement.access === undefined) cleanElement.access = false;
      break;

    case 'button':
      cleanElement.subtype = 'button';
      if (element.style) cleanElement.style = element.style;
      // Set defaults if not provided
      if (!cleanElement.label) cleanElement.label = 'Button';
      if (!cleanElement.className) cleanElement.className = 'btn-default btn';
      if (cleanElement.access === undefined) cleanElement.access = false;
      if (!cleanElement.style) cleanElement.style = 'default';
      break;

    case 'address':
      // Address-specific properties
      if (element.includeAddressCountry !== undefined) {
        cleanElement.includeAddressCountry = element.includeAddressCountry;
      }
      if (element.includeAddressApartment !== undefined) {
        cleanElement.includeAddressApartment = element.includeAddressApartment;
      }
      // Set defaults if not provided
      if (cleanElement.required === undefined) cleanElement.required = false;
      if (!cleanElement.label) cleanElement.label = 'Address Field';
      if (!cleanElement.className) cleanElement.className = 'form-control';
      if (cleanElement.access === undefined) cleanElement.access = false;
      break;

    case 'search-lookup':
      // Search lookup specific properties
      if (element.searchUrl !== undefined) cleanElement.searchUrl = element.searchUrl;
      if (element.searchParameters !== undefined) cleanElement.searchParameters = element.searchParameters;
      // Set defaults if not provided
      if (cleanElement.required === undefined) cleanElement.required = false;
      if (!cleanElement.label) cleanElement.label = 'Search Field';
      if (!cleanElement.className) cleanElement.className = 'form-control';
      if (cleanElement.access === undefined) cleanElement.access = false;
      if (cleanElement.searchUrl === undefined) cleanElement.searchUrl = '';
      if (cleanElement.searchParameters === undefined) cleanElement.searchParameters = '';
      break;

    default:
      // Fallback for unknown types - preserve everything
      return { ...element, type: outputType };
  }

  // ENSURE ALL CRITICAL PROPERTIES ARE NEVER MISSING (set defaults if undefined)
  
  // Readonly defaults
  if (cleanElement.readOnly === undefined) cleanElement.readOnly = false;
  if (!cleanElement.readOnlyCondition) {
    cleanElement.readOnlyCondition = { field: '', type: '10', value: '' };
  }
  
  // Group ID default
  if (!cleanElement.groupId) cleanElement.groupId = '';
  
  // Events default
  if (!cleanElement.Events) cleanElement.Events = [];
  
  // Advanced properties defaults
  if (!cleanElement.description) cleanElement.description = '';
  if (!cleanElement.other) cleanElement.other = '';
  if (!cleanElement.condition) cleanElement.condition = '';
  if (!cleanElement.validations) cleanElement.validations = [];

  return cleanElement;
};

/**
 * Enhanced form data processor for export/save operations
 */
export const enhanceFormData = (data: any[]): any[] => {
  const processedData = processFormData(data);
  return processedData.map(cleanElementForOutput);
};