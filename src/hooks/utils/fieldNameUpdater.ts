import $ from 'jquery';
import { toPascalCase } from '../../utils/helpers';

/**
 * Utility functions to handle field name updates in real-time
 */

/**
 * Updates field names when labels change
 */
export const updateFieldNamesFromLabels = (container: JQuery): void => {
  container.find('.fld-label').each((index: number, element: HTMLElement) => {
    const $element = $(element);
    const labelText = $element.text() || $element.val() as string;
    
    if (labelText) {
      const generatedName = toPascalCase(labelText);
      const $nameField = $element.closest('.form-elements').find('.fld-name');
      
      // Only update if the name field exists and is empty or has a default value
      if ($nameField.length > 0) {
        const currentName = $nameField.val() as string;
        if (!currentName || currentName.startsWith('field-')) {
          $nameField.val(generatedName);
          // Trigger change event to ensure FormBuilder recognizes the update
          $nameField.trigger('change');
        }
      }
    }
  });
};

/**
 * Sets up event listeners for real-time field name updates
 */
export const setupFieldNameUpdateListeners = (formBuilderElement: JQuery): void => {
  // Listen for label changes
  formBuilderElement.on('input change', '.fld-label', function(this: HTMLElement) {
    const $this = $(this);
    const labelText = $this.val() as string || $this.text();
    
    if (labelText) {
      const generatedName = toPascalCase(labelText);
      const $nameField = $this.closest('.form-elements').find('.fld-name');
      
      if ($nameField.length > 0) {
        const currentName = $nameField.val() as string;
        // Update name if it's empty or still has default value
        if (!currentName || currentName.startsWith('field-')) {
          $nameField.val(generatedName);
          $nameField.trigger('change');
        }
      }
    }
  });

  // Listen for field additions
  formBuilderElement.on('fieldAdded', function(this: HTMLElement) {
    updateFieldNamesFromLabels($(this));
  });

  // Listen for general form updates
  formBuilderElement.on('formUpdated', function(this: HTMLElement) {
    updateFieldNamesFromLabels($(this));
  });

  // Listen for when fields are moved or reordered
  formBuilderElement.on('fieldRemoved fieldMoved', function(this: HTMLElement) {
    // Small delay to ensure DOM is updated
    setTimeout(() => {
      updateFieldNamesFromLabels($(this));
    }, 100);
  });
};

/**
 * Ensures all fields in a section have proper names
 */
export const ensureFieldNames = (sectionRef: any): void => {
  if (sectionRef?.current?.$container) {
    updateFieldNamesFromLabels(sectionRef.current.$container);
  }
};
