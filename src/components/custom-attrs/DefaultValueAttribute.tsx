/**
 * DEBUG VERSION: DefaultValueAttribute.tsx
 * This version always shows the dynamic builder for testing
 */

import React, { JSX, useState } from 'react';

interface OptionValue {
  value: string;
  text: string;
  key: string;
}

interface FormElementData {
  type?: string;
  element?: string;
  defaultValue?: string;
  defaultValues?: string[];
  values?: OptionValue[];
  [key: string]: any;
}

interface DefaultValueAttributeProps {
  formData: FormElementData;
  onInputChange: (field: string, value: any) => void;
  className?: string;
}

interface DefaultValueItem {
  id: string;
  type: 'select' | 'text';
  selectValue: string;
  textValue: string;
}

const DefaultValueAttribute: React.FC<DefaultValueAttributeProps> = ({
  formData,
  onInputChange,
  className = ''
}) => {
  const elementType = formData.type || formData.element || 'text';
  const currentDefaultValue = formData.defaultValue || '';

  // State for dynamic default value builder - Initialize with select type
  const [defaultValueItems, setDefaultValueItems] = useState<DefaultValueItem[]>([
    { id: '1', type: 'select', selectValue: '', textValue: '' }
  ]);

  // Available placeholder options
  const placeholderOptions = [
    { value: 'client', label: 'Client' },
    { value: 'company', label: 'Company' },
    { value: 'careerAdvisor', label: 'Career Advisor' }
  ];

  // Debug info
  console.log('DefaultValueAttribute Debug:', {
    formData,
    elementType,
    currentDefaultValue
  });

  /**
   * Add new default value item
   */
  const addDefaultValueItem = (): void => {
    const newItem: DefaultValueItem = {
      id: Date.now().toString(),
      type: 'select',
      selectValue: '',
      textValue: ''
    };
    setDefaultValueItems([...defaultValueItems, newItem]);
  };

  /**
   * Remove default value item
   */
  const removeDefaultValueItem = (id: string): void => {
    if (defaultValueItems.length > 1) {
      const updatedItems = defaultValueItems.filter(item => item.id !== id);
      setDefaultValueItems(updatedItems);
      updateFinalDefaultValue(updatedItems);
    }
  };

  /**
   * Update default value item
   */
  const updateDefaultValueItem = (id: string, field: 'type' | 'selectValue' | 'textValue', value: string): void => {
    const updatedItems = defaultValueItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    setDefaultValueItems(updatedItems);
    updateFinalDefaultValue(updatedItems);
  };

  /**
   * Generate final default value string and update parent
   */
  const updateFinalDefaultValue = (items: DefaultValueItem[]): void => {
    const finalValue = items.map(item => {
      if (item.type === 'select' && item.selectValue && item.textValue) {
        // Generate placeholder format like {careerAdvisor.FirstName} or {careerAdvisor.lsnflaefgn}
        return `{${item.selectValue}.${item.textValue}}`;
      }
      return '';
    }).filter(Boolean).join(' ');
    
    onInputChange('defaultValue', finalValue);
  };

  /**
   * Render dynamic default value builder
   */
  const renderDynamicDefaultValueBuilder = (): JSX.Element => {
    return (
      // <div className="dynamic-default-value-builder">
      <div >
        <h5>Dynamic Default Value Builder</h5>
        <small className="text-muted d-block mb-3">
          Select a source and enter the property name to build dynamic values like {`{careerAdvisor.FirstName}`}
        </small>

        {defaultValueItems.map((item, index) => (
          <div key={item.id} className="default-value-item border rounded p-3 mb-3">
            <div className="row align-items-end g-4">
              <div className="col-md-12">
                <label className="form-label">Select Source</label>
                <select
                  className="form-control form-control-sm"
                  value={item.selectValue}
                  onChange={(e) => updateDefaultValueItem(item.id, 'selectValue', e.target.value)}
                >
                  <option value="">Choose source...</option>
                  {placeholderOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-12">
                <label className="form-label">Property Name</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={item.textValue}
                  onChange={(e) => updateDefaultValueItem(item.id, 'textValue', e.target.value)}
                  placeholder="e.g., FirstName, LastName, or any text..."
                />
              </div>

              <div className="col-md-4">
                <div className="d-flex gap-2">
                  {index === defaultValueItems.length - 1 && (
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={addDefaultValueItem}
                      title="Add new item"
                    >
                      + Add
                    </button>
                  )}
                  {defaultValueItems.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => removeDefaultValueItem(item.id)}
                      title="Remove item"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Preview for this item */}
            <div className="mt-4">
              <small className="text-muted">
                Preview: 
                <code className="ms-1">
                  {item.selectValue && item.textValue 
                    ? `{${item.selectValue}.${item.textValue}}`
                    : item.selectValue 
                    ? `{${item.selectValue}.___}` 
                    : 'Select source and enter property name'
                  }
                </code>
              </small>
            </div>
          </div>
        ))}

        {/* Final Result Preview */}
        <div className="alert alert-info">
          <strong>Final Default Value:</strong>
          <br />
          <code>{currentDefaultValue || 'No value generated yet'}</code>
        </div>
      </div>
    );
  };

  return (
    <div className={`default-value-fields ${className}`}>
      <h4>Default Value Configuration</h4>
        {renderDynamicDefaultValueBuilder()}
      </div>
  );
};

export default DefaultValueAttribute;