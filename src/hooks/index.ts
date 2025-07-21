// Main hook
export { useFormBuilder } from './useFormBuilder';

// Utility hooks
export { useFormDataGenerator } from './utils/formDataGenerator';
export { useSectionManagement } from './utils/sectionManagement';
export { useApiOperations } from './utils/apiOperations';
export { useEnumGroups } from './useEnumGroups';

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
export { registerGroupIdControl } from './controls/groupIdControl';

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
export type { EnumGroup, EnumItem } from '../services/apiService';