import React from 'react';
import { ElementPreviewProps } from './types';

// Helper function to get display label
const getDisplayLabel = (element: any): string => {
  // If element has a proper label that's not generic, use it
  if (element.label && element.label !== 'Form Field' && element.label !== 'Form Element') {
    return element.label;
  }
  
  // Otherwise, determine label based on element type
  const elementType = element.element || element.type;
  const labelMap: Record<string, string> = {
    'DatePicker': 'Date Field',
    'TextInput': 'Text Field', 
    'TextArea': 'Text Area',
    'NumberInput': 'Number',
    'Dropdown': 'Select',
    'RadioButtons': 'Radio Group',
    'Checkboxes': 'Checkbox Group',
    'Paragraph': 'Paragraph',
    'Button': 'Button',
    'address': 'Address Field',
    'AddressComponent': 'Address Field',
    'SearchLookupComponent': 'Search Field'
  };
  
  return labelMap[elementType] || element.text || 'Form Field';
};

// Helper function to get display placeholder
const getDisplayPlaceholder = (element: any): string => {
  if (element.placeholder) {
    return element.placeholder;
  }
  
  const elementType = element.element || element.type;
  const placeholderMap: Record<string, string> = {
    'TextInput': 'Enter text here...',
    'NumberInput': 'Enter number here...',
    'TextArea': 'Enter your text here...',
    'DatePicker': 'Select date...',
    'Dropdown': 'Select an option...',
    'address': 'Enter address...',
    'AddressComponent': 'Enter address...',
    'SearchLookupComponent': 'Search...'
  };
  
  return placeholderMap[elementType] || getDisplayLabel(element);
};

const ElementPreview: React.FC<ElementPreviewProps> = ({ element }) => {
  const displayLabel = getDisplayLabel(element);
  const displayPlaceholder = getDisplayPlaceholder(element);

  const renderElement = () => {
    switch (element.element) {
      case 'Header':
        const level = element.level || 1;
        const headerProps = { children: element.text || displayLabel };
        switch (level) {
          case 1: return <h1 {...headerProps} />;
          case 2: return <h2 {...headerProps} />;
          case 3: return <h3 {...headerProps} />;
          case 4: return <h4 {...headerProps} />;
          case 5: return <h5 {...headerProps} />;
          case 6: return <h6 {...headerProps} />;
          default: return <h1 {...headerProps} />;
        }
      
      case 'Paragraph':
        return <p>{element.text || displayLabel}</p>;
      
      case 'LineBreak':
        return <hr />;
      
      case 'TextInput':
        return (
          <div className="form-group">
            <label>{displayLabel}</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder={displayPlaceholder}
              required={element.required}
            />
          </div>
        );
      
      case 'NumberInput':
        return (
          <div className="form-group">
            <label>{displayLabel}</label>
            <input 
              type="number" 
              className="form-control" 
              placeholder={displayPlaceholder}
              required={element.required}
            />
          </div>
        );
      
      case 'TextArea':
        return (
          <div className="form-group">
            <label>{displayLabel}</label>
            <textarea 
              className="form-control" 
              rows={element.rows || 4}
              placeholder={displayPlaceholder}
              required={element.required}
            />
          </div>
        );
      
      case 'Dropdown':
        return (
          <div className="form-group">
            <label>{displayLabel}</label>
            <select className="form-control" required={element.required}>
              <option value="">Select an option</option>
              {(element.options || []).map((option, index) => (
                <option key={index} value={option.value}>
                  {option.text}
                </option>
              ))}
            </select>
          </div>
        );
      
      case 'RadioButtons':
        return (
          <div className="form-group">
            <label>{displayLabel}</label>
            {(element.options || []).map((option, index) => (
              <div key={index} className="form-check">
                <input 
                  className="form-check-input" 
                  type="radio" 
                  name={element.field_name}
                  value={option.value}
                  required={element.required}
                />
                <label className="form-check-label">
                  {option.text}
                </label>
              </div>
            ))}
          </div>
        );
      
      case 'Checkboxes':
        return (
          <div className="form-group">
            <label>{displayLabel}</label>
            {(element.options || []).map((option, index) => (
              <div key={index} className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  value={option.value}
                />
                <label className="form-check-label">
                  {option.text}
                </label>
              </div>
            ))}
          </div>
        );
      
      case 'Button':
        return (
          <button
            type={'button'}
            className={'btn btn-primary'}
          >
            {element.text || displayLabel}
          </button>
        );
      
      case 'DatePicker':
        return (
          <div className="form-group">
            <label>{displayLabel}</label>
            <input 
              type="date" 
              className="form-control" 
              placeholder={displayPlaceholder}
              required={element.required}
            />
          </div>
        );
      
      case 'address':
      case 'AddressComponent':
        return (
          <div className="form-group">
            <label>{displayLabel}</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder={displayPlaceholder}
              required={element.required}
            />
          </div>
        );
      
      case 'SearchLookupComponent':
        return (
          <div className="form-group">
            <label>{displayLabel}</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder={displayPlaceholder}
              required={element.required}
            />
          </div>
        );
      
      default:
        return (
          <div className="form-group">
            <label>{displayLabel}</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder={displayPlaceholder}
              required={element.required}
            />
          </div>
        );
    }
  };

  return (
    <div className="element-preview">
      {renderElement()}
    </div>
  );
};

export default ElementPreview;