/**
 * Element Defaults Configuration
 * Provides comprehensive default properties for all form elements
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

export interface ElementDefaults {
  type: string;
  required: boolean;
  label: string;
  description: string;
  placeholder: string;
  className: string;
  name: string;
  access: boolean;
  value: string;
  maxlength: number;
  defaultValue: string;
  readOnly: boolean;
  readOnlyCondition: ReadOnlyCondition;
  other: string;
  groupId: string;
  values: Array<{ value: string; text: string; key: string }>;
  validations: Array<{ type: string; message: string }>;
  Events: Array<EventRule>;
  condition: string;
}

/**
 * Counter for generating unique element names
 */
let elementCounter = 0;

/**
 * Generate a unique element name with the pattern: {type}-{timestamp}-{index}
 */
export const generateElementName = (elementType: string): string => {
  const timestamp = Date.now();
  const index = ++elementCounter;
  const normalizedType = elementType.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${normalizedType}-${timestamp}-${index}`;
};

/**
 * Default configurations for all form elements
 */
export const ELEMENT_DEFAULTS: Record<string, Partial<ElementDefaults>> = {
  // Text Input
  TextInput: {
    type: 'text',
    required: false,
    label: 'Text Field',
    description: 'Enter text information',
    placeholder: 'Enter text here...',
    className: 'form-control',
    access: true,
    value: '',
    maxlength: 255,
    defaultValue: '',
    readOnly: false,
    readOnlyCondition: { field: '', type: '10', value: '' },
    other: '',
    groupId: '',
    values: [],
    validations: [],
    Events: [],
    condition: ''
  },

  // Text Area
  TextArea: {
    type: 'textarea',
    required: false,
    label: 'Text Area',
    description: 'Enter multi-line text',
    placeholder: 'Enter your message here...',
    className: 'form-control',
    access: true,
    value: '',
    maxlength: 1000,
    defaultValue: '',
    readOnly: false,
    readOnlyCondition: { field: '', type: '10', value: '' },
    other: '',
    groupId: '',
    values: [],
    validations: [],
    Events: [],
    condition: ''
  },

  // Number Input
  NumberInput: {
    type: 'number',
    required: false,
    label: 'Number Field',
    description: 'Enter a numeric value',
    placeholder: 'Enter number...',
    className: 'form-control',
    access: true,
    value: '',
    maxlength: 50,
    defaultValue: '',
    readOnly: false,
    readOnlyCondition: { field: '', type: '10', value: '' },
    other: '',
    groupId: '',
    values: [],
    validations: [
      { type: 'number', message: 'Please enter a valid number' }
    ],
    Events: [],
    condition: ''
  },

  // Dropdown/Select
  Dropdown: {
    type: 'select',
    required: false,
    label: 'Select Option',
    description: 'Choose an option from the list',
    placeholder: 'Select an option...',
    className: 'form-control',
    access: true,
    value: '',
    maxlength: 0,
    defaultValue: '',
    readOnly: false,
    readOnlyCondition: { field: '', type: '10', value: '' },
    other: '',
    groupId: '',
    values: [
      { value: 'option1', text: 'Option 1', key: 'option1' },
      { value: 'option2', text: 'Option 2', key: 'option2' },
      { value: 'option3', text: 'Option 3', key: 'option3' }
    ],
    validations: [],
    Events: [],
    condition: ''
  },

  // Radio Buttons
  RadioButtons: {
    type: 'radio-group',
    required: false,
    label: 'Radio Group',
    description: 'Select one option',
    placeholder: '',
    className: 'form-group',
    access: true,
    value: '',
    maxlength: 0,
    defaultValue: '',
    readOnly: false,
    readOnlyCondition: { field: '', type: '10', value: '' },
    other: '',
    groupId: '',
    values: [
      { value: 'option1', text: 'Option 1', key: 'option1' },
      { value: 'option2', text: 'Option 2', key: 'option2' },
      { value: 'option3', text: 'Option 3', key: 'option3' }
    ],
    validations: [],
    Events: [],
    condition: ''
  },

  // Checkboxes
  Checkboxes: {
    type: 'checkbox-group',
    required: false,
    label: 'Checkbox Group',
    description: 'Select multiple options',
    placeholder: '',
    className: 'form-group',
    access: true,
    value: '',
    maxlength: 0,
    defaultValue: '',
    readOnly: false,
    readOnlyCondition: { field: '', type: '10', value: '' },
    other: '',
    groupId: '',
    values: [
      { value: 'option1', text: 'Option 1', key: 'option1' },
      { value: 'option2', text: 'Option 2', key: 'option2' },
      { value: 'option3', text: 'Option 3', key: 'option3' }
    ],
    validations: [],
    Events: [],
    condition: ''
  },

  // Autocomplete/Tags
  Tags: {
    type: 'autocomplete',
    required: false,
    label: 'Autocomplete Field',
    description: 'Type to search and select options',
    placeholder: 'Start typing...',
    className: 'form-control',
    access: true,
    value: '',
    maxlength: 255,
    defaultValue: '',
    readOnly: false,
    readOnlyCondition: { field: '', type: '10', value: '' },
    other: '',
    groupId: '',
    values: [
      { value: 'tag1', text: 'Tag 1', key: 'tag1' },
      { value: 'tag2', text: 'Tag 2', key: 'tag2' },
      { value: 'tag3', text: 'Tag 3', key: 'tag3' }
    ],
    validations: [],
    Events: [],
    condition: ''
  },

  // Button
  Button: {
    type: 'button',
    required: false,
    label: 'Button',
    description: 'Click action button',
    placeholder: '',
    className: 'btn btn-primary',
    access: true,
    value: 'Click Me',
    maxlength: 0,
    defaultValue: 'Click Me',
    readOnly: false,
    readOnlyCondition: { field: '', type: '10', value: '' },
    other: '',
    groupId: '',
    values: [],
    validations: [],
    Events: [],
    condition: ''
  },

  // File Upload
  FileUpload: {
    type: 'file',
    required: false,
    label: 'File Upload',
    description: 'Upload a file',
    placeholder: 'Choose file...',
    className: 'form-control-file',
    access: true,
    value: '',
    maxlength: 0,
    defaultValue: '',
    readOnly: false,
    readOnlyCondition: { field: '', type: '10', value: '' },
    other: '',
    groupId: '',
    values: [],
    validations: [
      { type: 'file', message: 'Please select a valid file' }
    ],
    Events: [],
    condition: ''
  },

  // Date Picker
  DatePicker: {
    type: 'date',
    required: false,
    label: 'Date Field',
    description: 'Select a date',
    placeholder: 'Select date...',
    className: 'form-control',
    access: true,
    value: '',
    maxlength: 0,
    defaultValue: '',
    readOnly: false,
    readOnlyCondition: { field: '', type: '10', value: '' },
    other: '',
    groupId: '',
    values: [],
    validations: [
      { type: 'date', message: 'Please enter a valid date' }
    ],
    Events: [],
    condition: ''
  },

  // Header (static element)
  Header: {
    type: 'header',
    required: false,
    label: 'Header Text',
    description: 'Display header information',
    placeholder: '',
    className: 'header-text',
    access: true,
    value: 'Header Text',
    maxlength: 0,
    defaultValue: 'Header Text',
    readOnly: false,
    readOnlyCondition: { field: '', type: '10', value: '' },
    other: '',
    groupId: '',
    values: [],
    validations: [],
    Events: [],
    condition: ''
  },

  // Paragraph (static element)
  Paragraph: {
    type: 'paragraph',
    required: false,
    label: 'Paragraph Text',
    description: 'Display paragraph information',
    placeholder: '',
    className: 'paragraph-text',
    access: true,
    value: 'Paragraph text content...',
    maxlength: 0,
    defaultValue: 'Paragraph text content...',
    readOnly: false,
    readOnlyCondition: { field: '', type: '10', value: '' },
    other: '',
    groupId: '',
    values: [],
    validations: [],
    Events: [],
    condition: ''
  },
};

/**
 * Apply default properties to a form element
 */
export const applyElementDefaults = (elementType: string, existingElement?: any): any => {
  const defaults = ELEMENT_DEFAULTS[elementType];

  if (!defaults) {
    console.warn(`No defaults found for element type: ${elementType}`);
    return {...existingElement, type: elementType || {type: elementType}} ;
  }

  // Generate unique name
  const elementName = generateElementName(elementType);

  // Merge defaults with existing element properties
  const element = {
    ...defaults,
    ...existingElement,
    name: elementName, // Always use generated name
    field_name: elementName // Some elements use field_name instead

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
    // If element doesn't have a name or has a default/empty name, apply defaults
    if (!element.name ||
      element.name === '' ||
      element.name === 'text_input' ||
      element.name === 'textarea' ||
      element.name === 'number_input' ||
      element.name.startsWith('element_')) {

      // Determine element type from element structure
      let elementType = element.element || element.type || 'TextInput';

      // Map common element names to our configuration keys
      const typeMapping: Record<string, string> = {
        'TextInput': 'TextInput',
        'TextArea': 'TextArea',
        'NumberInput': 'NumberInput',
        'Dropdown': 'Dropdown',
        'RadioButtons': 'RadioButtons',
        'Checkboxes': 'Checkboxes',
        'Tags': 'Tags',
        'Button': 'Button',
        'FileUpload': 'FileUpload',
        'DatePicker': 'DatePicker',
        'Header': 'Header',
        'Paragraph': 'Paragraph',
      };

      elementType = typeMapping[elementType] || elementType;

      return applyElementDefaults(elementType, element);
    }

    return element;
  });
};

/**
 * Enhanced form data processor for export/save operations
 */
export const enhanceFormData = (data: any[]): any[] => {
  return processFormData(data);
};
