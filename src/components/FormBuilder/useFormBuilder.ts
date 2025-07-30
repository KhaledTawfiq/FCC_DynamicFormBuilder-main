import { useState, useCallback, useEffect } from 'react';
import { FormElement } from './types';
import { createNewElement } from './utils';

export const useFormBuilder = (
  sectionId: string,
  sectionUniqueId: string,
  initialData: FormElement[],
  onDataChange: (data: FormElement[]) => void
) => {
  const [formElements, setFormElements] = useState<FormElement[]>(initialData);
  const [editingElement, setEditingElement] = useState<FormElement | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  // Add a new element to this section only
  const addElement = useCallback((elementType: string) => {
    const newElement = createNewElement(elementType, sectionId);
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
    setEditingElement(element);
    setShowEditForm(true);
  }, []);

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

  // Sync with external data changes
  useEffect(() => {
    if (JSON.stringify(initialData) !== JSON.stringify(formElements)) {
      setFormElements([...initialData]);
      console.log(`🔄 FormBuilder ${sectionUniqueId} synced with external data`);
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
