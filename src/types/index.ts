// Form configuration types
export interface FormConfig {
  formId?: string;
  formTitle?: string;
  formKey: string;
  companyId: string;
  version: string;
  formClass?: string;
  disableInjectedStyle?: boolean;
  disabledActionButtons?: string[];
  disabledAttrs?: string[];
  disabledFieldButtons?: Record<string, string[]>;
  disabledSubtypes?: Record<string, string[]>;
  editOnAdd?: boolean;
  fields?: FieldConfig[];
  inputSets?: InputSet[];
  typeUserAttrs?: Record<string, any>;
  typeUserEvents?: Record<string, any>;
}

export interface FieldConfig {
  label: string;
  type: string;
  required?: boolean;
  description?: string;
  subtype?: string;
  className?: string;
  name?: string;
  value?: string | string[];
  values?: OptionValue[];
  placeholder?: string;
  maxlength?: number;
  rows?: number;
  cols?: number;
  min?: number;
  max?: number;
  step?: number;
  multiple?: boolean;
  other?: boolean;
  toggle?: boolean;
  inline?: boolean;
  style?: string;
  access?: boolean;
  userData?: string[];
  // Address-specific properties
  includeAddressCountry?: boolean;
  includeAddressApartment?: boolean;
}

export interface OptionValue {
  label: string;
  value: string;
  selected?: boolean;
}

export interface InputSet {
  label: string;
  name?: string;
  icon?: string;
}

// Section types
export interface Section {
  id: string;
  title: string;
  fields: FieldConfig[];
  formData?: string;
}

// Modal types
export interface JsonModalProps {
  isOpen: boolean;
  jsonData: any;
  onClose: () => void;
}

// Snackbar types
export type SnackbarType = 'info' | 'success' | 'error' | 'warning';

export interface SnackbarProps {
  message: string | null;
  type: SnackbarType;
  onClose?: () => void;
}

export interface SnackbarState {
  message: string | null;
  type: SnackbarType;
}

// Form Builder hook types
export interface UseFormBuilderReturn {
  formConfig: FormConfig;
  sections: Section[];
  formBuilderOptions: any;
  isSubmitting: boolean;
  isLoadingForm: boolean;
  addSection: () => void;
  removeSection: (index: number) => void;
  updateSection: (index: number, updatedSection: Section) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;
  generateFormData: () => { formattedTemplateJson: any };
  submitForm: () => Promise<void>;
  loadJson: () => Promise<void>;
  setFormConfig: (config: FormConfig) => void;
}

// Component prop types
export interface FormConfigurationProps {
  formConfig: FormConfig;
  onConfigChange: (config: FormConfig) => void;
  disabled?: boolean;
}

export interface SectionProps {
  section: Section;
  index: number;
  formBuilderOptions: any;
  onRemove: (index: number) => void;
  onUpdate: (index: number, section: Section) => void;
  onDragStart?: (index: number) => void;
  onDragOver?: (index: number) => void;
  onDrop?: (index: number) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  draggedIndex?: number | null;
  className?: string;
}

export interface ActionButtonsProps {
  onAddSection: () => void;
  onViewJson: () => void;
  onSubmit: () => void;
  onLoadJson: () => void;
  isSubmitting: boolean;
  isLoading: boolean;
}
