// Main hook
export { useFormBuilder } from './useFormBuilder';

// Utility hooks
export { useFormDataGenerator } from './utils/formDataGenerator';
export { useSectionManagement } from './utils/sectionManagement';
export { useApiOperations } from './utils/apiOperations';

// Configuration utilities
export { getFormBuilderOptions, initializeLibraries } from './utils/formBuilderConfig';

// Field name utilities
export { 
  updateFieldNamesFromLabels, 
  setupFieldNameUpdateListeners, 
  ensureFieldNames 
} from './utils/fieldNameUpdater';

// Custom controls
export { registerAddressControl } from './controls/addressControl';
export { registerGroupAttribute } from './controls/groupAttribute';

// Types
export type {
  UseFormBuilderReturn,
  SectionWithRef,
  LoadedTemplate,
  LoadedResponse,
  FormConfig,
  Section
} from './types/formBuilderTypes';

export type { GenerateFormDataResult } from './utils/formDataGenerator';