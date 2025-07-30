import React from 'react';
import { ElementPreviewProps } from './types';

const ElementPreview: React.FC<ElementPreviewProps> = ({ element }) => {
  const renderElement = () => {
    switch (element.element) {
      case 'Header':
        const level = element.level || 1;
        const headerProps = { children: element.text || element.label };
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
        return <p>{element.text || element.label}</p>;
      
      case 'LineBreak':
        return <hr />;
      
      case 'TextInput':
        return (
          <div className="form-group">
            <label>{element.label}</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder={element.placeholder || element.label}
              required={element.required}
            />
          </div>
        );
      
      case 'NumberInput':
        return (
          <div className="form-group">
            <label>{element.label}</label>
            <input 
              type="number" 
              className="form-control" 
              placeholder={element.placeholder || element.label}
              required={element.required}
            />
          </div>
        );
      
      case 'TextArea':
        return (
          <div className="form-group">
            <label>{element.label}</label>
            <textarea 
              className="form-control" 
              rows={element.rows || 4}
              placeholder={element.placeholder || element.label}
              required={element.required}
            />
          </div>
        );
      
      case 'Dropdown':
        return (
          <div className="form-group">
            <label>{element.label}</label>
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
            <label>{element.label}</label>
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
            <label>{element.label}</label>
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
                {element.text || element.label}
            </button>
        );
      default:
        return (
         <div className="form-group">
            <label>{element.label}</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder={element.placeholder || element.label}
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
