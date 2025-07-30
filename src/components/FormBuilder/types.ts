export interface FormBuilderProps {
  sectionId: string;
  sectionUniqueId: string;
  initialData: FormElement[];
  onDataChange: (data: FormElement[]) => void;
  toolbarItems: ToolbarItem[];
  buildWrapId: string;
}

export interface FormElement {
  id: string;
  element: string;
  text?: string;
  label?: string;
  required?: boolean;
  sectionId: string;
  field_name: string;
  static?: boolean;
  level?: number;
  placeholder?: string;
  rows?: number;
  options?: Option[];
}

export interface Option {
  value: string;
  text: string;
  key: string;
}

export interface ToolbarItem {
  key: string;
  name: string;
  icon: string;
  element?: string;
}

export interface ElementActionsProps {
  index: number;
  totalElements: number;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export interface FormBuilderPreviewProps {
  formElements: FormElement[];
  onEditElement: (element: FormElement) => void;
  onRemoveElement: (elementId: string) => void;
  onMoveElementUp: (index: number) => void;
  onMoveElementDown: (index: number) => void;
}

export interface FormBuilderToolbarProps {
  toolbarItems: ToolbarItem[];
  onAddElement: (elementType: string) => void;
}

export interface EditDrawerProps {
  isOpen: boolean;
  editingElement: FormElement | null;
  onSave: (updatedElement: Partial<FormElement>) => void;
  onCancel: () => void;
}

export interface ElementPreviewProps {
  element: FormElement;
}
