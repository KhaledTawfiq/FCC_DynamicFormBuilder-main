import React, { useState } from 'react';
import type { FormConfigurationProps, FormConfig } from '../../types';

/**
 * Modern Form Configuration Component
 */
const FormConfiguration: React.FC<FormConfigurationProps> = ({ 
  formConfig, 
  onConfigChange,
  disabled = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const handleInputChange = (field: keyof FormConfig, value: string | number | boolean) => {
    onConfigChange({
      ...formConfig,
      [field]: value,
    });
  };

  return (
    <div className="modern-form-configuration">
      {/* Header Section */}
      <div className="config-header">
        <div className="header-content">
          <div className="header-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="header-text">
            <h2>Form Configuration</h2>
          </div>
        </div>
        <button 
          className={`toggle-btn ${isExpanded ? 'expanded' : ''}`}
          onClick={() => setIsExpanded(!isExpanded)}
          type="button"
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Configuration Content */}
      <div className={`config-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <div className="config-grid">
          {/* Combined Information Section */}
          <div className="config-section combined-section">
            <div className="row">
                <div className="col-md-6">
                <div className="input-wrapper">
                  <label htmlFor="formTitle" className="modern-label">
                  <span className="label-icon">📝</span>
                  Form Title
                  <span className="label-required">*</span>
                  </label>
                  <input
                  type="text"
                  className="modern-input"
                  id="formTitle"
                  value={formConfig.formTitle || ''}
                  onChange={(e) => handleInputChange('formTitle', e.target.value)}
                  disabled={disabled}
                  placeholder="Enter your form title..."
                  />
                </div>
                </div>
                <div className="col-md-6">
                <div className="input-wrapper">
                  <label htmlFor="formKey" className="modern-label">
                  <span className="label-icon">🔑</span>
                  Form Key
                  <span className="label-required">*</span>
                  </label>
                  <input
                  type="text"
                  className="modern-input"
                  id="formKey"
                  value={formConfig.formKey}
                  onChange={(e) => handleInputChange('formKey', e.target.value)}
                  disabled={disabled}
                  placeholder="unique-form-key"
                  />
                  <small className="input-hint">Unique identifier for this form</small>
                </div>
                </div>
                <div className="col-md-6">
                <div className="input-wrapper">
                  <label htmlFor="companyId" className="modern-label">
                  <span className="label-icon">🏢</span>
                  Company ID
                  </label>
                  <input
                  type="text"
                  className="modern-input"
                  id="companyId"
                  value={formConfig.companyId}
                  onChange={(e) => handleInputChange('companyId', e.target.value)}
                  disabled={disabled}
                  placeholder="company-identifier"
                  />
                </div>
                </div>
                <div className="col-md-6">
                <div className="input-wrapper">
                  <label htmlFor="version" className="modern-label">
                  <span className="label-icon">🔢</span>
                  Version
                  </label>
                  <input
                  type="text"
                  className="modern-input"
                  id="version"
                  value={formConfig.version}
                  onChange={(e) => handleInputChange('version', e.target.value)}
                  disabled={disabled}
                  placeholder="1.0.0"
                  />
                  <small className="input-hint">Semantic version number</small>
                </div>
                </div>

            </div>
          </div>

     
        </div>
      </div>
    </div>
  );
};

export default FormConfiguration;
