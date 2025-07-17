import type { FormConfig, Section } from '../../types';

export type { FormConfig, Section };

export interface SectionWithRef extends Section {
  ref?: { current: any };
  elements?: any[];
  icon?: string;
}

export interface LoadedTemplate {
  title?: string;
  sections?: Array<{
    title?: string;
    icon?: string;
    elements?: any[];
  }>;
}

export interface LoadedResponse {
  template?: LoadedTemplate;
  key?: string;
  version?: string;
  companyId?: string;
}

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
  generateFormData: () => { formattedTemplateJson: string };
  submitForm: () => Promise<void>;
  loadJson: () => Promise<void>;
  setFormConfig: (config: FormConfig) => void;
}
