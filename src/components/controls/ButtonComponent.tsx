import React from 'react';

interface ButtonComponentProps {
  name?: string;
  content?: string;
  value?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const ButtonComponent: React.FC<ButtonComponentProps> = (props) => {
  const { 
    name, 
    content,
    value,
    disabled, 
    className = '',
    label
  } = props;

  const buttonText = content || value || label || 'Button';

  return (
    <button
      type="button"
      name={name}
      disabled={disabled}
      className={`btn btn-primary ${className}`}
    >
      {buttonText}
    </button>
  );
};