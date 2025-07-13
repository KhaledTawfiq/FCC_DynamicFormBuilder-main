import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import FormConfiguration from '../src/components/FormConfiguration/FormConfiguration';
import type { FormConfig } from '../src/types';

describe('FormConfiguration', () => {
  const mockFormConfig: FormConfig = {
    formTitle: 'Test Form',
    formKey: 'test-form',
    companyId: 'test-company',
    version: '1.0.0'
  };

  const defaultProps = {
    formConfig: mockFormConfig,
    onConfigChange: jest.fn(),
    disabled: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders all form fields', () => {
      render(<FormConfiguration {...defaultProps} />);
      
      expect(screen.getByLabelText('Form Title')).toBeTruthy();
      expect(screen.getByLabelText('Form Key')).toBeTruthy();
      expect(screen.getByLabelText('Company ID')).toBeTruthy();
      expect(screen.getByLabelText('Version')).toBeTruthy();
    });

    it('renders the main heading', () => {
      render(<FormConfiguration {...defaultProps} />);
      expect(screen.getByText('Form Builder')).toBeTruthy();
    });

    it('displays current form configuration values', () => {
      render(<FormConfiguration {...defaultProps} />);
      
      const titleInput = screen.getByLabelText('Form Title') as HTMLInputElement;
      const keyInput = screen.getByLabelText('Form Key') as HTMLInputElement;
      const companyIdInput = screen.getByLabelText('Company ID') as HTMLInputElement;
      const versionInput = screen.getByLabelText('Version') as HTMLInputElement;
      
      expect(titleInput.value).toBe('Test Form');
      expect(keyInput.value).toBe('test-form');
      expect(companyIdInput.value).toBe('test-company');
      expect(versionInput.value).toBe('1.0.0');
    });
  });

  describe('Form Interaction', () => {
    it('calls onConfigChange when Form Title changes', () => {
      render(<FormConfiguration {...defaultProps} />);
      
      const titleInput = screen.getByLabelText('Form Title');
      fireEvent.change(titleInput, { target: { value: 'New Title' } });
      
      expect(defaultProps.onConfigChange).toHaveBeenCalledWith({
        ...mockFormConfig,
        formTitle: 'New Title'
      });
    });

    it('calls onConfigChange when Form Key changes', () => {
      render(<FormConfiguration {...defaultProps} />);
      
      const keyInput = screen.getByLabelText('Form Key');
      fireEvent.change(keyInput, { target: { value: 'new-key' } });
      
      expect(defaultProps.onConfigChange).toHaveBeenCalledWith({
        ...mockFormConfig,
        formKey: 'new-key'
      });
    });

    it('calls onConfigChange when Company ID changes', () => {
      render(<FormConfiguration {...defaultProps} />);
      
      const companyIdInput = screen.getByLabelText('Company ID');
      fireEvent.change(companyIdInput, { target: { value: 'new-company' } });
      
      expect(defaultProps.onConfigChange).toHaveBeenCalledWith({
        ...mockFormConfig,
        companyId: 'new-company'
      });
    });

    it('calls onConfigChange when Version changes', () => {
      render(<FormConfiguration {...defaultProps} />);
      
      const versionInput = screen.getByLabelText('Version');
      fireEvent.change(versionInput, { target: { value: '2.0.0' } });
      
      expect(defaultProps.onConfigChange).toHaveBeenCalledWith({
        ...mockFormConfig,
        version: '2.0.0'
      });
    });

    it('handles multiple rapid changes correctly', () => {
      render(<FormConfiguration {...defaultProps} />);
      
      const titleInput = screen.getByLabelText('Form Title');
      
      fireEvent.change(titleInput, { target: { value: 'First' } });
      fireEvent.change(titleInput, { target: { value: 'Second' } });
      fireEvent.change(titleInput, { target: { value: 'Third' } });
      
      expect(defaultProps.onConfigChange).toHaveBeenCalledTimes(3);
      expect(defaultProps.onConfigChange).toHaveBeenLastCalledWith({
        ...mockFormConfig,
        formTitle: 'Third'
      });
    });
  });

  describe('Disabled State', () => {
    it('disables all inputs when disabled prop is true', () => {
      render(<FormConfiguration {...defaultProps} disabled={true} />);
      
      const titleInput = screen.getByLabelText('Form Title') as HTMLInputElement;
      const keyInput = screen.getByLabelText('Form Key') as HTMLInputElement;
      const companyIdInput = screen.getByLabelText('Company ID') as HTMLInputElement;
      const versionInput = screen.getByLabelText('Version') as HTMLInputElement;
      
      expect(titleInput.disabled).toBe(true);
      expect(keyInput.disabled).toBe(true);
      expect(companyIdInput.disabled).toBe(true);
      expect(versionInput.disabled).toBe(true);
    });

    it('enables all inputs when disabled prop is false', () => {
      render(<FormConfiguration {...defaultProps} disabled={false} />);
      
      const titleInput = screen.getByLabelText('Form Title') as HTMLInputElement;
      const keyInput = screen.getByLabelText('Form Key') as HTMLInputElement;
      const companyIdInput = screen.getByLabelText('Company ID') as HTMLInputElement;
      const versionInput = screen.getByLabelText('Version') as HTMLInputElement;
      
      expect(titleInput.disabled).toBe(false);
      expect(keyInput.disabled).toBe(false);
      expect(companyIdInput.disabled).toBe(false);
      expect(versionInput.disabled).toBe(false);
    });

    it('enables all inputs when disabled prop is not provided', () => {
      render(<FormConfiguration formConfig={mockFormConfig} onConfigChange={jest.fn()} />);
      
      const titleInput = screen.getByLabelText('Form Title') as HTMLInputElement;
      const keyInput = screen.getByLabelText('Form Key') as HTMLInputElement;
      const companyIdInput = screen.getByLabelText('Company ID') as HTMLInputElement;
      const versionInput = screen.getByLabelText('Version') as HTMLInputElement;
      
      expect(titleInput.disabled).toBe(false);
      expect(keyInput.disabled).toBe(false);
      expect(companyIdInput.disabled).toBe(false);
      expect(versionInput.disabled).toBe(false);
    });
  });

  describe('Empty Values', () => {
    const emptyFormConfig: FormConfig = {
      formTitle: '',
      formKey: '',
      companyId: '',
      version: ''
    };

    it('handles empty form configuration values', () => {
      render(
        <FormConfiguration 
          formConfig={emptyFormConfig} 
          onConfigChange={jest.fn()} 
        />
      );
      
      const titleInput = screen.getByLabelText('Form Title') as HTMLInputElement;
      const keyInput = screen.getByLabelText('Form Key') as HTMLInputElement;
      const companyIdInput = screen.getByLabelText('Company ID') as HTMLInputElement;
      const versionInput = screen.getByLabelText('Version') as HTMLInputElement;
      
      expect(titleInput.value).toBe('');
      expect(keyInput.value).toBe('');
      expect(companyIdInput.value).toBe('');
      expect(versionInput.value).toBe('');
    });

    it('can change from empty to filled values', () => {
      const onConfigChange = jest.fn();
      render(
        <FormConfiguration 
          formConfig={emptyFormConfig} 
          onConfigChange={onConfigChange} 
        />
      );
      
      const titleInput = screen.getByLabelText('Form Title');
      fireEvent.change(titleInput, { target: { value: 'New Form' } });
      
      expect(onConfigChange).toHaveBeenCalledWith({
        formTitle: 'New Form',
        formKey: '',
        companyId: '',
        version: ''
      });
    });
  });

  describe('Input Attributes', () => {
    it('has correct input types', () => {
      render(<FormConfiguration {...defaultProps} />);
      
      const titleInput = screen.getByLabelText('Form Title') as HTMLInputElement;
      const keyInput = screen.getByLabelText('Form Key') as HTMLInputElement;
      const companyIdInput = screen.getByLabelText('Company ID') as HTMLInputElement;
      const versionInput = screen.getByLabelText('Version') as HTMLInputElement;
      
      expect(titleInput.type).toBe('text');
      expect(keyInput.type).toBe('text');
      expect(companyIdInput.type).toBe('text');
      expect(versionInput.type).toBe('text');
    });

    it('has correct IDs', () => {
      render(<FormConfiguration {...defaultProps} />);
      
      expect(screen.getByLabelText('Form Title').id).toBe('formTitle');
      expect(screen.getByLabelText('Form Key').id).toBe('formKey');
      expect(screen.getByLabelText('Company ID').id).toBe('companyId');
      expect(screen.getByLabelText('Version').id).toBe('version');
    });

    it('has correct CSS classes', () => {
      render(<FormConfiguration {...defaultProps} />);
      
      const inputs = [
        screen.getByLabelText('Form Title'),
        screen.getByLabelText('Form Key'),
        screen.getByLabelText('Company ID'),
        screen.getByLabelText('Version')
      ];
      
      inputs.forEach(input => {
        expect(input.className).toContain('form-control');
      });
    });
  });

  describe('Layout', () => {
    it('renders inputs in correct layout structure', () => {
      render(<FormConfiguration {...defaultProps} />);
      
      const container = screen.getByText('Form Builder').parentElement;
      expect(container?.className).toContain('form-configuration');
      
      const row = container?.querySelector('.row');
      expect(row).toBeTruthy();
      
      const columns = row?.querySelectorAll('.col-6');
      expect(columns?.length).toBe(4);
    });

    it('applies bootstrap classes correctly', () => {
      render(<FormConfiguration {...defaultProps} />);
      
      const labels = screen.getAllByRole('textbox').map(input => 
        input.parentElement?.querySelector('.form-label')
      );
      
      labels.forEach(label => {
        expect(label?.className).toContain('form-label');
      });
    });
  });
});
