import type { FormConfig } from '../types';

// FormBuilder Configuration
export const FORM_BUILDER_CONFIG = {
  CONTROL_ORDER: [
    "text",
    "email",
    "password",
    "url",
    "tel",
    "textarea",
    "button",
    "select",
    "radio-group",
    "checkbox-group",
    "autocomplete",
    "address", // NEW: Added address control
    "hidden",
    "paragraph",
    "header",
    "file",
    "date",
    "time",
    "datetime-local",
    "month",
    "week",
    "number",
    "range",
    "color",
  ] as const,

  // Sticky Controls Configuration
  STICKY_CONTROLS: {
    enable: true,
    offset: {
      top: 5,
      bottom: "auto",
      right: "auto"
    }
  },

  FIELD_ATTRIBUTES: {
    OTHER: {
      label: "Other",
      options: {
        true: "true",
        false: "false"
      }
    },
    SUBTYPE: {
      label: "subtype",
      value: ""
    },
    DEFAULT_VALUE: {
      label: "defaultValue",
      value: ""
    },
    GROUP_ID: {
      label: "groupId",
      value: ""
    },
    LIST_PROPERTY_KEY: {
      label: "listPropertyKey",
      value: ""
    },
    VALUES: {
      label: "Values",
      value: ""
    },
    VALIDATIONS: {
      label: "validations",
      value: ""
    },
    CONDITION: {
      label: "condition",
      value: ""
    },
    // NEW: Address-specific attributes
    ADDRESS_FORMAT: {
      label: "addressFormat",
      value: "single",
      options: {
        single: "Single Line",
        multi: "Multi-line",
        structured: "Structured"
      }
    },
    RESTRICT_TO_COUNTRY: {
      label: "restrictToCountry",
      value: ""
    },
    ENABLE_AUTOCOMPLETE: {
      label: "enableAutocomplete",
      value: true
    },
    VALIDATE_ADDRESS: {
      label: "validateAddress",
      value: false
    },
    EVENTS: {
      label: "Events",
      type: "text",
      value: '[{"Type": "getOptions", "On": "render", "Url": "v1/EducationProgram", "Parameters": ""}]'
    },
  }
} as const;

// Default Form Configuration
export const DEFAULT_FORM_CONFIG: FormConfig = {
  formId: '',
  formKey: 'twpf',
  companyId: '78',
  version: '1',
  formClass: '',
  disableInjectedStyle: false,
  disabledActionButtons: [],
  disabledAttrs: [],
  disabledFieldButtons: {},
  disabledSubtypes: {},
  editOnAdd: false,
  fields: [],
  inputSets: [],
  typeUserAttrs: {},
  typeUserEvents: {}
};