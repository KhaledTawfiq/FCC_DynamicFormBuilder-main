import { useState, useCallback, useEffect } from 'react';
import { FormElement } from './types';
import { createNewElement } from './utils';

// Helper function to get proper label based on element type
const getProperLabelForElementType = (elementType: string): string => {
  const labelMap: Record<string, string> = {
    'DatePicker': 'Date Field',
    'TextInput': 'Text Field',
    'TextArea': 'Text Area',
    'NumberInput': 'Number',
    'Dropdown': 'Select',
    'RadioButtons': 'Radio Group',
    'Checkboxes': 'Checkbox Group',
    'Paragraph': 'Paragraph',
    'Button': 'Button',
    'address': 'Address Field',
    'AddressComponent': 'Address Field',
    'SearchLookupComponent': 'Search Field'
  };
  
  return labelMap[elementType] || 'Form Field';
};

export const useFormBuilder = (
  sectionId: string,
  sectionUniqueId: string,
  initialData: FormElement[],
  onDataChange: (data: FormElement[]) => void
) => {
  const [formElements, setFormElements] = useState<FormElement[]>(initialData);
  const [editingElement, setEditingElement] = useState<FormElement | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  // Add a new element to this section only - MERGED VERSION
  const addElement = useCallback((elementTypeOrItem: string | any) => {
    let elementType: string;
    let toolbarItem: any = {};

    // Handle both string elementType and ToolbarItem object
    if (typeof elementTypeOrItem === 'string') {
      // Called with just element type (backward compatibility)
      elementType = elementTypeOrItem;
    } else {
      // Called with ToolbarItem object (new approach)
      toolbarItem = elementTypeOrItem;
      elementType = toolbarItem.element || toolbarItem.key || 'TextInput';
    }

    // Generate base element with defaults
    const generated = createNewElement(elementType, sectionId);
    
    // Merge toolbar item fields with generated fields
    // Priority: toolbarItem > generated defaults
    const newElement = { 
      ...generated, 
      ...toolbarItem, 
      element: elementType 
    };
    
    // Ensure proper label is set (from both approaches)
    if (!newElement.label || newElement.label === 'Form Field' || newElement.label === 'Form Element') {
      newElement.label = getProperLabelForElementType(elementType);
    }
    
    // Set proper placeholder if missing (from first approach)
    if (!newElement.placeholder) {
      const placeholderMap: Record<string, string> = {
        'TextInput': 'Enter text here...',
        'NumberInput': 'Enter number here...',
        'TextArea': 'Enter your text here...',
        'DatePicker': 'Select date...',
        'Dropdown': 'Select an option...',
        'address': 'Enter address...',
        'AddressComponent': 'Enter address...',
        'SearchLookupComponent': 'Search...'
      };
      newElement.placeholder = placeholderMap[elementType] || '';
    }
    
    const updatedElements = [...formElements, newElement];
    setFormElements(updatedElements);
    onDataChange(updatedElements);
    
    console.log(`✅ Added ${elementType} to section ${sectionId}:`, newElement);
  }, [formElements, onDataChange, sectionId]);

  // Remove an element from this section only
  const removeElement = useCallback((elementId: string) => {
    const updatedElements = formElements.filter(el => el.id !== elementId);
    setFormElements(updatedElements);
    onDataChange(updatedElements);
    
    console.log(`🗑️ Removed element ${elementId} from section ${sectionId}`);
  }, [formElements, onDataChange, sectionId]);

  // Update an element in this section only
  const updateElement = useCallback((elementId: string, updates: Partial<FormElement>) => {
    const updatedElements = formElements.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    );
    setFormElements(updatedElements);
    onDataChange(updatedElements);
    
    console.log(`📝 Updated element ${elementId} in section ${sectionId}:`, updates);
  }, [formElements, onDataChange, sectionId]);

  // Open edit form for element
  const editElement = useCallback((element: FormElement) => {
    // Ensure element has proper label before editing
    if (!element.label || element.label === 'Form Field') {
      const properLabel = getProperLabelForElementType(element.element);
      element.label = properLabel;
      
      // Update the element with the proper label
      updateElement(element.id, { label: properLabel });
    }
    
    setEditingElement(element);
    setShowEditForm(true);
  }, [updateElement]);

  // Handle edit form save
  const handleEditFormSave = useCallback((updatedElement: Partial<FormElement>) => {
    if (editingElement) {
      updateElement(editingElement.id, updatedElement);
    }
  }, [editingElement, updateElement]);

  // Handle edit form cancel
  const handleEditFormCancel = useCallback(() => {
    setShowEditForm(false);
    setEditingElement(null);
  }, []);

  // Move element up
  const moveElementUp = useCallback((index: number) => {
    if (index > 0) {
      const newElements = [...formElements];
      [newElements[index - 1], newElements[index]] = [newElements[index], newElements[index - 1]];
      setFormElements(newElements);
      onDataChange(newElements);
    }
  }, [formElements, onDataChange]);

  // Move element down
  const moveElementDown = useCallback((index: number) => {
    if (index < formElements.length - 1) {
      const newElements = [...formElements];
      [newElements[index], newElements[index + 1]] = [newElements[index + 1], newElements[index]];
      setFormElements(newElements);
      onDataChange(newElements);
    }
  }, [formElements, onDataChange]);

  // Sync with external data changes and fix labels
  useEffect(() => {
    if (JSON.stringify(initialData) !== JSON.stringify(formElements)) {
      // Fix labels in the initial data
      const fixedInitialData = [...initialData].map(element => {
        if (!element.label || element.label === 'Form Field') {
          return {
            ...element,
            label: getProperLabelForElementType(element.element)
          };
        }
        return element;
      });
      
      setFormElements(fixedInitialData);
      console.log(`🔄 FormBuilder ${sectionUniqueId} synced with external data and fixed labels`);
    }
  }, [initialData, formElements, sectionUniqueId]);

  return {
    formElements,
    editingElement,
    showEditForm,
    addElement,
    removeElement,
    editElement,
    moveElementUp,
    moveElementDown,
    handleEditFormSave,
    handleEditFormCancel
  };
};