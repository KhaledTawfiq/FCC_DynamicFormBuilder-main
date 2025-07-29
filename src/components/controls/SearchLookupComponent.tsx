import React from 'react';

interface SearchLookupComponentProps {
  name?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  placeholder?: string;
}

export const SearchLookupComponent: React.FC<SearchLookupComponentProps> = (props) => {
  const { 
    name, 
    defaultValue, 
    disabled, 
    required,
    className = '',
    placeholder = 'Enter text...'
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