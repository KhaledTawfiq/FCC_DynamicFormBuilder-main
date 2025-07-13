import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import ActionButtons from '../src/components/ActionButtons/ActionButtons';

describe('ActionButtons', () => {
  const defaultProps = {
    onAddSection: jest.fn(),
    onViewJson: jest.fn(),
    onSubmit: jest.fn(),
    onLoadJson: jest.fn(),
    isSubmitting: false,
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders all buttons', () => {
      render(<ActionButtons {...defaultProps} />);
      
      expect(screen.getByText('Add Section')).toBeTruthy();
      expect(screen.getByText('View Json')).toBeTruthy();
      expect(screen.getByText('Submit')).toBeTruthy();
      expect(screen.getByText('Load Json')).toBeTruthy();
    });

    it('renders with custom className', () => {
      render(<ActionButtons {...defaultProps} className="custom-class" />);
      
      const container = screen.getByText('Add Section').parentElement;
      expect(container?.className).toContain('custom-class');
    });
  });

  describe('Button Functionality', () => {
    it('calls onAddSection when Add Section button is clicked', () => {
      render(<ActionButtons {...defaultProps} />);
      
      const addButton = screen.getByText('Add Section');
      fireEvent.click(addButton);
      
      expect(defaultProps.onAddSection).toHaveBeenCalledTimes(1);
    });

    it('calls onViewJson when View Json button is clicked', () => {
      render(<ActionButtons {...defaultProps} />);
      
      const viewJsonButton = screen.getByText('View Json');
      fireEvent.click(viewJsonButton);
      
      expect(defaultProps.onViewJson).toHaveBeenCalledTimes(1);
    });

    it('calls onSubmit when Submit button is clicked', () => {
      render(<ActionButtons {...defaultProps} />);
      
      const submitButton = screen.getByText('Submit');
      fireEvent.click(submitButton);
      
      expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
    });

    it('calls onLoadJson when Load Json button is clicked', () => {
      render(<ActionButtons {...defaultProps} />);
      
      const loadJsonButton = screen.getByText('Load Json');
      fireEvent.click(loadJsonButton);
      
      expect(defaultProps.onLoadJson).toHaveBeenCalledTimes(1);
    });
  });

  describe('Loading States', () => {
    it('shows "Submitting..." text when isSubmitting is true', () => {
      render(<ActionButtons {...defaultProps} isSubmitting={true} />);
      
      expect(screen.getByText('Submitting...')).toBeTruthy();
    });

    it('shows "Loading..." text when isLoading is true', () => {
      render(<ActionButtons {...defaultProps} isLoading={true} />);
      
      expect(screen.getByText('Loading...')).toBeTruthy();
    });

    it('disables Add Section and View Json buttons when isSubmitting', () => {
      render(<ActionButtons {...defaultProps} isSubmitting={true} />);
      
      const addButton = screen.getByText('Add Section');
      const viewJsonButton = screen.getByText('View Json');
      
      expect(addButton.hasAttribute('disabled')).toBe(true);
      expect(viewJsonButton.hasAttribute('disabled')).toBe(true);
    });

    it('disables Add Section and View Json buttons when isLoading', () => {
      render(<ActionButtons {...defaultProps} isLoading={true} />);
      
      const addButton = screen.getByText('Add Section');
      const viewJsonButton = screen.getByText('View Json');
      
      expect(addButton.hasAttribute('disabled')).toBe(true);
      expect(viewJsonButton.hasAttribute('disabled')).toBe(true);
    });

    it('disables Submit button when isLoading', () => {
      render(<ActionButtons {...defaultProps} isLoading={true} />);
      
      const submitButton = screen.getByText('Submit');
      expect(submitButton.hasAttribute('disabled')).toBe(true);
    });

    it('disables Load Json button when isSubmitting', () => {
      render(<ActionButtons {...defaultProps} isSubmitting={true} />);
      
      const loadJsonButton = screen.getByText('Load Json');
      expect(loadJsonButton.hasAttribute('disabled')).toBe(true);
    });
  });

  describe('Loading Spinners', () => {
    it('shows loading spinner when isSubmitting', () => {
      render(<ActionButtons {...defaultProps} isSubmitting={true} />);
      
      // The LoadingSpinner component should be visible
      // We can check for its parent wrapper
      const submitWrapper = screen.getByText('Submitting...').parentElement;
      expect(submitWrapper?.className).toContain('submit-button-wrapper');
    });

    it('shows loading spinner when isLoading', () => {
      render(<ActionButtons {...defaultProps} isLoading={true} />);
      
      // The LoadingSpinner component should be visible
      // We can check for its parent wrapper
      const loadWrapper = screen.getByText('Loading...').parentElement;
      expect(loadWrapper?.className).toContain('submit-button-wrapper');
    });
  });

  describe('Button Types', () => {
    it('all buttons have correct type attribute', () => {
      render(<ActionButtons {...defaultProps} />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button.getAttribute('type')).toBe('button');
      });
    });
  });

  describe('CSS Classes', () => {
    it('applies correct CSS classes to buttons', () => {
      render(<ActionButtons {...defaultProps} />);
      
      const addButton = screen.getByText('Add Section');
      const viewJsonButton = screen.getByText('View Json');
      const submitButton = screen.getByText('Submit');
      const loadJsonButton = screen.getByText('Load Json');
      
      expect(addButton.className).toContain('btn btn-primary');
      expect(viewJsonButton.className).toContain('btn btn-primary');
      expect(submitButton.className).toContain('btn btn-primary');
      expect(loadJsonButton.className).toContain('btn btn-primary');
    });

    it('applies generic-buttons class to container', () => {
      render(<ActionButtons {...defaultProps} />);
      
      const container = screen.getByText('Add Section').parentElement;
      expect(container?.className).toContain('generic-buttons');
    });
  });
});
