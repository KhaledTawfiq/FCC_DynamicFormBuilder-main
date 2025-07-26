import { useCallback, useRef } from 'react';
import { generateUniqueId } from '../../utils/helpers';
import type { SectionWithRef } from '../types/formBuilderTypes';

/**
 * Custom hook for section management - React Native Implementation
 */
export const useSectionManagementReact = (
  sections: SectionWithRef[],
  setSections: React.Dispatch<React.SetStateAction<SectionWithRef[]>>
) => {
  const isAddingSection = useRef<boolean>(false);

  // Add a new section
  const addSection = useCallback((): void => {
    if (isAddingSection.current) return;
    isAddingSection.current = true;

    const newSection: SectionWithRef = {
      id: generateUniqueId(),
      title: '',
      fields: [],
      icon: '',
      elements: [],
      ref: { current: null }
    };

    setSections(prev => [...prev, newSection]);
    setTimeout(() => {
      isAddingSection.current = false;
    }, 100);
  }, [setSections]);

  // Remove a section
  const removeSection = useCallback((index: number): void => {
    setSections(prev => prev.filter((_, i) => i !== index));
  }, [setSections]);

  // Update a section
  const updateSection = useCallback((index: number, updatedSection: SectionWithRef): void => {
    setSections(prev => 
      prev.map((section, i) => 
        i === index ? { ...section, ...updatedSection } : section
      )
    );
  }, [setSections]);

  // Reorder sections
  const reorderSections = useCallback((fromIndex: number, toIndex: number): void => {
    setSections(prev => {
      const newSections = [...prev];
      const [removed] = newSections.splice(fromIndex, 1);
      newSections.splice(toIndex, 0, removed);
      return newSections;
    });
  }, [setSections]);

  return {
    addSection,
    removeSection,
    updateSection,
    reorderSections
  };
};
