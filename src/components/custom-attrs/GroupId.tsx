import { getEnums } from '@/services/apiService';
import React, { useEffect, useState } from 'react';

interface EnumItem {
  id: number;
  name: string;
}

interface GroupIdComponentProps {
  selectedValue?: string;
  onSelectionChange?: (selectedId: string, selectedName?: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

const GroupIdComponent: React.FC<GroupIdComponentProps> = ({
  selectedValue = '',
  onSelectionChange,
  disabled = false,
  placeholder = 'Select a group...',
  className = ''
}) => {
  const [data, setData] = useState<EnumItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    getEnums()
      .then(response => {
        setData(response);
        console.log("Enums loaded:", response);
        setError('');
      })
      .catch(error => {
        console.error("Error loading enums:", error);
        setError('Failed to load options');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;

    if (onSelectionChange) {
      if (selectedId) {
        const selectedItem = data.find(item => item.id.toString() === selectedId);
        onSelectionChange(selectedId, selectedItem?.name);
      } else {
        onSelectionChange('', '');
      }
    }
  };

  if (loading) {
    return (
      <select 
        className={`form-control ${className}`} 
        disabled
        aria-label="Loading options..."
      >
        <option>Loading options...</option>
      </select>
    );
  }

  if (error) {
    return (
      <div className="group-id-error">
        <select 
          className={`form-control is-invalid ${className}`} 
          disabled
          aria-label="Error loading options"
        >
          <option>Error loading options</option>
        </select>
        <div className="invalid-feedback">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="group-id-component">
      <select 
        value={selectedValue} 
        onChange={handleSelectChange}
        disabled={disabled}
        className={`form-control form-control-sm ${className}`}
        aria-label="Select Group ID"
      >
        <option value="">{placeholder}</option>
        {data.map((item) => (
          <option key={item.id} value={item.id.toString()}>
            {item.name}
          </option>
        ))}
      </select>

      {/* Optional: Show selected item details */}
      {selectedValue && (
        <small className="form-text text-muted mt-1">
          Selected: {data.find(item => item.id.toString() === selectedValue)?.name || 'Unknown'}
        </small>
      )}
    </div>
  );
};

export default GroupIdComponent;