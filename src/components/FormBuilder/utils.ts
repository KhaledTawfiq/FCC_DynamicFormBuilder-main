import { FormElement, Option } from './types';

export function getDefaultText(elementType: string): string {
  const defaults: Record<string, string> = {
    Header: 'Header Text',
    Paragraph: 'Paragraph text',
    LineBreak: '',
    Dropdown: 'Dropdown',
    Tags: 'Tags',
    Checkboxes: 'Checkboxes',
    RadioButtons: 'Multiple Choice',
    TextInput: 'Text Input',
    NumberInput: 'Number Input',
    TextArea: 'Multi-line Input',
  };
  return defaults[elementType] || 'Form Element';
}

export function getDefaultLabel(elementType: string): string {
  const defaults: Record<string, string> = {
    Header: 'Header',
    Paragraph: 'Paragraph',
    LineBreak: 'Line Break',
    Dropdown: 'Select an option',
    Tags: 'Enter tags',
    Checkboxes: 'Select all that apply',
    RadioButtons: 'Choose one option',
    TextInput: 'Enter text',
    NumberInput: 'Enter number',
    TextArea: 'Enter detailed text',
  };
  return defaults[elementType] || 'Form Field';
}

export function getElementDefaults(elementType: string): Partial<FormElement> {
  const defaultOptions = {
    Dropdown: [
      { value: 'option1', text: 'Option 1', key: 'dropdown_option_1' },
      { value: 'option2', text: 'Option 2', key: 'dropdown_option_2' },
      { value: 'option3', text: 'Option 3', key: 'dropdown_option_3' }
    ],
    Checkboxes: [
      { value: 'check1', text: 'Choice 1', key: 'checkboxes_option_1' },
      { value: 'check2', text: 'Choice 2', key: 'checkboxes_option_2' },
      { value: 'check3', text: 'Choice 3', key: 'checkboxes_option_3' }
    ],
    RadioButtons: [
      { value: 'radio1', text: 'Option 1', key: 'radiobuttons_option_1' },
      { value: 'radio2', text: 'Option 2', key: 'radiobuttons_option_2' },
      { value: 'radio3', text: 'Option 3', key: 'radiobuttons_option_3' }
    ]
  };

  const defaults: Record<string, Partial<FormElement>> = {
    Dropdown: {
      options: defaultOptions.Dropdown
    },
    Checkboxes: {
      options: defaultOptions.Checkboxes
    },
    RadioButtons: {
      options: defaultOptions.RadioButtons
    },
    Tags: {
      options: []
    },
    Header: {
      level: 1
    },
    TextInput: {
      placeholder: 'Enter text here...'
    },
    NumberInput: {
      placeholder: 'Enter number here...'
    },
    TextArea: {
      placeholder: 'Enter your text here...',
      rows: 4
    }
  };
  
  return defaults[elementType] || {};
}

export function createNewElement(elementType: string, sectionId: string): FormElement {
  return {
    id: `${sectionId}_${elementType}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    element: elementType,
    text: getDefaultText(elementType),
    required: false,
    label: getDefaultLabel(elementType),
    sectionId: sectionId,
    field_name: `${elementType}_${Date.now()}`,
    static: false,
    ...getElementDefaults(elementType)
  };
}
