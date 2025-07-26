import { useCallback } from 'react';
import { processFormData, enhanceFormData } from '../config/elementDefaults';

/**
 * Custom hook for managing element defaults in form builder
 */
export const useElementDefaults = () => {
  
  /**
   * Process form data to apply defaults to new elements
   */
  const applyDefaults = useCallback((data: any[]): any[] => {
    return processFormData(data);
  }, []);

  /**
   * Enhance form data for export/save operations
   */
  const enhanceForExport = useCallback((data: any[]): any[] => {
    return enhanceFormData(data);
  }, []);

  /**
   * Make name fields read-only in the form builder
   */
  const makeNameFieldsReadOnly = useCallback(() => {
    // Add a small delay to ensure the form builder has rendered
    setTimeout(() => {
      const nameInputs = document.querySelectorAll(
        '.frmb input[name="name"], ' +
        '.form-group input[placeholder*="name"], ' +
        '.form-group input[data-property="name"], ' +
        'input[name="name"], ' +
        '.form-builder input[name="name"], ' +
        '.edit-form input[name="name"]'
      );
      
      nameInputs.forEach((input: any) => {
        if (input && input.type === 'text') {
          // Apply read-only styles
          input.style.backgroundColor = '#f8f9fa';
          input.style.border = '1px solid #dee2e6';
          input.style.color = '#6c757d';
          input.style.cursor = 'not-allowed';
          input.readOnly = true;
          input.title = 'This field is auto-generated and cannot be edited';
          
          // Add event listeners to prevent changes
          const preventChange = (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
          };
          
          input.addEventListener('keydown', preventChange);
          input.addEventListener('paste', preventChange);
          input.addEventListener('input', preventChange);
          input.addEventListener('change', preventChange);
          
          // Add a visual indicator
          if (!input.nextElementSibling?.classList?.contains('readonly-indicator')) {
            const indicator = document.createElement('small');
            indicator.className = 'readonly-indicator text-muted';
            indicator.style.display = 'block';
            indicator.style.marginTop = '2px';
            indicator.textContent = '⚠️ Auto-generated field (read-only)';
            input.parentNode?.insertBefore(indicator, input.nextSibling);
          }
        }
      });
    }, 500);
  }, []);

  /**
   * Monitor DOM changes and apply read-only styles to new name fields
   */
  const observeFormBuilder = useCallback((containerSelector: string = '.build-wrap') => {
    const container = document.querySelector(containerSelector);
    if (!container) return null;

    const observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // Check if new form elements were added
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.querySelector('input[name="name"]') || 
                  element.classList.contains('form-element') ||
                  element.classList.contains('edit-form')) {
                shouldUpdate = true;
              }
            }
          });
        }
      });
      
      if (shouldUpdate) {
        makeNameFieldsReadOnly();
      }
    });

    observer.observe(container, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });

    return observer;
  }, [makeNameFieldsReadOnly]);

  return {
    applyDefaults,
    enhanceForExport,
    makeNameFieldsReadOnly,
    observeFormBuilder
  };
};
