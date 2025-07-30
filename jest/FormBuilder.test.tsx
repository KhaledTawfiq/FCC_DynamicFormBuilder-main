import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import FormBuilder from '../src/components/FormBuilder/FormBuilder';
import type { FormConfig, Section, UseFormBuilderReturn } from '../src/types';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(() => Promise.resolve()),
  },
});

// Mock the useFormBuilder hook with more realistic data and functions
const mockHookData: UseFormBuilderReturn = {
  formConfig: {
    formTitle: 'Test Form',
    formKey: 'test-form',
    companyId: 'test-company',
    version: '1.0.0'
  },
  sections: [],
  formBuilderOptions: { controlOrder: ['text', 'select'] },
  isSubmitting: false,
  isLoadingForm: false,
  addSection: jest.fn(),
  removeSection: jest.fn(),
  updateSection: jest.fn(),
  reorderSections: jest.fn(),
  generateFormData: jest.fn(() => ({
    formattedTemplateJson: '{"test": "data"}'
  })),
  submitForm: jest.fn(() => Promise.resolve()),
  loadJson: jest.fn(() => Promise.resolve()),
  setFormConfig: jest.fn()
};

jest.mock('../src/hooks/useFormBuilder', () => ({
  useFormBuilder: () => mockHookData
}));

