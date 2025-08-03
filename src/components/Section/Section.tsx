import React, { useState, useRef, useCallback, useMemo } from "react";
import type { SectionProps } from "../../types";
import { useElementDefaults } from "../../hooks/useElementDefaults";
import FormBuilder from "../FormBuilder/FormBuilder";
import { SearchLookupComponent } from "../controls/SearchLookupComponent";
import { AddressComponent } from "../controls/AddressComponent";

/**
 * Section Component for Dynamic Form Builder
 * Manages individual form sections with custom form elements
 * Fixed TypeScript types for compatibility
 */
const Section: React.FC<SectionProps> = React.memo(({
  section,
  index,
  onRemove,
  onUpdate,
  onDragStart,
  onDragOver,
  onDrop,
  onReorder,
  draggedIndex,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const collapseRef = useRef<HTMLDivElement>(null);
  
  // Create unique identifiers for this section to prevent conflicts
  const sectionUniqueId = useMemo(() => `section-${section.id}-${index}`, [section.id, index]);
  const buildWrapId = useMemo(() => `build-wrap-${sectionUniqueId}`, [sectionUniqueId]);
  
  // Initialize element defaults hook with section-specific context
  const {
    applyDefaults,
    enhanceForExport,
    makeNameFieldsReadOnly,
    observeFormBuilder,
  } = useElementDefaults();

  // Local state for form fields to prevent clearing during updates
  const [localTitle, setLocalTitle] = useState<string>(section.title || "");
  const [localIcon, setLocalIcon] = useState<string>(
    (section as any).icon || ""
  );
  
  // Section-specific form data state to ensure isolation
  const [sectionFormData, setSectionFormData] = useState<any[]>(() => {
    const sectionWithElements = section as any;
    const elements = sectionWithElements.elements;
    
    console.log(`Initializing section ${section.id} with elements:`, elements);
    
    if (Array.isArray(elements)) {
      return [...elements]; // Create a copy to prevent reference sharing
    }
    
    if (typeof elements === "string") {
      try {
        const parsed = JSON.parse(elements);
        return Array.isArray(parsed) ? [...parsed] : [];
      } catch (error) {
        console.warn("Failed to parse elements string:", elements);
      }
    }
    
    console.log(`Section ${section.id} initialized with empty elements array`);
    return [];
  });

  // Get existing form data or initialize empty - now uses local state
  const getFormData = useCallback(() => {
    console.log(`Getting form data for section ${sectionUniqueId}:`, sectionFormData);
    return [...sectionFormData]; // Always return a copy to prevent reference sharing
  }, [sectionFormData, sectionUniqueId]);

  // Handle form data changes - updates both local state and parent
  const handleFormDataChange = useCallback(
    (data: any) => {
      console.log(`Handling form data change for section ${sectionUniqueId}:`, data);

      // Ensure data is always an array
      let formData: any[] = [];

      if (Array.isArray(data)) {
        formData = [...data]; // Create a copy
      } else if (data && Array.isArray(data.task_data)) {
        formData = [...data.task_data]; // Create a copy
      } else if (data && typeof data === "object") {
        // If it's an object but not an array, try to extract array data
        console.warn("Non-array data received:", data);
        formData = [];
      } else {
        console.warn("Invalid data format received:", data);
        formData = [];
      }

      // Add unique identifiers to each element to prevent cross-section contamination
      const processedData = applyDefaults(formData).map((element: any) => ({
        ...element,
        sectionId: section.id, // Add section identifier
        elementId: element.id || `${section.id}-${Date.now()}-${Math.random()}` // Ensure unique ID
      }));
      
      console.log(`Processed form data with defaults for section ${sectionUniqueId}:`, processedData);

      // Update local state first
      setSectionFormData([...processedData]);

      // Update section with new form data
      onUpdate(index, {
        ...section,
        elements: [...processedData], // Ensure we pass a copy
      } as any);
    },
    [index, section, onUpdate, applyDefaults, sectionUniqueId]
  );

  // Debounced input change handler
  const inputChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (field: string, value: string) => {
    // Update local state immediately for responsive UI
    if (field === "title") {
      setLocalTitle(value);
    } else if (field === "icon") {
      setLocalIcon(value);
    }

    // Clear previous timeout to debounce rapid typing
    if (inputChangeTimeoutRef.current) {
      clearTimeout(inputChangeTimeoutRef.current);
    }

    // Debounce the actual state update
    inputChangeTimeoutRef.current = setTimeout(() => {
      const sectionWithElements = section as any;
      onUpdate(index, {
        ...section,
        [field]: value,
        // Preserve existing elements when updating title/icon
        elements: Array.isArray(sectionWithElements.elements) 
          ? [...sectionWithElements.elements] 
          : [...sectionFormData],
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
      collapseElement.style.overflow = "hidden";
      collapseElement.style.height = collapseElement.scrollHeight + "px";
      collapseElement.style.transition = "none";

      collapseElement.offsetHeight; // Force reflow

      collapseElement.style.transition = "height 0.3s ease-in-out";
      collapseElement.style.height = "0px";

      setTimeout(() => {
        setIsExpanded(false);
      }, 50);
    } else {
      // Expanding
      collapseElement.style.overflow = "hidden";
      setIsExpanded(true);
      collapseElement.style.height = "0px";
      collapseElement.style.transition = "height 0.3s ease-in-out";

      collapseElement.offsetHeight; // Force reflow

      collapseElement.style.height = collapseElement.scrollHeight + "px";

      setTimeout(() => {
        if (collapseElement.style.height !== "0px") {
          collapseElement.style.height = "auto";
          collapseElement.style.overflow = "visible";
        }
      }, 300);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent) => {
    if (onDragStart) {
      onDragStart(index);
    }
    e.dataTransfer.setData("text/plain", index.toString());
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    if (onDragOver) {
      onDragOver(index);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const draggedFromIndex = parseInt(e.dataTransfer.getData("text/plain"));

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
  const sectionElementsRef = useRef<any[]>(sectionFormData);
  
  React.useEffect(() => {
    setLocalTitle(section.title || "");
    setLocalIcon((section as any).icon || "");
  }, [section.id, section.title, (section as any).icon]);

  // Separate effect for elements to prevent unnecessary updates
  React.useEffect(() => {
    const sectionWithElements = section as any;
    const elements = sectionWithElements.elements;
    
    if (Array.isArray(elements)) {
      // Only update if the elements reference has actually changed
      if (elements !== sectionElementsRef.current) {
        console.log(`Section ${sectionUniqueId} - Elements reference changed, updating local state`);
        
        // Filter elements to only include those belonging to this section
        const filteredElements = elements.filter((element: any) => 
          !element.sectionId || element.sectionId === section.id
        );
        
        setSectionFormData([...filteredElements]); // Create a copy
        sectionElementsRef.current = elements;
        
        // Force form builder reset if elements changed significantly
        if (filteredElements.length !== sectionFormData.length) {
          console.log(`Section ${sectionUniqueId} - Element count changed, data will be refreshed`);
        }
      }
    }
  }, [(section as any).elements]);

  // DOM observation setup for read-only name fields
  React.useEffect(() => {
    if (isExpanded) {
      // Set up DOM observation for read-only name fields - section specific
      const observer = observeFormBuilder(`#${buildWrapId}`);
      makeNameFieldsReadOnly(); // Initial application

      return () => {
        if (observer) {
          observer.disconnect();
        }
      };
    }
  }, [
    isExpanded,
    observeFormBuilder,
    makeNameFieldsReadOnly,
    buildWrapId,
  ]);

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
        },
      };
    }
  }, [getFormData, handleFormDataChange, enhanceForExport]);

  // Updated toolbar items to include Address and Search Lookup
  const ToolbarItems: any[] = [
    {
      key: "DatePicker",
      name: "Date Field",
      static: false,
      icon: "fas fa-calendar-alt",
      element: "DatePicker",
      label: "Date Field"
    },
    {
      key: "TextInput",
      name: "Text Field",
      static: false,
      icon: "fas fa-font",
      element: "TextInput",
      label: "Text Field"
    },
    {
      key: "Dropdown",
      name: "Select",
      static: false,
      icon: "fas fa-caret-down",
      element: "Dropdown",
      label: "Select"
    },
    {
      key: "RadioButtons",
      name: "Radio Group",
      static: false,
      icon: "far fa-dot-circle",
      element: "RadioButtons",
      label: "Radio Group"
    },
    {
      key: "NumberInput",
      name: "Number",
      static: false,
      icon: "fas fa-hashtag",
      element: "NumberInput",
      label: "Number"
    },
    {
      key: "TextArea",
      name: "Text Area",
      static: false,
      icon: "fas fa-align-left",
      element: "TextArea",
      label: "Text Area"
    },
    {
      key: "Checkboxes",
      name: "Checkbox Group",
      static: false,
      icon: "far fa-check-square",
      element: "Checkboxes",
      label: "Checkbox Group"
    },
    {
      key: "Paragraph",
      name: "Paragraph",
      static: true,
      icon: "fas fa-paragraph",
      element: "Paragraph",
      label: "Paragraph"
    },
    {
      key: "Button",
      name: "Button",
      static: true,
      icon: "far fa-square",
      element: "Button",
      label: "Button"
    },
    {
      key: "address",
      field_name: "address_",
      name: "Address Field",
      icon: "fas fa-map-marker-alt",
      static: false,
      label: "Address Field",
      element: "address"
    },
    {
      key: "SearchLookupComponent",
      element: "SearchLookupComponent",
      component: SearchLookupComponent,
      type: "custom",
      forwardRef: true,
      field_name: "search-lookup_",
      name: "Search Field",
      icon: "fas fa-search",
      static: false,
      props: {},
      label: "Search Field",
    }
  ];

  return (
    <div
      className={`accordion-item ${className} ${
        draggedIndex === index ? "dragging" : ""
      }`}
      draggable="true"
      data-index={index}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h2 className="accordion-header" id={`heading${index}`}>
        <button
          className={`accordion-button ${isExpanded ? "" : "collapsed"}`}
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
        className={`accordion-collapse collapse ${isExpanded ? "show" : ""}`}
        aria-labelledby={`heading${index}`}
        style={{
          height: isExpanded ? "auto" : "0px",
          transition: "height 0.3s ease-in-out",
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
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleInputChange("icon", e.target.value)
                      }
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

          <div className="build-wrap" id={buildWrapId}>
            <FormBuilder
              sectionId={section.id}
              sectionUniqueId={sectionUniqueId}
              initialData={sectionFormData}
              onDataChange={handleFormDataChange}
              toolbarItems={ToolbarItems}
              buildWrapId={buildWrapId}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

// Add display name for better debugging
Section.displayName = 'Section';

// Export as default
export default Section;