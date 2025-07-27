import React, { useState, useRef, useCallback } from 'react';
import { ReactFormBuilder, ElementStore } from 'react-form-builder2';
import type { SectionProps } from '../../types';
import { useElementDefaults } from '../../hooks/useElementDefaults';
import { processFormData, enhanceFormData } from '../../config/elementDefaults';
import FormElementsEdit from '../FormElementsEdit';

/**
 * Section Component - React Native Implementation
 * Represents a single form section using react-form-builder2
 */
const SectionReact: React.FC<SectionProps> = ({ 
  section, 
  index, 
  onRemove,
  onUpdate,
  onDragStart,
  onDragOver,
  onDrop,
  onReorder,
  draggedIndex,
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const collapseRef = useRef<HTMLDivElement>(null);
  const formBuilderRef = useRef<any>(null);
  
  // Initialize element defaults hook
  const { applyDefaults, enhanceForExport, makeNameFieldsReadOnly, observeFormBuilder } = useElementDefaults();
  
  // Local state for form fields to prevent clearing during updates
  const [localTitle, setLocalTitle] = useState<string>(section.title || '');
  const [localIcon, setLocalIcon] = useState<string>((section as any).icon || '');
  
  // Get existing form data or initialize empty
  const getFormData = useCallback(() => {
    const sectionWithElements = section as any;
    const elements = sectionWithElements.elements;
    
    console.log('Getting form data for section:', index, 'elements:', elements);
    
    // Ensure we always return an array
    if (Array.isArray(elements)) {
      return elements;
    }
    
    // If elements is not an array, try to parse it if it's a string
    if (typeof elements === 'string') {
      try {
        const parsed = JSON.parse(elements);
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.warn('Failed to parse elements string:', elements);
      }
    }
    
    return []; // Return empty array if elements is undefined, null, or not an array
  }, [section, index]);

  // Handle form data changes
  const handleFormDataChange = useCallback((data: any) => {
    console.log('Handling form data change:', data);
    
    // Ensure data is always an array
    let formData: any[] = [];
    
    if (Array.isArray(data)) {
      formData = data;
    } else if (data && Array.isArray(data.task_data)) {
      formData = data.task_data;
    } else if (data && typeof data === 'object') {
      // If it's an object but not an array, try to extract array data
      console.warn('Non-array data received:', data);
      formData = [];
    } else {
      console.warn('Invalid data format received:', data);
      formData = [];
    }
    
    // Apply defaults to new elements
    const processedData = applyDefaults(formData);
    console.log('Processed form data with defaults:', processedData);
    
    // Update section with new form data
    onUpdate(index, {
      ...section,
      elements: processedData
    } as any);
  }, [index, section, onUpdate, applyDefaults]);

  // Debounced input change handler
  const inputChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleInputChange = (field: string, value: string) => {
    // Update local state immediately for responsive UI
    if (field === 'title') {
      setLocalTitle(value);
    } else if (field === 'icon') {
      setLocalIcon(value);
    }
    
    // Clear previous timeout to debounce rapid typing
    if (inputChangeTimeoutRef.current) {
      clearTimeout(inputChangeTimeoutRef.current);
    }
    
    // Debounce the actual state update
    inputChangeTimeoutRef.current = setTimeout(() => {
      onUpdate(index, {
        ...section,
        [field]: value
      } as any);
    }, 500);
  };

  const handleRemove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onRemove(index);
  };

  const handleAccordionToggle = () => {
    const collapseElement = collapseRef.current;
    if (!collapseElement) return;

    if (isExpanded) {
      // Collapsing
      collapseElement.style.overflow = 'hidden';
      collapseElement.style.height = collapseElement.scrollHeight + 'px';
      collapseElement.style.transition = 'none';
      
      collapseElement.offsetHeight; // Force reflow
      
      collapseElement.style.transition = 'height 0.3s ease-in-out';
      collapseElement.style.height = '0px';
      
      setTimeout(() => {
        setIsExpanded(false);
      }, 50);
    } else {
      // Expanding
      collapseElement.style.overflow = 'hidden';
      setIsExpanded(true);
      collapseElement.style.height = '0px';
      collapseElement.style.transition = 'height 0.3s ease-in-out';
      
      collapseElement.offsetHeight; // Force reflow
      
      collapseElement.style.height = collapseElement.scrollHeight + 'px';
      
      setTimeout(() => {
        if (collapseElement.style.height !== '0px') {
          collapseElement.style.height = 'auto';
          collapseElement.style.overflow = 'visible';
        }
      }, 300);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent) => {
    if (onDragStart) {
      onDragStart(index);
    }
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (onDragOver) {
      onDragOver(index);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const draggedFromIndex = parseInt(e.dataTransfer.getData('text/plain'));
    
    if (onDrop) {
      onDrop(index);
    }
    
    if (onReorder && draggedFromIndex !== index) {
      onReorder(draggedFromIndex, index);
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (inputChangeTimeoutRef.current) {
        clearTimeout(inputChangeTimeoutRef.current);
      }
    };
  }, []);

  // Update local state when section changes (but not during our own updates)
  React.useEffect(() => {
    setLocalTitle(section.title || '');
    setLocalIcon((section as any).icon || '');
  }, [section.id]);

  // Load existing data into form builder after mount and set up DOM observation
  React.useEffect(() => {
    if (formBuilderRef.current && isExpanded) {
      const elements = getFormData();
      console.log('Loading elements into form builder:', elements);
      
      if (elements && Array.isArray(elements) && elements.length > 0) {
        try {
          // Use the form builder's setData method if available
          if (typeof formBuilderRef.current.setData === 'function') {
            formBuilderRef.current.setData(elements);
          }
          // Alternative: try to access the store directly
          else if (formBuilderRef.current.store && typeof formBuilderRef.current.store.setData === 'function') {
            formBuilderRef.current.store.setData(elements);
          }
        } catch (error) {
          console.warn('Error loading data into form builder:', error);
        }
      }
      
      // Set up DOM observation for read-only name fields
      const observer = observeFormBuilder('.build-wrap');
      makeNameFieldsReadOnly(); // Initial application
      
      return () => {
        if (observer) {
          observer.disconnect();
        }
      };
    }
  }, [isExpanded, section.id, getFormData, observeFormBuilder, makeNameFieldsReadOnly]);

  // Expose methods to parent component (for API compatibility)
  React.useEffect(() => {
    const sectionWithRef = section as any;
    if (sectionWithRef.ref) {
      sectionWithRef.ref.current = {
        getFormData,
        setFormData: (data: any[]) => handleFormDataChange(data),
        getEnhancedFormData: () => enhanceForExport(getFormData()),
        exportFormData: () => {
          const data = getFormData();
          return enhanceForExport(data);
        }
      };
    }
  });

  return (
    <div 
      className={`accordion-item ${className} ${
        draggedIndex === index ? 'dragging' : ''
      }`} 
      draggable="true" 
      data-index={index}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h2 className="accordion-header" id={`heading${index}`}>
        <button 
          className={`accordion-button ${isExpanded ? '' : 'collapsed'}`}
          type="button" 
          onClick={handleAccordionToggle}
          aria-expanded={isExpanded}
          aria-controls={`collapse${index}`}
        >
          Section #{index + 1}
        </button>
      </h2>
      
      <div 
        ref={collapseRef}
        id={`collapse${index}`} 
        className={`accordion-collapse collapse ${isExpanded ? 'show' : ''}`}
        aria-labelledby={`heading${index}`}
        style={{
          height: isExpanded ? 'auto' : '0px',
          transition: 'height 0.3s ease-in-out'
        }}
      >
        <div className="accordion-body">
          <div className="section-info">
            <div className="col-12">
              <div className="row">
                <div className="col-6">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input 
                      type="text" 
                      className="form-control title"
                      value={localTitle}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter section title"
                    />
                  </div>
                </div>
                
                <div className="col-6">
                  <div className="mb-3">
                    <label className="form-label">Icon</label>
                    <input 
                      type="text" 
                      className="form-control icon"
                      value={localIcon}
                      onChange={(e) => handleInputChange('icon', e.target.value)}
                      placeholder="Enter icon name"
                    />
                  </div>
                </div>
                
                <div className="col-12">
                  <div className="removeBtnHolder">
                    <a href="#" className="remove-btn" onClick={handleRemove}>
                      <img src="/src/assets/binIcon.svg" alt="Remove" />
                      <span>Remove Section</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="build-wrap">
            <ReactFormBuilder
              ref={formBuilderRef}
              saveUrl=""
              onPost={(data) => {
                console.log('Saving form data:', data);
                if (data && Array.isArray(data.task_data)) {
                  handleFormDataChange(data.task_data);
                } else if (Array.isArray(data)) {
                  handleFormDataChange(data);
                } else {
                  console.warn('Unexpected data structure:', data);
                  handleFormDataChange([]);
                }
              }}
              saveAlways={true}
              editMode={true}
              locale="en"
              renderEditForm={(props) => {
                console.log('Edit form props:', props);
                return (
                  <FormElementsEdit
                    {...props}
                    element={props.element || props}
                  />
                );
              }}
              toolbarItems={[
                {
                  key: 'Header',
                  name: 'Header',
                  static: true,
                  icon: 'fas fa-heading',
                  content: 'Header Text'
                },
                {
                  key: 'Paragraph', 
                  name: 'Paragraph',
                  static: true,
                  icon: 'fas fa-paragraph',
                  content: 'Paragraph Text'
                },
                {
                  key: 'TextInput',
                  name: 'Text Field',
                  static: false,
                  icon: 'fas fa-font',
                  content: ''
                },
                {
                  key: 'TextArea',
                  name: 'Text Area', 
                  static: false,
                  icon: 'fas fa-align-left',
                  content: ''
                },
                {
                  key: 'NumberInput',
                  name: 'Number',
                  static: false,
                  icon: 'fas fa-hashtag',
                  content: ''
                },
                {
                  key: 'Dropdown',
                  name: 'Select',
                  static: false,
                  icon: 'fas fa-caret-down',
                  content: ''
                },
                {
                  key: 'RadioButtons',
                  name: 'Radio Group',
                  static: false,
                  icon: 'far fa-dot-circle',
                  content: ''
                },
                {
                  key: 'Checkboxes',
                  name: 'Checkbox Group',
                  static: false,
                  icon: 'far fa-check-square',
                  content: ''
                },
                {
                  key: 'Tags',
                  name: 'Autocomplete',
                  static: false,
                  icon: 'fas fa-tags',
                  content: ''
                },
                {
                  key: 'Address',
                  name: 'Address Field',
                  static: false,
                  icon: 'fas fa-map-marker-alt',
                  content: ''
                },
                {
                  key: 'Button',
                  name: 'Button',
                  static: true,
                  icon: 'far fa-square',
                  content: 'Button'
                },
                {
                  key: 'FileUpload',
                  name: 'File Upload',
                  static: false,
                  icon: 'fas fa-file-upload',
                  content: ''
                },
                {
                  key: 'DatePicker',
                  name: 'Date Field',
                  static: false,
                  icon: 'fas fa-calendar-alt',
                  content: ''
                }
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionReact;