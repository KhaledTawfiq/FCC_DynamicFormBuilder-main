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
      // Clear any existing content first
      const $buildWrap = $(buildWrapElement);
      $buildWrap.empty();
        // Check if formBuilder is already initialized
      if ($buildWrap.data('formBuilder')) {
        ($buildWrap as any).formBuilder('destroy');
        $buildWrap.empty();
      }
      
      // Initialize FormBuilder for this section
      
      // Check if section has existing elements data to load
      const sectionWithElements = section as any;
      const existingElements = sectionWithElements.elements;
      
      const initOptions = { ...formBuilderOptions };
      if (existingElements && existingElements.length > 0) {
        initOptions.formData = JSON.stringify(existingElements);
      }
      
      formBuilderInstance.current = ($buildWrap as any).formBuilder(initOptions);
      isInitialized.current = true;
      
      // Set up debounced event listeners to save data when fields are added/modified
      let updateTimeout: NodeJS.Timeout;
      $buildWrap.on('fieldAdded fieldRemoved sortupdate fieldUpdated', () => {
        // Clear previous timeout to debounce rapid updates
        if (updateTimeout) {
          clearTimeout(updateTimeout);
        }
        
        updateTimeout = setTimeout(() => {
          try {
            saveFormData(); // Use a separate function for saving to avoid conflicts
          } catch (error) {
            // Ignore errors during auto-save
          }
        }, 300); // Longer delay to ensure FormBuilder has fully updated
      });
      
    } catch (error) {
      // Error initializing FormBuilder - fail silently
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
  // Only reload when section ID changes (indicating a different section) or when we explicitly need to reload
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
  }, [section.id]); // Only react to section ID changes, not elements changes

  // Add local state for form fields to prevent clearing during updates
  const [localTitle, setLocalTitle] = useState<string>(section.title || '');
  const [localIcon, setLocalIcon] = useState<string>((section as any).icon || '');

  // Update local state when section prop changes (but not during our own updates)
  useEffect(() => {
    setLocalTitle(section.title || '');
    setLocalIcon((section as any).icon || '');
  }, [section.id]); // Only update when section ID changes (new section)

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
    }, 500); // Increased delay to 500ms to reduce update frequency
  };
  const handleRemove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onRemove(index);
  };  const handleAccordionToggle = () => {
    const collapseElement = collapseRef.current;
    if (!collapseElement) return;

    if (isExpanded) {
      // Collapsing: Temporarily set overflow hidden for animation
      collapseElement.style.overflow = 'hidden';
      collapseElement.style.height = collapseElement.scrollHeight + 'px';
      collapseElement.style.transition = 'none'; // Disable transition temporarily
      
      // Force reflow
      collapseElement.offsetHeight;
      
      // Re-enable transition and collapse
      collapseElement.style.transition = 'height 0.3s ease-in-out';
      collapseElement.style.height = '0px';
      
      // Update state after animation starts
      setTimeout(() => {
        setIsExpanded(false);
      }, 50);
    } else {
      // Expanding: Start with overflow hidden for animation
      collapseElement.style.overflow = 'hidden';
      setIsExpanded(true);
      collapseElement.style.height = '0px';
      collapseElement.style.transition = 'height 0.3s ease-in-out';
      
      // Force reflow
      collapseElement.offsetHeight;
      
      // Expand to full height
      collapseElement.style.height = collapseElement.scrollHeight + 'px';
      
      // After animation completes, set overflow to visible for sticky positioning
      setTimeout(() => {
        if (collapseElement.style.height !== '0px') {
          collapseElement.style.height = 'auto';
          collapseElement.style.overflow = 'visible'; // Enable sticky positioning
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
        collapseElement.style.overflow = 'visible'; // Allow sticky positioning when expanded
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
    
    // Call onDragOver to update draggedIndex to the current hover position
    if (onDragOver) {
      onDragOver(index);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const draggedFromIndex = parseInt(e.dataTransfer.getData('text/plain'));
    
    // Call onDrop to reset draggedIndex to null
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
          
          // Only update if data has actually changed to prevent infinite loops
          const sectionWithElements = section as any;
          const currentElements = sectionWithElements.elements || [];
          
          // Deep comparison to check if data actually changed
          const hasChanged = JSON.stringify(data) !== JSON.stringify(currentElements);
          
          if (hasChanged) {
            // Use a more gentle update that doesn't cause re-initialization
            setTimeout(() => {
              onUpdate(index, {
                ...section,
                elements: data
              } as any);
            }, 100); // Small delay to prevent blocking
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
    >      <h2 className="accordion-header" id={`heading${index}`}>
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
