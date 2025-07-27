/**
 * Fixed Custom Form Elements Edit Component - Updated with Address Support
 * Fixes the input field clearing issue with proper TypeScript types
 */

import React, { useState, useEffect, useCallback } from 'react';
import { generateElementName } from '../config/elementDefaults';

interface ValidationRule {
  type: string;
  message: string;
}

interface OptionValue {
  value: string;
  text: string;
  key: string;
}

interface FormElementData {
  id?: string;
  name?: string;
  field_name?: string;
  element?: string;
  type?: string;
  label?: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  defaultValue?: string;
  maxlength?: number;
  access?: boolean;
  other?: string;
  groupId?: string;
  condition?: string;
  values?: OptionValue[];
  validations?: ValidationRule[];
  [key: string]: any;
}

interface FormElementsEditProps {
  element?: FormElementData;
  updateElement?: (element: FormElementData) => void;
  preview?: any;
  editForm?: any;
  className?: string;
  [key: string]: any;
}

const FormElementsEdit: React.FC<FormElementsEditProps> = ({
  element,
  updateElement,
  preview,
  editForm,
  className = ''
}) => {
  const [formData, setFormData] = useState<FormElementData>(element || {});
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize form data only once when element changes
  useEffect(() => {
    if (element && !isInitialized) {
      console.log('FormElementsEdit initializing with element:', element);
      
      const elementData: FormElementData = { ...element };
      
      // Check if name exists in different possible fields
      if (!elementData.name) {
        if (elementData.field_name) {
          elementData.name = elementData.field_name;
          console.log('Using field_name as name:', elementData.name);
        } else if (elementData.element) {
          elementData.name = generateElementName(elementData.element);
          console.log('Generated name for element:', elementData.name);
          
          // Update the element with the generated name
          if (updateElement) {
            updateElement(elementData);
          }
        } else {
          // Fallback if no element type is specified
          elementData.name = generateElementName('TextInput');
          console.log('Generated fallback name:', elementData.name);
        }
      }
      
      setFormData(elementData);
      setIsInitialized(true);
    }
  }, [element, updateElement, isInitialized]);

  // Reset initialization when element ID changes
  useEffect(() => {
    setIsInitialized(false);
  }, [element?.id, element?.element]);

  // Debounced update function
  const debouncedUpdate = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (updatedElement: FormElementData) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (updateElement) {
            console.log('Updating element:', updatedElement);
            updateElement(updatedElement);
          }
        }, 300); // 300ms debounce
      };
    })(),
    [updateElement]
  );

  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData((prevData: FormElementData) => {
      const updatedElement: FormElementData = {
        ...prevData,
        [field]: value
      };
      
      // Update the parent component with debounce
      debouncedUpdate(updatedElement);
      
      return updatedElement;
    });
  }, [debouncedUpdate]);

  const handleArrayChange = useCallback((field: string, index: number, key: string, value: string) => {
    setFormData((prevData: FormElementData) => {
      const updatedElement: FormElementData = { ...prevData };
      if (!updatedElement[field]) {
        updatedElement[field] = [];
      }
      if (!updatedElement[field][index]) {
        updatedElement[field][index] = {};
      }
      updatedElement[field][index][key] = value;
      
      // Update the parent component with debounce
      debouncedUpdate(updatedElement);
      
      return updatedElement;
    });
  }, [debouncedUpdate]);

  const addArrayItem = useCallback((field: string) => {
    setFormData((prevData: FormElementData) => {
      const updatedElement: FormElementData = { ...prevData };
      if (!updatedElement[field]) {
        updatedElement[field] = [];
      }
      
      if (field === 'values') {
        updatedElement[field].push({ value: '', text: '', key: '' });
      } else if (field === 'validations') {
        updatedElement[field].push({ type: '', message: '' });
      }
      
      if (updateElement) {
        updateElement(updatedElement);
      }
      
      return updatedElement;
    });
  }, [updateElement]);

  const removeArrayItem = useCallback((field: string, index: number) => {
    setFormData((prevData: FormElementData) => {
      const updatedElement: FormElementData = { ...prevData };
      if (updatedElement[field] && Array.isArray(updatedElement[field])) {
        updatedElement[field].splice(index, 1);
        if (updateElement) {
          updateElement(updatedElement);
        }
      }
      return updatedElement;
    });
  }, [updateElement]);

  const renderBasicFields = () => (
    <div className="basic-fields">
      <h4>Basic Properties</h4>
      
      {/* Name Field - Read Only */}
      <div className="form-group">
        <label htmlFor="element_name">Element Name (Auto-generated)</label>
        <input
          id="element_name"
          type="text"
          className="form-control readonly-field"
          value={formData.name || ''}
          readOnly
          title="This field is auto-generated and cannot be edited"
          style={{
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6',
            color: '#6c757d',
            cursor: 'not-allowed'
          }}
        />
        <small className="form-text text-muted">
          🔒 This field is automatically generated and cannot be modified
        </small>
      </div>

      {/* Label Field */}
      <div className="form-group">
        <label htmlFor="element_label">Label</label>
        <input
          id="element_label"
          type="text"
          className="form-control"
          value={formData.label || ''}
          onChange={(e) => handleInputChange('label', e.target.value)}
          placeholder="Enter field label"
        />
      </div>

      {/* Description Field */}
      <div className="form-group">
        <label htmlFor="element_description">Description</label>
        <textarea
          id="element_description"
          className="form-control"
          rows={2}
          value={formData.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Enter field description"
        />
      </div>

      {/* Placeholder Field */}
      {!['header', 'paragraph', 'button'].includes(formData.type || '') && (
        <div className="form-group">
          <label htmlFor="element_placeholder">Placeholder</label>
          <input
            id="element_placeholder"
            type="text"
            className="form-control"
            value={formData.placeholder || ''}
            onChange={(e) => handleInputChange('placeholder', e.target.value)}
            placeholder="Enter placeholder text"
          />
        </div>
      )}

      {/* Required Field */}
      <div className="form-group">
        <div className="form-check">
          <input
            id="element_required"
            type="checkbox"
            className="form-check-input"
            checked={formData.required || false}
            onChange={(e) => handleInputChange('required', e.target.checked)}
          />
          <label className="form-check-label" htmlFor="element_required">
            Required Field
          </label>
        </div>
      </div>
    </div>
  );

  const renderAdvancedFields = () => (
    <div className="advanced-fields">
      <h4>Advanced Properties</h4>
      
      {/* CSS Class Field */}
      <div className="form-group">
        <label htmlFor="element_class">CSS Class</label>
        <input
          id="element_class"
          type="text"
          className="form-control"
          value={formData.className || ''}
          onChange={(e) => handleInputChange('className', e.target.value)}
          placeholder="Enter CSS classes"
        />
      </div>

      {/* Default Value Field */}
      <div className="form-group">
        <label htmlFor="element_default_value">Default Value</label>
        <input
          id="element_default_value"
          type="text"
          className="form-control"
          value={formData.defaultValue || ''}
          onChange={(e) => handleInputChange('defaultValue', e.target.value)}
          placeholder="Enter default value"
        />
      </div>

      {/* Max Length Field */}
      {['text', 'textarea', 'number', 'address'].includes(formData.type || '') && (
        <div className="form-group">
          <label htmlFor="element_maxlength">Maximum Length</label>
          <input
            id="element_maxlength"
            type="number"
            className="form-control"
            value={formData.maxlength || ''}
            onChange={(e) => handleInputChange('maxlength', parseInt(e.target.value) || 0)}
            placeholder="Enter maximum length"
            min="0"
          />
        </div>
      )}

      {/* Access Field */}
      <div className="form-group">
        <div className="form-check">
          <input
            id="element_access"
            type="checkbox"
            className="form-check-input"
            checked={formData.access !== false}
            onChange={(e) => handleInputChange('access', e.target.checked)}
          />
          <label className="form-check-label" htmlFor="element_access">
            Enable Access
          </label>
        </div>
      </div>

      {/* Other Field */}
      <div className="form-group">
        <label htmlFor="element_other">Other Properties</label>
        <textarea
          id="element_other"
          className="form-control"
          rows={2}
          value={formData.other || ''}
          onChange={(e) => handleInputChange('other', e.target.value)}
          placeholder="Enter additional properties"
        />
      </div>

      {/* Group ID Field */}
      <div className="form-group">
        <label htmlFor="element_group_id">Group ID</label>
        <input
          id="element_group_id"
          type="text"
          className="form-control"
          value={formData.groupId || ''}
          onChange={(e) => handleInputChange('groupId', e.target.value)}
          placeholder="Enter group identifier"
        />
      </div>

      {/* Condition Field */}
      <div className="form-group">
        <label htmlFor="element_condition">Conditional Logic</label>
        <textarea
          id="element_condition"
          className="form-control"
          rows={2}
          value={formData.condition || ''}
          onChange={(e) => handleInputChange('condition', e.target.value)}
          placeholder="Enter conditional logic (e.g., show if other_field == 'value')"
        />
      </div>
    </div>
  );

  const renderAddressSpecificFields = () => {
    const isAddressType = formData.type === 'address';
    
    if (!isAddressType) return null;

    return (
      <div className="address-specific-fields">
        <h4>Address Field Properties</h4>
        
        {/* Address Format Field */}
        <div className="form-group">
          <label htmlFor="address_format">Address Format</label>
          <select
            id="address_format"
            className="form-control"
            value={formData.addressFormat || 'single'}
            onChange={(e) => handleInputChange('addressFormat', e.target.value)}
          >
            <option value="single">Single Line Address</option>
            <option value="multi">Multi-line Address</option>
            <option value="structured">Structured Address (Street, City, State, ZIP)</option>
          </select>
          <small className="form-text text-muted">
            Choose how the address should be displayed and collected
          </small>
        </div>

        {/* Country Restriction Field */}
        <div className="form-group">
          <label htmlFor="address_country">Restrict to Country</label>
          <input
            id="address_country"
            type="text"
            className="form-control"
            value={formData.restrictToCountry || ''}
            onChange={(e) => handleInputChange('restrictToCountry', e.target.value)}
            placeholder="e.g., US, CA, UK (leave empty for all countries)"
          />
          <small className="form-text text-muted">
            Enter country codes to restrict address to specific countries
          </small>
        </div>

        {/* Enable Autocomplete Field */}
        <div className="form-group">
          <div className="form-check">
            <input
              id="address_autocomplete"
              type="checkbox"
              className="form-check-input"
              checked={formData.enableAutocomplete !== false}
              onChange={(e) => handleInputChange('enableAutocomplete', e.target.checked)}
            />
            <label className="form-check-label" htmlFor="address_autocomplete">
              Enable Address Autocomplete
            </label>
          </div>
          <small className="form-text text-muted">
            Allow users to select from suggested addresses while typing
          </small>
        </div>

        {/* Validate Address Field */}
        <div className="form-group">
          <div className="form-check">
            <input
              id="address_validate"
              type="checkbox"
              className="form-check-input"
              checked={formData.validateAddress || false}
              onChange={(e) => handleInputChange('validateAddress', e.target.checked)}
            />
            <label className="form-check-label" htmlFor="address_validate">
              Validate Address
            </label>
          </div>
          <small className="form-text text-muted">
            Check if the entered address is valid and exists
          </small>
        </div>
      </div>
    );
  };

  const renderOptionsFields = () => {
    const hasOptions = ['select', 'radio-group', 'checkbox-group', 'autocomplete'].includes(formData.type || '');
    
    if (!hasOptions) return null;

    const values = formData.values || [];

    return (
      <div className="options-fields">
        <h4>Options</h4>
        
        {values.map((option: OptionValue, index: number) => (
          <div key={index} className="option-item border p-3 mb-2 rounded">
            <div className="row">
              <div className="col-md-4">
                <label>Value</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={option?.value || ''}
                  onChange={(e) => handleArrayChange('values', index, 'value', e.target.value)}
                  placeholder="Option value"
                />
              </div>
              <div className="col-md-4">
                <label>Text</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={option?.text || ''}
                  onChange={(e) => handleArrayChange('values', index, 'text', e.target.value)}
                  placeholder="Display text"
                />
              </div>
              <div className="col-md-3">
                <label>Key</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={option?.key || ''}
                  onChange={(e) => handleArrayChange('values', index, 'key', e.target.value)}
                  placeholder="Option key"
                />
              </div>
              <div className="col-md-1">
                <label>&nbsp;</label>
                <button
                  type="button"
                  className="btn btn-sm btn-danger d-block"
                  onClick={() => removeArrayItem('values', index)}
                  title="Remove option"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        ))}
        
        <button
          type="button"
          className="btn btn-sm btn-primary"
          onClick={() => addArrayItem('values')}
        >
          + Add Option
        </button>
      </div>
    );
  };

  const renderValidationFields = () => {
    const validations = formData.validations || [];
    
    return (
      <div className="validation-fields">
        <h4>Validation Rules</h4>
        
        {validations.map((validation: ValidationRule, index: number) => (
          <div key={index} className="validation-item border p-3 mb-2 rounded">
            <div className="row">
              <div className="col-md-4">
                <label>Type</label>
                <select
                  className="form-control form-control-sm"
                  value={validation?.type || ''}
                  onChange={(e) => handleArrayChange('validations', index, 'type', e.target.value)}
                >
                  <option value="">Select validation type</option>
                  <option value="required">Required</option>
                  <option value="email">Email</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                  <option value="url">URL</option>
                  <option value="pattern">Pattern</option>
                  <option value="minlength">Minimum Length</option>
                  <option value="maxlength">Maximum Length</option>
                  <option value="file">File</option>
                  <option value="address">Address</option>
                </select>
              </div>
              <div className="col-md-7">
                <label>Message</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={validation?.message || ''}
                  onChange={(e) => handleArrayChange('validations', index, 'message', e.target.value)}
                  placeholder="Validation error message"
                />
              </div>
              <div className="col-md-1">
                <label>&nbsp;</label>
                <button
                  type="button"
                  className="btn btn-sm btn-danger d-block"
                  onClick={() => removeArrayItem('validations', index)}
                  title="Remove validation"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        ))}
        
        <button
          type="button"
          className="btn btn-sm btn-primary"
          onClick={() => addArrayItem('validations')}
        >
          + Add Validation Rule
        </button>
      </div>
    );
  };

  return (
    <div className={`custom-form-elements-edit ${className}`}>
      <div className="edit-form-content">
        {renderBasicFields()}
        {renderAdvancedFields()}
        {renderAddressSpecificFields()}
        {renderOptionsFields()}
        {renderValidationFields()}
      </div>
    </div>
  );
};

export default FormElementsEdit;