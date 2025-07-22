// Updated Section.tsx with group registration on FormBuilder initialization

import React, { useEffect, useRef, useState } from 'react';
import $ from 'jquery';
import type { SectionProps } from '../../types';

/**
 * Section Component
 * Represents a single form section with its own FormBuilder instance
 */
const Section: React.FC<SectionProps> = ({ 
  section, 
  index, 
  formBuilderOptions,
  onRemove,
  onUpdate,
  onDragStart,
  onDragOver,
  onDrop,
  onReorder,
  draggedIndex,
  className = ""
}) => {
  const buildWrapRef = useRef<HTMLDivElement>(null);
  const formBuilderInstance = useRef<any>(null);
  const isInitialized = useRef<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const collapseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const buildWrapElement = buildWrapRef.current;
    
    // Prevent double initialization and unnecessary re-initialization
    if (!buildWrapElement || !formBuilderOptions) {
      return;
    }
    
    // Only initialize if not already initialized
    if (isInitialized.current) {
      return;
    }
    
    try {
      console.log(`🚀 Initializing FormBuilder for section ${index}...`);
      
      // Clear any existing content first
      const $buildWrap = $(buildWrapElement);
      $buildWrap.empty();
        // Check if formBuilder is already initialized
      if ($buildWrap.data('formBuilder')) {
        ($buildWrap as any).formBuilder('destroy');
        $buildWrap.empty();
      }
      
      // Check if section has existing elements data to load
      const sectionWithElements = section as any;
      const existingElements = sectionWithElements.elements;
      
      const initOptions = { ...formBuilderOptions };
      if (existingElements && existingElements.length > 0) {
        initOptions.formData = JSON.stringify(existingElements);
      }
      
      // Initialize FormBuilder for this section
      formBuilderInstance.current = ($buildWrap as any).formBuilder(initOptions);
      isInitialized.current = true;
      
      console.log(`✅ FormBuilder initialized for section ${index}`);
      
      // REGISTER GROUP ATTRIBUTE AFTER FORMBUILDER IS READY
      setTimeout(async () => {
        try {
          console.log(`🔧 Registering group attribute for section ${index}...`);
          const { registerGroupAttribute } = await import('../../hooks/controls/groupAttribute');
          registerGroupAttribute();
          console.log(`✅ Group attribute registered for section ${index}`);
        } catch (error) {
          console.error(`❌ Failed to register group attribute for section ${index}:`, error);
        }
      }, 500); // Small delay to ensure FormBuilder is fully ready
      
      // Set up debounced event listeners to save data when fields are added/modified
      let updateTimeout: NodeJS.Timeout;
      $buildWrap.on('fieldAdded fieldRemoved sortupdate fieldUpdated', () => {
        // Clear previous timeout to debounce rapid updates
        if (updateTimeout) {
          clearTimeout(updateTimeout);
        }
        
        updateTimeout = setTimeout(() => {
          try {
            saveFormData();
            
            // Re-register group attribute when new fields are added
            setTimeout(async () => {
              try {
                console.log(`🔄 Re-registering group attribute after field change in section ${index}...`);
                const { registerGroupAttribute } = await import('../../hooks/controls/groupAttribute');
                registerGroupAttribute();
              } catch (error) {
                console.error(`❌ Failed to re-register group attribute:`, error);
              }
            }, 300);
            
          } catch (error) {
            // Ignore errors during auto-save
          }
        }, 300);
      });
      
    } catch (error) {
      console.error(`❌ Error initializing FormBuilder for section ${index}:`, error);
    }

    return () => {
      // Cleanup FormBuilder instance and timeouts
      if (inputChangeTimeoutRef.current) {
        clearTimeout(inputChangeTimeoutRef.current);
      }
      
      if (isInitialized.current && buildWrapElement) {        
        try {
          // Remove event listeners
          $(buildWrapElement).off('fieldAdded fieldRemoved sortupdate fieldUpdated');
          
          ($(buildWrapElement) as any).formBuilder('destroy');
          $(buildWrapElement).empty();
          isInitialized.current = false;
          formBuilderInstance.current = null;
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    };
  }, []); // Empty dependency array - only run once on mount 

  // Load existing form data when FormBuilder is initialized and section has elements
  const prevSectionIdRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (isInitialized.current && section && (section as any).elements) {
      const currentSectionId = section.id;
      const existingElements = (section as any).elements;
      
      // Only reload if this is a different section or if we don't have any current data
      if (prevSectionIdRef.current !== currentSectionId || 
          (existingElements && existingElements.length > 0 && !formBuilderInstance.current?.getData()?.length)) {
        
        prevSectionIdRef.current = currentSectionId;
        
        // Add a small delay to ensure FormBuilder is fully ready
        setTimeout(() => {
          setFormData(existingElements);
        }, 100);
      }
    }
  }, [section.id]);

  // Add local state for form fields to prevent clearing during updates
  const [localTitle, setLocalTitle] = useState<string>(section.title || '');
  const [localIcon, setLocalIcon] = useState<string>((section as any).icon || '');

  // Update local state when section prop changes (but not during our own updates)
  useEffect(() => {
    setLocalTitle(section.title || '');
    setLocalIcon((section as any).icon || '');
  }, [section.id]);

  // Add debouncing for input changes
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
    
    // Debounce the actual state update to prevent excessive re-renders
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
      
      collapseElement.offsetHeight;
      
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
      
      collapseElement.offsetHeight;
      
      collapseElement.style.height = collapseElement.scrollHeight + 'px';
      
      setTimeout(() => {
        if (collapseElement.style.height !== '0px') {
          collapseElement.style.height = 'auto';
          collapseElement.style.overflow = 'visible';
        }
      }, 300);
    }
  };

  const getFormData = (): any[] => {
    if (formBuilderInstance.current && isInitialized.current) {
      try {
        const $buildWrap = $(buildWrapRef.current!);
        const formBuilderData = $buildWrap.data('formBuilder');
        if (formBuilderData && formBuilderData.actions) {
          const data = formBuilderData.actions.getData();
          return data;
        }
      } catch (error) {
        // Error getting form data - return empty array
      }
    }
    // Return existing elements if FormBuilder isn't available
    return (section as any).elements || [];
  };

  const setFormData = (data: any[]): void => {
    if (formBuilderInstance.current && isInitialized.current && data) {
      try {
        const $buildWrap = $(buildWrapRef.current!);
        const formBuilderData = $buildWrap.data('formBuilder');
        if (formBuilderData && formBuilderData.actions) {
          const formDataString = JSON.stringify(data);
          formBuilderData.actions.setData(formDataString);
          
          // Verify data was set correctly
          setTimeout(() => {
            const verifyData = formBuilderData.actions.getData();
          }, 50);
        }
      } catch (error) {
        // Error setting form data - fail silently
      }
    }
  };

  // Expose methods to parent component
  useEffect(() => {
    const sectionWithRef = section as any;
    if (sectionWithRef.ref && sectionWithRef.ref.current !== getFormData) {
      sectionWithRef.ref.current = {
        getFormData,
        setFormData
      };
    }
  });

  // Handle initial accordion state and transitions
  useEffect(() => {
    const collapseElement = collapseRef.current;
    if (collapseElement) {
      if (!isExpanded) {
        collapseElement.style.height = '0px';
        collapseElement.style.overflow = 'hidden';
      } else {
        collapseElement.style.height = 'auto';
        collapseElement.style.overflow = 'visible';
      }
    }
  }, []);

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

  // Separate function to save form data without triggering getFormData
  const saveFormData = (): void => {
    if (formBuilderInstance.current && isInitialized.current) {
      try {
        const $buildWrap = $(buildWrapRef.current!);
        const formBuilderData = $buildWrap.data('formBuilder');
        if (formBuilderData && formBuilderData.actions) {
          const data = formBuilderData.actions.getData();
          
          // Only update if data has actually changed
          const sectionWithElements = section as any;
          const currentElements = sectionWithElements.elements || [];
          
          const hasChanged = JSON.stringify(data) !== JSON.stringify(currentElements);
          
          if (hasChanged) {
            setTimeout(() => {
              onUpdate(index, {
                ...section,
                elements: data
              } as any);
            }, 100);
          }
        }
      } catch (error) {
        // Error saving form data - fail silently
      }
    }
  };

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
          
          <div 
            ref={buildWrapRef}
            id={`build-wrap-${index}`} 
            className="build-wrap"
          />
        </div>
      </div>
    </div>
  );
};

export default Section;