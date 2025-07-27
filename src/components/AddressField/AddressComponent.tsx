import { AddressFieldConfig, AddressValidationResult } from '@/types';
import React, { useState, useEffect, useRef } from 'react';

interface AddressComponentProps {
  config: AddressFieldConfig;
  value?: string;
  onChange?: (value: string) => void;
  onValidation?: (result: AddressValidationResult) => void;
  className?: string;
  disabled?: boolean;
}

/**
 * Address Component
 * Renders different address input formats based on configuration
 */
const AddressComponent: React.FC<AddressComponentProps> = ({
  config,
  value = '',
  onChange,
  onValidation,
  className = '',
  disabled = false
}) => {
  const [addressValue, setAddressValue] = useState(value);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<AddressValidationResult | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [structuredAddress, setStructuredAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Update local state when value prop changes
  useEffect(() => {
    setAddressValue(value);
    
    // If structured format, try to parse the value
    if (config.addressFormat === 'structured' && value) {
      parseStructuredAddress(value);
    }
  }, [value, config.addressFormat]);

  // Parse structured address from string
  const parseStructuredAddress = (addressString: string) => {
    // Simple parsing logic - in real implementation, you'd use a proper address parser
    const parts = addressString.split(',').map(part => part.trim());
    
    setStructuredAddress({
      street: parts[0] || '',
      city: parts[1] || '',
      state: parts[2] || '',
      zip: parts[3] || '',
      country: parts[4] || ''
    });
  };

  // Format structured address to string
  const formatStructuredAddress = (components: typeof structuredAddress): string => {
    const parts = [
      components.street,
      components.city,
      components.state,
      components.zip,
      components.country
    ].filter(part => part.trim() !== '');
    
    return parts.join(', ');
  };

  // Handle input change
  const handleInputChange = (newValue: string) => {
    setAddressValue(newValue);
    
    if (onChange) {
      onChange(newValue);
    }
    
    // Trigger autocomplete if enabled
    if (config.enableAutocomplete && newValue.length > 2) {
      debouncedAutocomplete(newValue);
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle structured address component change
  const handleStructuredChange = (field: keyof typeof structuredAddress, newValue: string) => {
    const updatedAddress = {
      ...structuredAddress,
      [field]: newValue
    };
    
    setStructuredAddress(updatedAddress);
    
    const formattedAddress = formatStructuredAddress(updatedAddress);
    setAddressValue(formattedAddress);
    
    if (onChange) {
      onChange(formattedAddress);
    }
  };

  // Debounced autocomplete function
  const debouncedAutocomplete = (() => {
    let timeoutId: NodeJS.Timeout;
    return (query: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        performAutocomplete(query);
      }, 300);
    };
  })();

  // Mock autocomplete function (replace with real implementation)
  const performAutocomplete = async (query: string) => {
    try {
      // Mock implementation - replace with real geocoding service
      const mockSuggestions = [
        `${query} Street, City, State`,
        `${query} Avenue, Another City, State`,
        `${query} Boulevard, Third City, State`
      ];
      
      setSuggestions(mockSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Autocomplete error:', error);
      setShowSuggestions(false);
    }
  };

  // Validate address
  const validateAddress = async (address: string) => {
    if (!config.validateAddress || !address.trim()) {
      return;
    }
    
    setIsValidating(true);
    
    try {
      // Mock validation - replace with real address validation service
      const isValid = address.length > 10 && address.includes(',');
      
      const result: AddressValidationResult = {
        isValid,
        message: isValid ? 'Address is valid' : 'Please enter a complete address',
        formattedAddress: isValid ? address : undefined
      };
      
      setValidationResult(result);
      
      if (onValidation) {
        onValidation(result);
      }
    } catch (error) {
      console.error('Address validation error:', error);
      setValidationResult({
        isValid: false,
        message: 'Unable to validate address'
      });
    } finally {
      setIsValidating(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: string) => {
    setAddressValue(suggestion);
    setShowSuggestions(false);
    
    if (onChange) {
      onChange(suggestion);
    }
    
    if (config.validateAddress) {
      validateAddress(suggestion);
    }
  };

  // Handle blur event
  const handleBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
    
    if (config.validateAddress) {
      validateAddress(addressValue);
    }
  };

  // Get CSS classes
  const getFieldClasses = () => {
    const baseClasses = `address-field ${className}`;
    const formatClass = `address-format-${config.addressFormat || 'single'}`;
    const validationClass = validationResult 
      ? validationResult.isValid 
        ? 'address-valid' 
        : 'address-invalid'
      : '';
    const loadingClass = isValidating ? 'address-loading' : '';
    
    return `${baseClasses} ${formatClass} ${validationClass} ${loadingClass}`.trim();
  };

  // Render single line address input
  const renderSingleLineInput = () => (
    <div className={config.enableAutocomplete ? 'address-autocomplete' : ''}>
      <input
        ref={inputRef}
        type="text"
        className="form-control address-input"
        value={addressValue}
        onChange={(e) => handleInputChange(e.target.value)}
        onBlur={handleBlur}
        placeholder={config.placeholder || 'Enter your address...'}
        disabled={disabled}
        maxLength={config.maxlength || 500}
        required={config.required}
      />
      
      {config.enableAutocomplete && showSuggestions && suggestions.length > 0 && (
        <div ref={suggestionsRef} className="autocomplete-suggestions">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => handleSuggestionSelect(suggestion)}
            >
              <div className="suggestion-main">{suggestion}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Render multi-line address input
  const renderMultiLineInput = () => (
    <div className="address-multi">
      <div className="address-line">
        <input
          type="text"
          className="form-control"
          placeholder="Street Address"
          value={structuredAddress.street}
          onChange={(e) => handleStructuredChange('street', e.target.value)}
          disabled={disabled}
        />
      </div>
      <div className="address-line">
        <input
          type="text"
          className="form-control"
          placeholder="City, State, ZIP"
          value={`${structuredAddress.city}, ${structuredAddress.state}, ${structuredAddress.zip}`.replace(/^, |, $/g, '')}
          onChange={(e) => {
            const parts = e.target.value.split(',').map(p => p.trim());
            handleStructuredChange('city', parts[0] || '');
            handleStructuredChange('state', parts[1] || '');
            handleStructuredChange('zip', parts[2] || '');
          }}
          disabled={disabled}
        />
      </div>
      {!config.restrictToCountry && (
        <div className="address-line">
          <input
            type="text"
            className="form-control"
            placeholder="Country"
            value={structuredAddress.country}
            onChange={(e) => handleStructuredChange('country', e.target.value)}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );

  // Render structured address input
  const renderStructuredInput = () => (
    <div className="address-structured">
      <div className="address-street">
        <input
          type="text"
          className="form-control"
          placeholder="Street Address"
          value={structuredAddress.street}
          onChange={(e) => handleStructuredChange('street', e.target.value)}
          disabled={disabled}
        />
      </div>
      <div className="address-city">
        <input
          type="text"
          className="form-control"
          placeholder="City"
          value={structuredAddress.city}
          onChange={(e) => handleStructuredChange('city', e.target.value)}
          disabled={disabled}
        />
      </div>
      <div className="address-state">
        <input
          type="text"
          className="form-control"
          placeholder="State"
          value={structuredAddress.state}
          onChange={(e) => handleStructuredChange('state', e.target.value)}
          disabled={disabled}
        />
      </div>
      <div className="address-zip">
        <input
          type="text"
          className="form-control"
          placeholder="ZIP Code"
          value={structuredAddress.zip}
          onChange={(e) => handleStructuredChange('zip', e.target.value)}
          disabled={disabled}
        />
      </div>
      {!config.restrictToCountry && (
        <div className="address-country">
          <select
            className="form-control"
            value={structuredAddress.country}
            onChange={(e) => handleStructuredChange('country', e.target.value)}
            disabled={disabled}
          >
            <option value="">Select Country</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="AU">Australia</option>
            {/* Add more countries as needed */}
          </select>
        </div>
      )}
    </div>
  );

  // Render validation message
  const renderValidationMessage = () => {
    if (!validationResult) return null;
    
    return (
      <div className={`address-validation-message validation-${validationResult.isValid ? 'success' : 'error'}`}>
        {validationResult.message}
      </div>
    );
  };

  return (
    <div className={getFieldClasses()}>
      {config.addressFormat === 'single' && renderSingleLineInput()}
      {config.addressFormat === 'multi' && renderMultiLineInput()}
      {config.addressFormat === 'structured' && renderStructuredInput()}
      {config.validateAddress && renderValidationMessage()}
    </div>
  );
};

export default AddressComponent;