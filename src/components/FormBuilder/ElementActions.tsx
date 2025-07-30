import React from 'react';
import { ElementActionsProps } from './types';

const ElementActions: React.FC<ElementActionsProps> = ({
  index,
  totalElements,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete
}) => {
  return (
    <div className="element-actions">
      <div className="btn-group" role="group">
        <button 
          className="btn btn-sm btn-outline-secondary"
          onClick={() => onMoveUp(index)}
          disabled={index === 0}
          title="Move Up"
        >
          <i className="fas fa-arrow-up"></i>
        </button>
        <button 
          className="btn btn-sm btn-outline-secondary"
          onClick={() => onMoveDown(index)}
          disabled={index === totalElements - 1}
          title="Move Down"
        >
          <i className="fas fa-arrow-down"></i>
        </button>
        <button 
          className="btn btn-sm btn-outline-primary"
          onClick={onEdit}
          title="Edit Element"
        >
          <i className="fas fa-edit"></i>
        </button>
        <button 
          className="btn btn-sm btn-outline-danger"
          onClick={onDelete}
          title="Delete Element"
        >
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </div>
  );
};

export default ElementActions;
