import React from 'react';
import type { FormConfigurationProps, FormConfig } from '../../types';

/**
 * Form configuration component
 */
const FormConfiguration: React.FC<FormConfigurationProps> = ({ 
  formConfig, 
  onConfigChange,
  disabled = false 
}) => {  const handleInputChange = (field: keyof FormConfig, value: string | number | boolean) => {
    onConfigChange({
      ...formConfig,
      [field]: value,
    });
  };
  return (
    <div className="form-configuration">
      <h2>Form Builder</h2>
      <div className="row">
        <div className="col-6">
          <div className="mb-3">
            <label htmlFor="formTitle" className="form-label">
              Form Title
            </label>
            <input
              type="text"
              className="form-control"
              id="formTitle"
              value={formConfig.formTitle || ''}
              onChange={(e) => handleInputChange('formTitle', e.target.value)}
              disabled={disabled}
            />
          </div>
        </div>
        <div className="col-6">
          <div className="mb-3">
            <label htmlFor="formKey" className="form-label">
              Form Key
            </label>
            <input
              type="text"
              className="form-control"
              id="formKey"
              value={formConfig.formKey}
              onChange={(e) => handleInputChange('formKey', e.target.value)}
              disabled={disabled}
            />
          </div>
        </div>
        <div className="col-6">
          <div className="mb-3">
            <label htmlFor="companyId" className="form-label">
              Company ID
            </label>
            <input
              type="text"
              className="form-control"
              id="companyId"
              value={formConfig.companyId}
              onChange={(e) => handleInputChange('companyId', e.target.value)}
              disabled={disabled}
            />
          </div>
        </div>
        <div className="col-6">
          <div className="mb-3">
            <label htmlFor="version" className="form-label">
              Version
            </label>
            <input
              type="text"
              className="form-control"
              id="version"
              value={formConfig.version}
              onChange={(e) => handleInputChange('version', e.target.value)}
              disabled={disabled}
            />
          </div>        </div>
      </div>
    </div>
  );
};

export default FormConfiguration;
