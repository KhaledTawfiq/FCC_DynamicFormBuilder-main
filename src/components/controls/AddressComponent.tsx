import React from 'react';

interface AddressComponentProps {
  name?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  placeholder?: string;
}

export const AddressComponent: React.FC<AddressComponentProps> = (props) => {
  const { 
    name, 
    defaultValue, 
    disabled, 
    required,
    className = '',
    placeholder = 'Enter address...'
  } = props;

  return (
    <input
      type="text"
      name={name}
      defaultValue={defaultValue}
      disabled={disabled}
      required={required}
      className={`form-control ${className}`}
      placeholder={placeholder}
    />
  );
};