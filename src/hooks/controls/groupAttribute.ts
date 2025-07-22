// src/hooks/controls/groupAttribute.ts
/**
 * Group custom attribute for FormBuilder
 * Replaces groupId with a select dropdown that fetches options from API
 */

import apiService from '../../services/apiService';

interface GroupOption {
  id: string;
  name: string;
  value: string;
}

export const registerGroupAttribute = (): void => {
  if (typeof window !== 'undefined' && window.document) {
    
    // Cache for group options to avoid repeated API calls
    let groupOptionsCache: GroupOption[] | null = null;
    let isLoading = false;
    
    // Function to fetch group options from API
    async function fetchGroupOptions(): Promise<GroupOption[]> {
      if (groupOptionsCache) {
        return groupOptionsCache;
      }
      
      if (isLoading) {
        // Wait for ongoing request
        return new Promise((resolve) => {
          const checkCache = () => {
            if (groupOptionsCache) {
              resolve(groupOptionsCache);
            } else if (!isLoading) {
              resolve([]); // Return empty array if loading failed
            } else {
              setTimeout(checkCache, 100);
            }
          };
          checkCache();
        });
      }
      
      isLoading = true;
      
      try {
        console.log('🔄 Fetching group options from API...');
        const response = await apiService.getEnumGroups();
        
        if (response.success && response.data) {
          console.log('✅ API Response received:', response.data);
          
          // Handle different possible response structures
          let dataArray: any[] = [];
          
          // If response.data is directly an array
          if (Array.isArray(response.data)) {
            dataArray = response.data;
          }
          // If response.data has items, groups, or options property
          else if (response.data.items && Array.isArray(response.data.items)) {
            dataArray = response.data.items;
          }
          else if (response.data.groups && Array.isArray(response.data.groups)) {
            dataArray = response.data.groups;
          }
          else if (response.data.options && Array.isArray(response.data.options)) {
            dataArray = response.data.options;
          }
          // If response.data is a single object, wrap it in an array
          else if (typeof response.data === 'object') {
            dataArray = [response.data];
          }
          
          // Map the data to our GroupOption interface
          groupOptionsCache = dataArray.map((item: any, index: number) => {
            // Handle different possible property names
            const id = String(
              item.id || 
              item.Id || 
              item.ID || 
              item.value || 
              item.Value || 
              index
            );
            
            const name = String(
              item.name || 
              item.Name || 
              item.label || 
              item.Label || 
              item.text || 
              item.Text || 
              item.title || 
              item.Title || 
              `Option ${index + 1}`
            );
            
            const value = String(
              item.value || 
              item.Value || 
              item.id || 
              item.Id || 
              item.ID || 
              index
            );
            
            return {
              id,
              name,
              value
            };
          }).filter(option => option.value && option.name); // Filter out invalid options
          
          console.log('✅ Processed group options:', groupOptionsCache);
        } else {
          console.warn('⚠️ API response was not successful:', response.error);
          groupOptionsCache = [];
        }
      } catch (error) {
        console.error('❌ Error fetching group options:', error);
        groupOptionsCache = [];
      } finally {
        isLoading = false;
      }
      
      return groupOptionsCache || [];
    }
    
    // Function to enhance group input fields
    function enhanceGroupFields() {
      const groupInputs = document.querySelectorAll('input[name="groupId"]:not([data-enhanced])') as NodeListOf<HTMLInputElement>;
      
      groupInputs.forEach(async (input) => {
        input.setAttribute('data-enhanced', 'true');
        console.log('🔧 Enhancing group field with current value:', input.value);
        
        // Create container for better styling
        const container = document.createElement('div');
        container.className = 'group-attribute-container';
        
        // Create select element
        const selectElement = document.createElement('select');
        selectElement.className = 'form-control group-select';
        selectElement.name = 'group';
        selectElement.setAttribute('data-loading', 'true');
        
        // Add loading option
        selectElement.innerHTML = '<option value="">Loading groups...</option>';
        
        // Update label if exists
        const label = input.previousElementSibling;
        if (label && label.tagName === 'LABEL') {
          label.textContent = 'Group';
        }
        
        // Create loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'group-loading';
        loadingIndicator.textContent = 'Fetching options...';
        
        // Assemble the container
        container.appendChild(selectElement);
        container.appendChild(loadingIndicator);
        
        // Hide original input and show enhanced container
        input.style.display = 'none';
        input.parentNode?.insertBefore(container, input.nextSibling);
        
        // Fetch and populate options
        try {
          const options = await fetchGroupOptions();
          
          // Remove loading indicator
          loadingIndicator.remove();
          selectElement.removeAttribute('data-loading');
          
          // Clear loading option and add default option
          selectElement.innerHTML = '<option value="">Select a group</option>';
          
          if (options.length > 0) {
            // Add options from API
            options.forEach(option => {
              const optionElement = document.createElement('option');
              optionElement.value = option.value;
              optionElement.textContent = option.name;
              
              // Set selected if it matches current input value
              if (input.value === option.value || input.value === option.id) {
                optionElement.selected = true;
              }
              
              selectElement.appendChild(optionElement);
            });
            
            console.log('✅ Successfully populated', options.length, 'group options');
          } else {
            // Show no options available
            selectElement.innerHTML = '<option value="">No groups available</option>';
            selectElement.disabled = true;
            console.warn('⚠️ No group options available');
          }
          
          // Update input value when select changes
          selectElement.addEventListener('change', (e) => {
            const target = e.target as HTMLSelectElement;
            const selectedValue = target.value;
            
            console.log('📝 Group selection changed to:', selectedValue);
            
            input.value = selectedValue;
            
            // Trigger change event on original input to notify FormBuilder
            const changeEvent = new Event('change', { bubbles: true });
            input.dispatchEvent(changeEvent);
            
            // Also trigger input event for immediate updates
            const inputEvent = new Event('input', { bubbles: true });
            input.dispatchEvent(inputEvent);
          });
          
          // Set initial value if input has a value
          if (input.value && input.value !== '') {
            selectElement.value = input.value;
            console.log('🎯 Set initial select value to:', input.value);
          }
          
        } catch (error) {
          console.error('❌ Error loading group options:', error);
          
          // Remove loading indicator and show error
          loadingIndicator.remove();
          selectElement.removeAttribute('data-loading');
          selectElement.setAttribute('data-error', 'true');
          selectElement.innerHTML = '<option value="">Error loading groups</option>';
          selectElement.disabled = true;
          
          // Add error message
          const errorMessage = document.createElement('div');
          errorMessage.className = 'group-error-message';
          errorMessage.textContent = 'Failed to load group options. Please try again.';
          container.appendChild(errorMessage);
        }
      });
    }
    
    // Initial enhancement
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', enhanceGroupFields);
    } else {
      enhanceGroupFields();
    }
    
    // Observer for dynamically added fields with debouncing
    let observerTimeout: NodeJS.Timeout;
    const observer = new MutationObserver((mutations) => {
      // Clear previous timeout to debounce rapid mutations
      if (observerTimeout) {
        clearTimeout(observerTimeout);
      }
      
      // Check if any mutations contain group fields
      const hasGroupFields = mutations.some(mutation => {
        if (mutation.type === 'childList') {
          const addedNodes = Array.from(mutation.addedNodes) as Element[];
          return addedNodes.some(node => 
            node.nodeType === Node.ELEMENT_NODE && 
            (node.querySelector?.('input[name="groupId"]') || 
             (node as HTMLElement).matches?.('input[name="groupId"]'))
          );
        }
        return false;
      });
      
      if (hasGroupFields) {
        observerTimeout = setTimeout(() => {
          console.log('🔍 New group fields detected, enhancing...');
          enhanceGroupFields();
        }, 300); // Debounce to avoid excessive calls
      }
    });
    
    // Start observing with optimized settings
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false, // Don't watch attributes for performance
      characterData: false // Don't watch text changes for performance
    });
    
    // Cleanup observer when page unloads
    window.addEventListener('beforeunload', () => {
      observer.disconnect();
      if (observerTimeout) {
        clearTimeout(observerTimeout);
      }
    });
  }
};