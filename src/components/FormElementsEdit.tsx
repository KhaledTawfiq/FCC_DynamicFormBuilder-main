/**
 * FormElementsEdit Component with Minimal DefaultValueAttribute Integration
 * Just imports and uses the external DefaultValueAttribute component
 */

import React, { useState, useEffect, useCallback } from 'react';
import DefaultValueAttribute from './custom-attrs/DefaultValueAttribute';
import GroupIdComponent from './custom-attrs/GroupId';
import { generateElementName, EventRule, ReadOnlyCondition } from '../config/elementDefaults';

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
  key?: string; // Add this
  label?: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  defaultValue?: string;
  defaultValues?: string[];
  readOnly?: boolean;
  readOnlyCondition?: ReadOnlyCondition;
  maxlength?: number;
  access?: boolean;
  other?: string;
  groupId?: string;
  condition?: string;
  values?: OptionValue[];
  validations?: ValidationRule[];
  Events?: EventRule[];
  // Address-specific properties
  includeAddressCountry?: boolean;
  includeAddressApartment?: boolean;
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
      } else if (field === 'Events') {
        updatedElement[field].push({ Type: 'getOptions', On: 'render', Url: '', Parameters: '' });
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

      {/* Read Only Field */}
      <div className="form-group">
        <div className="form-check">
          <input
            id="element_readonly"
            type="checkbox"
            className="form-check-input"
            checked={formData.readOnly || false}
            onChange={(e) => handleInputChange('readOnly', e.target.checked)}
          />
          <label className="form-check-label" htmlFor="element_readonly">
            Read Only
          </label>
        </div>
      </div>
    </div>
  );

