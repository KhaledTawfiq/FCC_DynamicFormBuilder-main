// src/hooks/controls/groupAttribute.ts
/**
 * Group custom attribute for FormBuilder
 * Replaces groupId with a select dropdown that fetches options from API
 */

import apiService from '../../services/apiService';

// Add this method to your apiService.ts file if not already present
declare module '../../services/apiService' {
  interface ApiService {
    getEnumGroups(): Promise<{ success: boolean; data?: any; error?: string }>;
  }
}

interface GroupOption {
  id: string;
  name: string;
  value: string; // Made required instead of optional
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
            } else {
              setTimeout(checkCache, 100);
            }
          };
          checkCache();
        });
      }
      
      isLoading = true;
      
      try {
        const response = await apiService.getEnumGroups();
        if (response.success && response.data && Array.isArray(response.data)) {
          groupOptionsCache = response.data.map((item: any) => {
            // Ensure we always have valid string values
            const id = String(item.id || item.value || '');
            const name = String(item.name || item.label || item.text || 'Unknown');
            const value = String(item.value || item.id || '');
            
            return {
              id,
              name,
              value
            };
          }).filter(option => option.value); // Filter out empty values
        } else {
          groupOptionsCache = [];
        }
      } catch (error) {
        console.error('Error fetching group options:', error);
        groupOptionsCache = [];
      } finally {
        isLoading = false;
      }
      
      return groupOptionsCache || []; // Add fallback to empty array
    }
    
    // Function to enhance group input fields
    function enhanceGroupFields() {
      const groupInputs = document.querySelectorAll('input[name="groupId"]:not([data-enhanced])') as NodeListOf<HTMLInputElement>;
      
      groupInputs.forEach(async (input) => {
        input.setAttribute('data-enhanced', 'true');
        
        // Create select element
        const selectElement = document.createElement('select');
        selectElement.className = 'form-control group-select';
        selectElement.name = 'group';
        
        // Add loading option
        selectElement.innerHTML = '<option value="">Loading groups...</option>';
        
        // Replace input with select
        const label = input.previousElementSibling;
        if (label && label.tagName === 'LABEL') {
          label.textContent = 'Group';
        }
        
        // Hide original input and show select
        input.style.display = 'none';
        input.parentNode?.insertBefore(selectElement, input.nextSibling);
        
        // Fetch and populate options
        try {
          const options = await fetchGroupOptions();
          
          // Clear loading option
          selectElement.innerHTML = '<option value="">Select a group</option>';
          
          // Add options from API
          options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value; // Now guaranteed to be string
            optionElement.textContent = option.name;
            
            // Set selected if it matches current input value
            if (input.value === option.value) {
              optionElement.selected = true;
            }
            
            selectElement.appendChild(optionElement);
          });
          
          // Update input value when select changes
          selectElement.addEventListener('change', (e) => {
            const target = e.target as HTMLSelectElement;
            input.value = target.value;
            
            // Trigger change event on original input
            const event = new Event('change', { bubbles: true });
            input.dispatchEvent(event);
          });
          
          // Set initial value
          if (input.value) {
            selectElement.value = input.value;
          }
          
        } catch (error) {
          console.error('Error loading group options:', error);
          selectElement.innerHTML = '<option value="">Error loading groups</option>';
        }
      });
    }
    
    // Initial enhancement
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', enhanceGroupFields);
    } else {
      enhanceGroupFields();
    }
    
    // Observer for dynamically added fields
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          enhanceGroupFields();
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