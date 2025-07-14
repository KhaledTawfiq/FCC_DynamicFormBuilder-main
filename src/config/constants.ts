import type { FormConfig } from '../types';

// API Configuration
export const API_CONFIG = {
  BASE_URL_LOCAL: "https://localhost:7013/api/v1/",
  BASE_URL_PROD: "https://fccares-api-us-dev.azurewebsites.net/api/v1/",
  TIMEOUT: 10000,
  ENDPOINTS: {
    DYNAMIC_FORMS: "DynamicForms",
    SUBMIT: "DynamicForms/submit"
  }
} as const;

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
    READONLY: {
      label: "readOnly",
      options: {
        true: "true",
        false: "false"
      }
    },
    READONLY_CONDITION_FIELD: {
      label: "readOnlyConditionField",
      value: ""
    },
    READONLY_CONDITION_TYPE: {
      label: "readOnlyConditionType",
      options: {
        "": "",
        "10": "Has Value"
      }
    },
    READONLY_CONDITION_VALUE: {
      label: "readOnlyConditionValue",
      value: ""
    }
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

// UI Constants
export const UI_CONFIG = {
  SNACKBAR_DURATION: 3000,
  DEBOUNCE_DELAY: 300,
  DRAG_DROP_THRESHOLD: 50
} as const;

// Authentication
export const AUTH_CONFIG = {
  DEFAULT_TOKEN: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyOWRhZmJmNi0xNDc0LTQyODYtODdjMy0zMGIwMTJmNmQ4Y2EiLCJlbWFpbCI6Im1yYW1hZGFuQEZDQ2FyZXMub3JnIiwibmFtZSI6Ik1vaGFtZWQgUmFtYWRhbiIsImlhdCI6IjE3Mzk0NDU4NjUiLCJuYmYiOiIxNzM5NDQ1ODY1IiwiZXhwIjoiMTc2NTYyOTI3MSIsInRpZCI6IjUyY2Y1YTU3LWY5ZTgtNDI5My1iNjc4LTFjODlhMzc3Y2M1OSIsIm9pZCI6ImM2ZDhlY2ViLWFiYWUtNDk4YS05MzhiLTYwZTJmM2EyODU0OCIsIlVzZXJOYW1lIjoibXJhbWFkYW4iLCJEb21haW4iOiJGQ0NhcmVzLm9yZyIsIlByb2plY3RLZXkiOiJEZXZGZWRjYXBDQVJFUyIsIkNvbXBhbnlJZCI6Ijc4IiwiVXNlckdyb3VwOklkIjoiNiIsIlVzZXJHcm91cDpGY2NHcm91cElkIjoiNDQzIiwiVXNlckdyb3VwOkdyb3VwTmFtZSI6Ik1hbmFnZXJzL1N1cGVydmlzb3JzIiwiYXVkIjpbIkZjY1N0YXRpY0FwaSIsIkZjY0FwaSIsIkRvY3VTaWduQXBpIl0sImlzcyI6IkZjY1NlY3VyaXR5QXBpIn0.IAy4WFGkIqn-jf9SowrgCZJVTvih-1pFHB7nsXEglLQ"
} as const;