const renderAdvancedFields = () => {
  // Check if this is an address component
  const isAddressComponent = formData.key === 'AddressComponent';

  return (
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

      {/* Default Value Field - REMOVED - Now handled by external component */}
      {/* Default Value Field with Token Support for Text Input */}
      {formData.type === 'text' ? (
        <div className="form-group">
          <label htmlFor="element_default_value">Default Value (with Token Support)</label>
          <div className="row">
            <div className="col-md-4">
              <select
                className="form-control form-control-sm"
                onChange={(e) => {
                  const entity = e.target.value;
                  if (entity) {
                    const currentValue = formData.defaultValue || '';
                    const tokenPrefix = `{${entity}.`;
                    if (!currentValue.includes(tokenPrefix)) {
                      handleInputChange('defaultValue', currentValue + tokenPrefix + '}');
                    }
                  }
                }}
              >
                <option value="">Select Entity</option>
                <option value="client">Client</option>
                <option value="company">Company</option>
                <option value="careerAdvisor">Career Advisor</option>
              </select>
            </div>
            <div className="col-md-8">
              <input
                id="element_default_value"
                type="text"
                className="form-control form-control-sm"
                value={formData.defaultValue || ''}
                onChange={(e) => handleInputChange('defaultValue', e.target.value)}
                placeholder="Enter default value or use tokens like {careerAdvisor.FirstName}"
              />
            </div>
          </div>
          <small className="form-text text-muted">
            💡 Use tokens like {'{careerAdvisor.FirstName}'} or {'{client.LastName}'} for dynamic values
          </small>
        </div>
      ) : (
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
      )}

      {/* Max Length Field */}
      {['text', 'textarea', 'number'].includes(formData.type || '') && (
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

      {/* Address-specific options - Show for AddressComponent */}
      {isAddressComponent && (
        <>
          {/* Include Address Country */}
          <div className="form-group">
            <div className="form-check">
              <input
                id="element_include_country"
                type="checkbox"
                className="form-check-input"
                checked={formData.includeAddressCountry !== false}
                onChange={(e) => {
                  console.log('Country checkbox changed to:', e.target.checked);
                  handleInputChange('includeAddressCountry', e.target.checked);
                }}
              />
              <label className="form-check-label" htmlFor="element_include_country">
                Include Country Field
              </label>
            </div>
          </div>

          {/* Include Address Apartment */}
          <div className="form-group">
            <div className="form-check">
              <input
                id="element_include_apartment"
                type="checkbox"
                className="form-check-input"
                checked={formData.includeAddressApartment !== false}
                onChange={(e) => {
                  console.log('Apartment checkbox changed to:', e.target.checked);
                  handleInputChange('includeAddressApartment', e.target.checked);
                }}
              />
              <label className="form-check-label" htmlFor="element_include_apartment">
                Include Apartment/Unit Field
              </label>
            </div>
          </div>
        </>
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

      {/* Group ID Field - REPLACED WITH CUSTOM COMPONENT */}
      <div className="form-group">
        <label htmlFor="element_group_id">Group ID</label>
        <div className="group-id-wrapper">
          <GroupIdComponent 
            selectedValue={formData.groupId || ''}
            onSelectionChange={(selectedId, selectedName) => {
              console.log('GroupId selection changed:', { id: selectedId, name: selectedName });
              handleInputChange('groupId', selectedId);
            }}
          />
        </div>
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

      {/* Read Only Condition Fields */}
      <div className="form-group">
        <h5>Read Only Condition</h5>
        <div className="row">
          <div className="col-md-4">
            <label>Field</label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={formData.readOnlyCondition?.field || ''}
              onChange={(e) => {
                const updatedCondition = {
                  ...formData.readOnlyCondition,
                  field: e.target.value
                };
                handleInputChange('readOnlyCondition', updatedCondition);
              }}
              placeholder="Field name or token like {careerAdvisor.FirstName}"
            />
          </div>
          <div className="col-md-4">
            <label>Type</label>
            <select
              className="form-control form-control-sm"
              value={formData.readOnlyCondition?.type || '10'}
              onChange={(e) => {
                const updatedCondition = {
                  ...formData.readOnlyCondition,
                  type: e.target.value
                };
                handleInputChange('readOnlyCondition', updatedCondition);
              }}
            >
              <option value="10">hasValue</option>
            </select>
          </div>
          <div className="col-md-4">
            <label>Value</label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={formData.readOnlyCondition?.value || ''}
              onChange={(e) => {
                const updatedCondition = {
                  ...formData.readOnlyCondition,
                  value: e.target.value
                };
                handleInputChange('readOnlyCondition', updatedCondition);
              }}
              placeholder="Comparison value"
            />
          </div>
        </div>
        <small className="form-text text-muted">
          💡 Field supports tokens like {'{careerAdvisor.FirstName}'} for dynamic comparisons
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

  const renderEventsFields = () => {
    const events = formData.Events || [];
    
    return (
      <div className="events-fields">
        <h4>Events</h4>
        
        {events.map((event: EventRule, index: number) => (
          <div key={index} className="event-item border p-3 mb-2 rounded">
            <div className="row">
              <div className="col-md-3">
                <label>Type</label>
                <select
                  className="form-control form-control-sm"
                  value={event?.Type || ''}
                  onChange={(e) => handleArrayChange('Events', index, 'Type', e.target.value)}
                >
                  <option value="getOptions">getOptions</option>
                </select>
              </div>
              <div className="col-md-3">
                <label>Trigger</label>
                <select
                  className="form-control form-control-sm"
                  value={event?.On || ''}
                  onChange={(e) => handleArrayChange('Events', index, 'On', e.target.value)}
                >
                  <option value="render">render</option>
                </select>
              </div>
              <div className="col-md-2">
                <label>URL</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={event?.Url || ''}
                  onChange={(e) => handleArrayChange('Events', index, 'Url', e.target.value)}
                  placeholder="API endpoint"
                />
              </div>
              <div className="col-md-3">
                <label>Parameters</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={event?.Parameters || ''}
                  onChange={(e) => handleArrayChange('Events', index, 'Parameters', e.target.value)}
                  placeholder="Query parameters"
                />
              </div>
              <div className="col-md-1">
                <label>&nbsp;</label>
                <button
                  type="button"
                  className="btn btn-sm btn-danger d-block"
                  onClick={() => removeArrayItem('Events', index)}
                  title="Remove event"
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
          onClick={() => addArrayItem('Events')}
        >
          + Add Event
        </button>
      </div>
    );
  };

  return (
    <div className={`custom-form-elements-edit ${className}`}>
      <div className="edit-form-content">
        {renderBasicFields()}
        
        {/* ✅ External DefaultValueAttribute Component - ONLY default value logic */}
        <DefaultValueAttribute
          formData={formData}
          onInputChange={handleInputChange}
        />
        
        {renderAdvancedFields()}
        {renderOptionsFields()}
        {renderValidationFields()}
        {renderEventsFields()}
      </div>
    </div>
  );
};

export default FormElementsEdit;