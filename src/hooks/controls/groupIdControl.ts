/**
 * GroupId control enhancement for FormBuilder
 * Converts GroupId field to dropdown populated from GetEnums API using API service
 */

import apiService from '../../services/apiService';

export const registerGroupIdControl = (): void => {
  if (typeof window !== 'undefined' && window.document) {
    
    // Function to enhance GroupId fields
    function enhanceGroupIdFields() {
      const groupIdInputs = document.querySelectorAll('input[name="groupId"]:not([data-enhanced])') as NodeListOf<HTMLInputElement>;
      
      groupIdInputs.forEach(async (input) => {
        input.setAttribute('data-enhanced', 'true');
        
        // Get company ID from form context if available
        let companyId = '78'; // default
        const formBuilder = input.closest('.form-wrap, .build-wrap, .form-builder');
        if (formBuilder) {
          // Try to extract companyId from form configuration
          const companyInput = formBuilder.querySelector('input[id="companyId"]') as HTMLInputElement;
          if (companyInput && companyInput.value) {
            companyId = companyInput.value;
          }
        }
        
        // Create dropdown container
        const dropdownContainer = document.createElement('div');
        dropdownContainer.className = 'groupid-dropdown-container';
        
        // Create select element
        const select = document.createElement('select');
        select.className = 'form-control groupid-select';
        select.name = 'groupId';
        select.id = input.id;
        
        // Copy all attributes from input to select (important for FormBuilder integration)
        Array.from(input.attributes).forEach(attr => {
          if (attr.name !== 'type' && attr.name !== 'class') {
            select.setAttribute(attr.name, attr.value);
          }
        });
        
        // Add loading option
        const loadingOption = document.createElement('option');
        loadingOption.value = '';
        loadingOption.textContent = 'Loading groups...';
        select.appendChild(loadingOption);
        
        // Hide original input and insert dropdown
        input.style.display = 'none';
        input.parentNode?.insertBefore(dropdownContainer, input.nextSibling);
        dropdownContainer.appendChild(select);
        
        try {
          // Fetch enum groups from API using the API service
          console.log(`🔍 Fetching enum groups for companyId: ${companyId}`);
          const response = await apiService.getEnumGroups(companyId);
          
          // Clear loading option
          select.innerHTML = '';
          
          // Add empty option
          const emptyOption = document.createElement('option');
          emptyOption.value = '';
          emptyOption.textContent = 'Select a group...';
          select.appendChild(emptyOption);
          
          if (response.success && response.data && response.data.length > 0) {
            console.log(`✅ Loaded ${response.data.length} enum groups`);
            
            // Populate dropdown with enum groups
            response.data.forEach(group => {
              const option = document.createElement('option');
              option.value = group.id.toString(); // Ensure value is string
              option.textContent = group.name;
              
              // Select current value if it matches
              if (input.value === group.id.toString()) {
                option.selected = true;
              }
              
              select.appendChild(option);
            });
            
            // Set initial value if input has a value
            if (input.value) {
              select.value = input.value;
            }
            
          } else {
            console.warn('⚠️ No enum groups received from API');
            // Show empty state option
            const emptyStateOption = document.createElement('option');
            emptyStateOption.value = '';
            emptyStateOption.textContent = 'No groups available';
            select.appendChild(emptyStateOption);
          }
          
        } catch (error) {
          console.error('❌ Error loading enum groups:', error);
          
          // Handle error - show error option
          select.innerHTML = '';
          const errorOption = document.createElement('option');
          errorOption.value = '';
          errorOption.textContent = 'Error loading groups';
          errorOption.style.color = '#dc3545'; // Bootstrap danger color
          select.appendChild(errorOption);
        }
        
        // Enhanced synchronization with FormBuilder
        const syncWithFormBuilder = (newValue: string) => {
          // Update the original input
          input.value = newValue;
          
          // Trigger multiple events to ensure FormBuilder recognizes the change
          const events = ['change', 'input', 'blur', 'keyup'];
          events.forEach(eventType => {
            const event = new Event(eventType, { bubbles: true, cancelable: true });
            input.dispatchEvent(event);
          });
          
          // Try to trigger FormBuilder-specific events
          const customEvents = ['fieldUpdated', 'attributeChanged', 'formUpdated'];
          customEvents.forEach(eventType => {
            const customEvent = new CustomEvent(eventType, {
              detail: { 
                field: input,
                attribute: 'groupId',
                value: newValue,
                element: input 
              },
              bubbles: true
            });
            input.dispatchEvent(customEvent);
            
            // Also dispatch on form builder container
            const formBuilderContainer = input.closest('.form-wrap, .build-wrap, .form-builder');
            if (formBuilderContainer) {
              formBuilderContainer.dispatchEvent(customEvent);
            }
          });
          
          // Force update FormBuilder's internal data if possible
          const $input = window.$ ? window.$(input) : null;
          if ($input && $input.length) {
            try {
              // Try to trigger FormBuilder's internal update mechanisms
              $input.trigger('change');
              $input.trigger('input');
              $input.trigger('keyup');
              
              // Try to access FormBuilder instance and update data
              const formBuilderInstance = $input.closest('.form-builder, .build-wrap').data('formBuilder');
              if (formBuilderInstance) {
                // Force FormBuilder to recognize the change
                setTimeout(() => {
                  try {
                    const currentData = formBuilderInstance.actions.getData();
                    console.log('📊 Current FormBuilder data updated');
                  } catch (e) {
                    console.log('⚠️ Could not access FormBuilder data, but change events sent');
                  }
                }, 100);
              }
            } catch (e) {
              console.log('⚠️ jQuery/FormBuilder integration attempted but not available');
            }
          }
        };
        
        // Sync dropdown changes with FormBuilder
        select.addEventListener('change', () => {
          const selectedValue = select.value;
          console.log(`📝 GroupId selection changed: ${selectedValue}`);
          syncWithFormBuilder(selectedValue);
        });
        
        // Also handle other events for better integration
        select.addEventListener('blur', () => {
          syncWithFormBuilder(select.value);
        });
        
        // Update dropdown if input value changes programmatically
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'attributes') {
              if (mutation.attributeName === 'value' || mutation.attributeName === 'data-value') {
                const newValue = input.value || input.getAttribute('data-value') || '';
                if (select.value !== newValue) {
                  select.value = newValue;
                  console.log(`🔄 GroupId dropdown updated programmatically: ${newValue}`);
                }
              }
            }
          });
        });
        
        // Also observe value changes on the input itself
        let lastValue = input.value;
        const checkForValueChanges = () => {
          if (input.value !== lastValue) {
            lastValue = input.value;
            select.value = input.value;
            console.log(`🔄 GroupId input value changed: ${input.value}`);
          }
        };
        
        observer.observe(input, {
          attributes: true,
          attributeFilter: ['value', 'data-value']
        });
        
        // Periodically check for value changes (fallback)
        const valueCheckInterval = setInterval(checkForValueChanges, 500);
        
        // Store references for cleanup
        (select as any).__observer = observer;
        (select as any).__valueCheckInterval = valueCheckInterval;
        
        // Add event listener to clean up when element is removed
        const cleanupObserver = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            mutation.removedNodes.forEach((node) => {
              if (node === select || node === dropdownContainer) {
                observer.disconnect();
                clearInterval(valueCheckInterval);
                cleanupObserver.disconnect();
              }
            });
          });
        });
        
        cleanupObserver.observe(document.body, {
          childList: true,
          subtree: true
        });
      });
    }
    
    // Function to find and update GroupId labels
    function updateGroupIdLabels() {
      // Find labels associated with GroupId fields
      const labels = document.querySelectorAll('label[for*="groupId"], label[data-field="groupId"]');
      labels.forEach(label => {
        const text = label.textContent?.toLowerCase();
        if (text?.includes('groupid') || text?.includes('group id')) {
          label.textContent = 'Group';
          console.log('🏷️ Updated GroupId label to "Group"');
        }
      });
      
      // Also check for labels with specific text content
      const allLabels = document.querySelectorAll('label');
      allLabels.forEach(label => {
        const text = label.textContent;
        if (text === 'groupId' || text === 'GroupId' || text === 'Group ID') {
          label.textContent = 'Group';
          console.log('🏷️ Updated label text to "Group"');
        }
      });
      
      // Also check for spans and other elements that might contain the label
      const spans = document.querySelectorAll('span, div');
      spans.forEach(span => {
        const text = span.textContent?.trim();
        if (text === 'groupId' || text === 'GroupId' || text === 'Group ID') {
          // Only update if it's likely a label (not part of larger text)
          if (span.textContent?.trim().length === text?.length) {
            span.textContent = 'Group';
            console.log('🏷️ Updated span text to "Group"');
          }
        }
      });
    }
    
    // Enhanced function that handles both enhancement tasks
    function enhanceGroupIdFieldsAndLabels() {
      console.log('🚀 Starting GroupId enhancement...');
      updateGroupIdLabels();
      enhanceGroupIdFields();
    }
    
    // Initial enhancement
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', enhanceGroupIdFieldsAndLabels);
    } else {
      enhanceGroupIdFieldsAndLabels();
    }
    
    // Observer for dynamically added fields
    const observer = new MutationObserver((mutations) => {
      let shouldEnhance = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // Check if any new nodes contain groupId inputs or labels
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.querySelector && 
                  (element.querySelector('input[name="groupId"]') || 
                   element.querySelector('label[for*="groupId"]') ||
                   element.textContent?.includes('groupId'))) {
                shouldEnhance = true;
              }
            }
          });
        }
      });
      
      if (shouldEnhance) {
        console.log('🔍 Detected new GroupId fields, enhancing...');
        // Use setTimeout to ensure DOM is fully updated
        setTimeout(enhanceGroupIdFieldsAndLabels, 200);
      }
    });
    
    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Cleanup function (optional - for dev tools)
    (window as any).cleanupGroupIdControl = () => {
      observer.disconnect();
      console.log('🧹 GroupId control cleanup completed');
    };
    
    console.log('✅ GroupId control registered and active');
  }
};

// CSS for styling the enhanced GroupId dropdown
export const groupIdDropdownStyles = `
.groupid-dropdown-container {
  margin-top: 5px;
}

.groupid-select {
  width: 100%;
  padding: 8px 12px;
  font-size: 13px;
  line-height: 1.4;
  color: #555;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.groupid-select:focus {
  border-color: #007bff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.groupid-select:disabled {
  background-color: #f8f9fa;
  opacity: 0.65;
  cursor: not-allowed;
}

.groupid-dropdown-container + input[name="groupId"] {
  display: none !important;
}

/* Hide the original input even if it's not directly after the container */
input[name="groupId"][data-enhanced] {
  display: none !important;
}

/* Loading state styling */
.groupid-select option[value=""]:first-child {
  font-style: italic;
  color: #6c757d;
}

/* Error state styling */
.groupid-select option[style*="color: #dc3545"] {
  background-color: #f8d7da;
  font-weight: 500;
}

/* Ensure dropdown is visible and properly styled */
.groupid-select {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}
`;