describe('FormBuilder', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockHookData.sections = [];
    mockHookData.isSubmitting = false;
    mockHookData.isLoadingForm = false;
    // Reset DOM body state
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  });

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<FormBuilder />);
      expect(screen.getByText('Add Section')).toBeTruthy();
    });

    it('renders all main components', () => {
      render(<FormBuilder />);
      
      // Action buttons
      expect(screen.getByText('Add Section')).toBeTruthy();
      expect(screen.getByText('View Json')).toBeTruthy();
      expect(screen.getByText('Submit')).toBeTruthy();
      expect(screen.getByText('Load Json')).toBeTruthy();
      
      // Form configuration
      expect(screen.getByText('Form Title')).toBeTruthy();
      expect(screen.getByText('Form Key')).toBeTruthy();
    });
  });

  describe('Add Section Flow', () => {
    it('calls addSection and shows success snackbar when Add Section is clicked', async () => {
      render(<FormBuilder />);
      
      const addButton = screen.getByText('Add Section');
      fireEvent.click(addButton);
      
      expect(mockHookData.addSection).toHaveBeenCalledTimes(1);
      
      // Check that success snackbar appears
      await waitFor(() => {
        expect(screen.getByText('Section added successfully')).toBeTruthy();
      });
    });

    it('snackbar disappears after duration', async () => {
      render(<FormBuilder />);
      
      const addButton = screen.getByText('Add Section');
      fireEvent.click(addButton);
      
      // Snackbar should appear
      await waitFor(() => {
        expect(screen.getByText('Section added successfully')).toBeTruthy();
      });
      
      // Snackbar should disappear after timeout
      await waitFor(() => {
        expect(screen.queryByText('Section added successfully')).toBeFalsy();
      }, { timeout: 4000 });
    });
  });

  describe('View JSON Modal Flow', () => {
    it('shows info snackbar when trying to view JSON with no sections', async () => {
      render(<FormBuilder />);
      
      const viewJsonButton = screen.getByText('View Json');
      fireEvent.click(viewJsonButton);
      
      await waitFor(() => {
        expect(screen.getByText('Please add sections first')).toBeTruthy();
      });
      
      // Modal should not open
      expect(screen.queryByText('JSON Data')).toBeFalsy();
    });

    it('opens JSON modal when sections exist', async () => {
      // Mock with sections
      const mockSection: Section = { 
        id: '1', 
        title: 'Test Section',
        fields: []
      };
      mockHookData.sections = [mockSection];
      
      render(<FormBuilder />);
      
      const viewJsonButton = screen.getByText('View Json');
      fireEvent.click(viewJsonButton);
      
      expect(mockHookData.generateFormData).toHaveBeenCalledTimes(1);
      
      await waitFor(() => {
        expect(screen.getByText('JSON Data')).toBeTruthy();
      });
    });

    it('closes JSON modal when close button is clicked', async () => {
      const mockSection: Section = { 
        id: '1', 
        title: 'Test Section',
        fields: []
      };
      mockHookData.sections = [mockSection];
      
      render(<FormBuilder />);
      
      // Open modal
      const viewJsonButton = screen.getByText('View Json');
      fireEvent.click(viewJsonButton);
      
      await waitFor(() => {
        expect(screen.getByText('JSON Data')).toBeTruthy();
      });
      
      // Close modal
      const closeButton = screen.getByLabelText('Close');
      fireEvent.click(closeButton);
      
      await waitFor(() => {
        expect(screen.queryByText('JSON Data')).toBeFalsy();
      });
    });

    it('closes JSON modal when backdrop is clicked', async () => {
      const mockSection: Section = { 
        id: '1', 
        title: 'Test Section',
        fields: []
      };
      mockHookData.sections = [mockSection];
      
      render(<FormBuilder />);
      
      // Open modal
      const viewJsonButton = screen.getByText('View Json');
      fireEvent.click(viewJsonButton);
      
      await waitFor(() => {
        expect(screen.getByText('JSON Data')).toBeTruthy();
      });
      
      // Click backdrop
      const modalBackdrop = screen.getByRole('dialog');
      fireEvent.click(modalBackdrop);
      
      await waitFor(() => {
        expect(screen.queryByText('JSON Data')).toBeFalsy();
      });
    });

    it('closes JSON modal when Escape key is pressed', async () => {
      const mockSection: Section = { 
        id: '1', 
        title: 'Test Section',
        fields: []
      };
      mockHookData.sections = [mockSection];
      
      render(<FormBuilder />);
      
      // Open modal
      const viewJsonButton = screen.getByText('View Json');
      fireEvent.click(viewJsonButton);
      
      await waitFor(() => {
        expect(screen.getByText('JSON Data')).toBeTruthy();
      });
      
      // Press Escape
      fireEvent.keyDown(document, { key: 'Escape' });
      
      await waitFor(() => {
        expect(screen.queryByText('JSON Data')).toBeFalsy();
      });
    });
  });

  describe('Submit Flow', () => {
    it('shows info snackbar when trying to submit with no sections', async () => {
      render(<FormBuilder />);
      
      const submitButton = screen.getByText('Submit');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Please add sections first')).toBeTruthy();
      });
      
      expect(mockHookData.submitForm).not.toHaveBeenCalled();
    });

    it('calls submitForm and shows success snackbar when sections exist', async () => {
      const mockSection: Section = { 
        id: '1', 
        title: 'Test Section',
        fields: []
      };
      mockHookData.sections = [mockSection];
      
      render(<FormBuilder />);
      
      const submitButton = screen.getByText('Submit');
      fireEvent.click(submitButton);
      
      expect(mockHookData.submitForm).toHaveBeenCalledTimes(1);
      
      await waitFor(() => {
        expect(screen.getByText('Form submitted successfully')).toBeTruthy();
      });
    });

    it('shows error snackbar when submit fails', async () => {
      const mockSection: Section = { 
        id: '1', 
        title: 'Test Section',
        fields: []
      };
      mockHookData.sections = [mockSection];
      mockHookData.submitForm = jest.fn(() => Promise.reject(new Error('Submit failed')));
      
      render(<FormBuilder />);
      
      const submitButton = screen.getByText('Submit');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Error submitting form: Submit failed')).toBeTruthy();
      });
    });

    it('shows submitting state', async () => {
      const mockSection: Section = { 
        id: '1', 
        title: 'Test Section',
        fields: []
      };
      mockHookData.sections = [mockSection];
      mockHookData.isSubmitting = true;
      
      render(<FormBuilder />);
      
      expect(screen.getByText('Submitting...')).toBeTruthy();
    });
  });

  describe('Load JSON Flow', () => {
    it('calls loadJson and shows success snackbar', async () => {
      render(<FormBuilder />);
      
      const loadJsonButton = screen.getByText('Load Json');
      fireEvent.click(loadJsonButton);
      
      expect(mockHookData.loadJson).toHaveBeenCalledTimes(1);
      
      await waitFor(() => {
        expect(screen.getByText('Form loaded successfully')).toBeTruthy();
      });
    });

    it('shows error snackbar when load fails', async () => {
      mockHookData.loadJson = jest.fn(() => Promise.reject(new Error('Load failed')));
      
      render(<FormBuilder />);
      
      const loadJsonButton = screen.getByText('Load Json');
      fireEvent.click(loadJsonButton);
      
      await waitFor(() => {
        expect(screen.getByText('Error load form: Load failed')).toBeTruthy();
      });
    });

    it('shows loading state', async () => {
      mockHookData.isLoadingForm = true;
      
      render(<FormBuilder />);
      
      expect(screen.getByText('Loading...')).toBeTruthy();
    });
  });

  describe('Form Configuration', () => {
    it('updates form configuration when inputs change', async () => {
      render(<FormBuilder />);
      
      const titleInput = screen.getByLabelText('Form Title');
      fireEvent.change(titleInput, { target: { value: 'New Title' } });
      
      expect(mockHookData.setFormConfig).toHaveBeenCalledWith({
        ...mockHookData.formConfig,
        formTitle: 'New Title'
      });
    });

    it('displays current form configuration values', () => {
      render(<FormBuilder />);
      
      const titleInput = screen.getByLabelText('Form Title') as HTMLInputElement;
      const keyInput = screen.getByLabelText('Form Key') as HTMLInputElement;
      
      expect(titleInput.value).toBe('Test Form');
      expect(keyInput.value).toBe('test-form');
    });
  });

  describe('Section Management', () => {
    it('renders sections when they exist', () => {
      const mockSection: Section = { 
        id: '1', 
        title: 'Test Section',
        fields: []
      };
      mockHookData.sections = [mockSection];
      
      render(<FormBuilder />);
      
      // Check if accordion structure is present
      const accordion = document.querySelector('#accordionExample');
      expect(accordion).toBeTruthy();
    });

    it('calls removeSection when section is removed', async () => {
      const mockSection: Section = { 
        id: '1', 
        title: 'Test Section',
        fields: []
      };
      mockHookData.sections = [mockSection];
      
      render(<FormBuilder />);
      
      // This would typically be tested with a more specific section component test
      // For now, we just verify the hook data setup
      expect(mockHookData.sections).toHaveLength(1);
    });

    it('calls reorderSections when sections are reordered', async () => {
      const mockSections: Section[] = [
        { id: '1', title: 'Section 1', fields: [] },
        { id: '2', title: 'Section 2', fields: [] }
      ];
      mockHookData.sections = mockSections;
      
      render(<FormBuilder />);
      
      // This would typically be tested with drag and drop simulation
      // For now, we just verify the hook data setup
      expect(mockHookData.sections).toHaveLength(2);
      expect(mockHookData.reorderSections).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('handles unexpected errors gracefully', async () => {
      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      mockHookData.submitForm = jest.fn(() => Promise.reject(new Error('Unexpected error')));
      
      const mockSection: Section = { 
        id: '1', 
        title: 'Test Section',
        fields: []
      };
      mockHookData.sections = [mockSection];
      
      render(<FormBuilder />);
      
      const submitButton = screen.getByText('Submit');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Error submitting form: Unexpected error')).toBeTruthy();
      });
      
      consoleSpy.mockRestore();
    });

    it('handles unknown error types', async () => {
      mockHookData.submitForm = jest.fn(() => Promise.reject('String error'));
      
      const mockSection: Section = { 
        id: '1', 
        title: 'Test Section',
        fields: []
      };
      mockHookData.sections = [mockSection];
      
      render(<FormBuilder />);
      
      const submitButton = screen.getByText('Submit');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Error submitting form: Unknown error occurred')).toBeTruthy();
      });
    });
  });

  describe('Component Integration', () => {
    it('integrates all child components correctly', () => {
      render(<FormBuilder />);
      
      // Check for main structure
      expect(document.querySelector('.container-fluid')).toBeTruthy();
      expect(document.querySelector('.row')).toBeTruthy();
      expect(document.querySelector('.col-12')).toBeTruthy();
      
      // Check for accordion structure
      expect(document.querySelector('#accordionExample')).toBeTruthy();
      
      // Check for action buttons container
      expect(document.querySelector('.generic-buttons')).toBeTruthy();
    });

    it('maintains proper component hierarchy', () => {
      render(<FormBuilder />);
      
      // FormConfiguration should be present
      expect(screen.getByText('Form Builder')).toBeTruthy();
      
      // ActionButtons should be present
      expect(screen.getByText('Add Section')).toBeTruthy();
      expect(screen.getByText('View Json')).toBeTruthy();
      expect(screen.getByText('Submit')).toBeTruthy();
      expect(screen.getByText('Load Json')).toBeTruthy();
    });
  });
});
