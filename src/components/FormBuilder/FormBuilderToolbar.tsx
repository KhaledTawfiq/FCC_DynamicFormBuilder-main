import React from 'react';
import { FormBuilderToolbarProps } from './types';

const FormBuilderToolbar: React.FC<FormBuilderToolbarProps> = ({
  toolbarItems,
  onAddElement
}) => {
    console.log(toolbarItems, 'Toolbar Items');
  return (
    <div className="col-md-3">
      <div className="form-builder-toolbar">
        <div className="toolbar-header">
          <h4>Toolbox</h4>
          <div className="toolbar-subtitle">Click elements to add to form</div>
        </div>
        
        <ul className="form-elements">
          {toolbarItems.map((item, index) => (
            <li
              key={`${item.key}_${index}`}
              className="toolbar-item"
              data-element-type={item.element || item.key}
              onClick={() => onAddElement(item)}
            >
              <i className={`${item.icon}`}></i>
              <span className="element-name">{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FormBuilderToolbar;
