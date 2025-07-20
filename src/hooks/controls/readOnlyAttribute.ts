/**
 * ReadOnly custom attribute for FormBuilder
 * Enhances the readonly text input with a JSON editor supporting readonly conditions
 */

export const registerReadOnlyAttribute = (): void => {
  if (typeof window !== 'undefined' && window.document) {
    
    // Function to enhance readonly input fields
    function enhanceReadOnlyFields() {
      const readOnlyInputs = document.querySelectorAll('input[name="readOnly"]:not([data-enhanced])') as NodeListOf<HTMLInputElement>;
      
      readOnlyInputs.forEach(input => {
        input.setAttribute('data-enhanced', 'true');
        
        // Parse current value or use default
        let readOnlyConfig: any;
        try {
          const parsed = input.value ? JSON.parse(input.value) : null;
          readOnlyConfig = parsed || {
            readOnly: false,
            readOnlyCondition: {
              field: "",
              type: 10,
              value: ""
            }
          };
        } catch (e) {
          readOnlyConfig = {
            readOnly: false,
            readOnlyCondition: {
              field: "",
              type: 10,
              value: ""
            }
          };
        }
        
        // Create main container
        const mainContainer = document.createElement('div');
        mainContainer.className = 'readonly-main-container';
        
        // Create form container
        const formContainer = document.createElement('div');
        formContainer.className = 'readonly-form-container';
        
        // Function to create the readonly configuration form
        function createReadOnlyForm(config: any): HTMLElement {
          const formElement = document.createElement('div');
          formElement.className = 'readonly-form';
          
          formElement.innerHTML = `
            <div class="readonly-header">
              <span class="readonly-title">ReadOnly Configuration</span>
            </div>
            
            <div class="readonly-form-group">
              <label class="readonly-label">
                <input type="checkbox" class="readonly-checkbox" ${config.readOnly ? 'checked' : ''} />
                ReadOnly by default
              </label>
              <small class="readonly-help">Check if field should be readonly by default, uncheck if conditional or editable. <strong>Note: This will be disabled if any condition fields are filled.</strong></small>
            </div>
            
            <div class="readonly-condition-section">
              <h5>ReadOnly Condition</h5>
              <div class="readonly-form-group">
                <label class="readonly-label">Field Name:</label>
                <input type="text" class="form-control readonly-field" placeholder="Enter field name (e.g., CareerAdvisorName)" value="${config.readOnlyCondition?.field || ''}" />
                <small class="readonly-help">Name of a field in the form to check</small>
              </div>
              
              <div class="readonly-form-group">
                <label class="readonly-label">Check Type:</label>
                <select class="form-control readonly-type">
                  <option value="10" ${(config.readOnlyCondition?.type || 10) === 10 ? 'selected' : ''}>hasValue (10)</option>
                  <option value="1" ${config.readOnlyCondition?.type === 1 ? 'selected' : ''}>equals (1)</option>
                  <option value="2" ${config.readOnlyCondition?.type === 2 ? 'selected' : ''}>notEquals (2)</option>
                  <option value="3" ${config.readOnlyCondition?.type === 3 ? 'selected' : ''}>contains (3)</option>
                  <option value="4" ${config.readOnlyCondition?.type === 4 ? 'selected' : ''}>notContains (4)</option>
                  <option value="5" ${config.readOnlyCondition?.type === 5 ? 'selected' : ''}>isEmpty (5)</option>
                  <option value="6" ${config.readOnlyCondition?.type === 6 ? 'selected' : ''}>isNotEmpty (6)</option>
                </select>
                <small class="readonly-help">Type of check to perform (10 = hasValue is most common)</small>
              </div>
              
              <div class="readonly-form-group">
                <label class="readonly-label">Value:</label>
                <input type="text" class="form-control readonly-value" placeholder="Enter value to compare (leave empty for hasValue check)" value="${config.readOnlyCondition?.value || ''}" />
                <small class="readonly-help">Value to compare against (usually empty for hasValue type)</small>
              </div>
            </div>
            
            <div class="readonly-logic-info">
              <strong>Logic:</strong> If condition field has data, set readonly to false and disable the readonly state.
            </div>
          `;
          
          return formElement;
        }
        
        // Function to update the input field with current configuration
        function updateField() {
          const checkboxInput = formContainer.querySelector('.readonly-checkbox') as HTMLInputElement;
          const fieldInput = formContainer.querySelector('.readonly-field') as HTMLInputElement;
          const typeSelect = formContainer.querySelector('.readonly-type') as HTMLSelectElement;
          const valueInput = formContainer.querySelector('.readonly-value') as HTMLInputElement;
          
          // Check if any condition fields have data
          const hasConditionData = fieldInput?.value || valueInput?.value || (typeSelect?.value && typeSelect.value !== "10");
          
          // If condition has data, force readOnly to false and disable checkbox
          if (hasConditionData) {
            checkboxInput.checked = false;
            checkboxInput.disabled = true;
          } else {
            checkboxInput.disabled = false;
          }
          
          const configData = {
            readOnly: checkboxInput?.checked || false,
            readOnlyCondition: {
              field: fieldInput?.value || "",
              type: parseInt(typeSelect?.value || "10"),
              value: valueInput?.value || ""
            }
          };
          
          input.value = JSON.stringify(configData);
          
          // Trigger change event
          const event = new Event('change', { bubbles: true });
          input.dispatchEvent(event);
        }
        
        // Function to add event listeners to form elements
        function addEventListeners(form: HTMLElement) {
          const checkboxInput = form.querySelector('.readonly-checkbox') as HTMLInputElement;
          const fieldInput = form.querySelector('.readonly-field') as HTMLInputElement;
          const typeSelect = form.querySelector('.readonly-type') as HTMLSelectElement;
          const valueInput = form.querySelector('.readonly-value') as HTMLInputElement;
          
          [checkboxInput, fieldInput, typeSelect, valueInput].forEach(element => {
            element?.addEventListener('change', updateField);
            element?.addEventListener('input', updateField);
          });
        }
        
        // Initialize the form
        const readOnlyForm = createReadOnlyForm(readOnlyConfig);
        formContainer.appendChild(readOnlyForm);
        addEventListeners(readOnlyForm);
        
        // Assemble the main container
        mainContainer.appendChild(formContainer);
        
        // Hide original input and show enhanced UI
        input.style.display = 'none';
        input.parentNode?.insertBefore(mainContainer, input.nextSibling);
        
        // Initial update
        updateField();
      });
    }
    
    // Initial enhancement
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', enhanceReadOnlyFields);
    } else {
      enhanceReadOnlyFields();
    }
    
    // Observer for dynamically added fields
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          enhanceReadOnlyFields();
        }
      });
    });
    
    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
};