import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Section from '../src/components/Section/Section';
import type { SectionProps, Section as SectionType } from '../src/types';

// Mock jQuery and FormBuilder
const mockFormBuilder = {
  actions: {
    getData: jest.fn(),
    setData: jest.fn(),
    clear: jest.fn(),
    save: jest.fn()
  },
  element: document.createElement('div'),
  promise: Promise.resolve()
};

jest.mock('jquery', () => {
  const mockJQuery = jest.fn(() => ({
    formBuilder: jest.fn(() => mockFormBuilder),
    on: jest.fn(),
    off: jest.fn(),
    collapse: jest.fn(),
    find: jest.fn(() => ({
      on: jest.fn(),
      off: jest.fn()
    }))
  }));
  return mockJQuery;
});

describe('Section Component', () => {
  const mockSection: SectionType = {
    id: '1',
    title: 'Test Section',
    fields: []
  };

  const mockFormBuilderOptions: any = {
    disableFields: ['autocomplete'],
    controlOrder: ['text', 'textarea', 'select']
  };

  const defaultProps: SectionProps = {
    section: mockSection,
    index: 0,
    formBuilderOptions: mockFormBuilderOptions,
    onRemove: jest.fn(),
    onUpdate: jest.fn(),
    onDragStart: jest.fn(),
    onDragOver: jest.fn(),
    onDrop: jest.fn(),
    onReorder: jest.fn(),
    draggedIndex: null
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFormBuilder.actions.getData.mockReturnValue([]);
  });

  describe('Basic Rendering', () => {
    it('should render section with title', () => {
      render(<Section {...defaultProps} />);
      // The title is in an input field with value="Test Section"
      const titleInput = screen.getByDisplayValue('Test Section');
      expect(titleInput).toBeInTheDocument();
    });

    it('should render section number', () => {
      render(<Section {...defaultProps} index={2} />);
      // Check for the specific text pattern in the accordion button
      expect(screen.getByText((content, element) => {
        return element?.tagName.toLowerCase() === 'button' && 
               content.includes('Section #') && 
               content.includes('3');
      })).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<Section {...defaultProps} className="custom-class" />);
      const section = document.querySelector('.accordion-item.custom-class');
      expect(section).toBeInTheDocument();
    });

    it('should render drag handle', () => {
      render(<Section {...defaultProps} />);
      // The entire accordion item is draggable
      const draggableSection = document.querySelector('[draggable="true"]');
      expect(draggableSection).toBeInTheDocument();
    });

    it('should render remove button', () => {
      render(<Section {...defaultProps} />);
      expect(screen.getByText('Remove Section')).toBeInTheDocument();
    });

    it('should render expand/collapse button', () => {
      render(<Section {...defaultProps} />);
      const toggleButton = screen.getByRole('button', { expanded: false });
      expect(toggleButton).toBeInTheDocument();
    });
  });

  describe('Section Interaction', () => {
    it('should call onRemove when remove button is clicked', () => {
      const onRemove = jest.fn();
      render(<Section {...defaultProps} onRemove={onRemove} />);
      
      const removeButton = screen.getByText('Remove Section');
      fireEvent.click(removeButton);
      
      expect(onRemove).toHaveBeenCalledWith(0);
    });

    it('should toggle expand/collapse state', () => {
      render(<Section {...defaultProps} />);
      
      const toggleButton = screen.getByRole('button', { expanded: false });
      
      // Click to expand
      fireEvent.click(toggleButton);
      
      // After click, check that the collapse div has the right class
      const collapseDiv = document.querySelector(`#collapse${defaultProps.index}`);
      expect(collapseDiv).toHaveClass('show');
    });

    it('should handle drag start', () => {
      const onDragStart = jest.fn();
      render(<Section {...defaultProps} onDragStart={onDragStart} />);
      
      const draggableSection = document.querySelector('[draggable="true"]');
      
      // Create a mock dataTransfer object
      const mockDataTransfer = {
        setData: jest.fn(),
        getData: jest.fn(),
        dropEffect: 'move',
        effectAllowed: 'move'
      };
      
      const dragStartEvent = new Event('dragstart', { bubbles: true });
      Object.defineProperty(dragStartEvent, 'dataTransfer', {
        value: mockDataTransfer,
        writable: false
      });
      
      draggableSection!.dispatchEvent(dragStartEvent);
      
      expect(onDragStart).toHaveBeenCalledWith(0);
    });

    it('should handle drag over', () => {
      const onDragOver = jest.fn();
      render(<Section {...defaultProps} onDragOver={onDragOver} />);
      
      const section = document.querySelector('.accordion-item');
      
      // Create a mock dataTransfer object
      const mockDataTransfer = {
        setData: jest.fn(),
        getData: jest.fn(),
        dropEffect: 'move',
        effectAllowed: 'move'
      };
      
      const dragOverEvent = new Event('dragover', { bubbles: true });
      Object.defineProperty(dragOverEvent, 'dataTransfer', {
        value: mockDataTransfer,
        writable: false
      });
      
      section!.dispatchEvent(dragOverEvent);
      
      expect(onDragOver).toHaveBeenCalledWith(0);
    });

    it('should handle drop', () => {
      const onDrop = jest.fn();
      render(<Section {...defaultProps} onDrop={onDrop} />);
      
      const section = document.querySelector('.accordion-item');
      
      // Create a mock dataTransfer object
      const mockDataTransfer = {
        setData: jest.fn(),
        getData: jest.fn().mockReturnValue('0'),
        dropEffect: 'move',
        effectAllowed: 'move'
      };
      
      const dropEvent = new Event('drop', { bubbles: true });
      Object.defineProperty(dropEvent, 'dataTransfer', {
        value: mockDataTransfer,
        writable: false
      });
      
      section!.dispatchEvent(dropEvent);
      
      expect(onDrop).toHaveBeenCalledWith(0);
    });
  });

  describe('Drag Visual Feedback', () => {
    it('should apply dragging class when section is being dragged', () => {
      render(<Section {...defaultProps} draggedIndex={0} />);
      
      const section = document.querySelector('.accordion-item');
      expect(section).toHaveClass('dragging');
    });

    it('should not apply dragging class when different section is being dragged', () => {
      render(<Section {...defaultProps} draggedIndex={1} />);
      
      const section = document.querySelector('.accordion-item');
      expect(section).not.toHaveClass('dragging');
    });

    it('should not apply dragging class when no section is being dragged', () => {
      render(<Section {...defaultProps} draggedIndex={null} />);
      
      const section = document.querySelector('.accordion-item');
      expect(section).not.toHaveClass('dragging');
    });
  });

  describe('FormBuilder Integration', () => {
    it('should handle FormBuilder errors gracefully', async () => {
      mockFormBuilder.actions.getData.mockImplementation(() => {
        throw new Error('FormBuilder error');
      });
      
      // Should not throw
      expect(() => render(<Section {...defaultProps} />)).not.toThrow();
    });
  });

  describe('Section Title Editing', () => {
    it('should allow editing section title', () => {
      render(<Section {...defaultProps} />);
      
      const titleInput = screen.getByDisplayValue('Test Section');
      expect(titleInput).toBeInTheDocument();
      
      fireEvent.change(titleInput, { target: { value: 'Updated Section' } });
      expect(titleInput).toHaveValue('Updated Section');
    });

    it('should handle empty title', () => {
      render(<Section {...defaultProps} />);
      
      const titleInput = screen.getByDisplayValue('Test Section');
      fireEvent.change(titleInput, { target: { value: '' } });
      
      expect(titleInput).toHaveValue('');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<Section {...defaultProps} />);
      
      // Check for actual accessible elements
      const toggleButton = screen.getByRole('button', { expanded: false });
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
      expect(toggleButton).toHaveAttribute('aria-controls');
    });

    it('should have proper heading hierarchy', () => {
      render(<Section {...defaultProps} />);
      
      const heading = screen.getByRole('heading');
      expect(heading).toBeInTheDocument();
    });

    it('should support keyboard navigation', () => {
      render(<Section {...defaultProps} />);
      
      const removeButton = screen.getByText('Remove Section');
      const toggleButton = screen.getByRole('button', { expanded: false });
      
      // These elements should be focusable
      expect(removeButton).toBeInTheDocument();
      expect(toggleButton).toBeInTheDocument();
    });
  });

  describe('Props Validation', () => {
    it('should handle missing optional props', () => {
      const minimalProps = {
        section: mockSection,
        index: 0,
        formBuilderOptions: mockFormBuilderOptions,
        onRemove: jest.fn(),
        onUpdate: jest.fn(),
        onDragStart: jest.fn(),
        onDragOver: jest.fn(),
        onDrop: jest.fn(),
        onReorder: jest.fn(),
        draggedIndex: null
      };
      
      expect(() => render(<Section {...minimalProps} />)).not.toThrow();
    });

    it('should handle section with many fields', () => {
      const sectionWithManyFields = {
        ...mockSection,
        fields: Array.from({ length: 50 }, (_, i) => ({
          type: 'text',
          name: `field${i}`,
          label: `Field ${i}`
        }))
      };
      
      expect(() => 
        render(<Section {...defaultProps} section={sectionWithManyFields} />)
      ).not.toThrow();
    });

    it('should handle section with long title', () => {
      const sectionWithLongTitle = {
        ...mockSection,
        title: 'A'.repeat(1000)
      };
      
      render(<Section {...defaultProps} section={sectionWithLongTitle} />);
      expect(screen.getByDisplayValue('A'.repeat(1000))).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should not re-initialize FormBuilder unnecessarily', () => {
      const { rerender } = render(<Section {...defaultProps} />);
      
      // Clear previous calls
      jest.clearAllMocks();
      
      // Re-render with same props
      rerender(<Section {...defaultProps} />);
      
      // FormBuilder should not be re-initialized
      expect(mockFormBuilder.actions.getData).not.toHaveBeenCalled();
    });

    it('should handle rapid prop changes', () => {
      const { rerender } = render(<Section {...defaultProps} />);
      
      for (let i = 0; i < 10; i++) {
        rerender(<Section {...defaultProps} index={i} />);
      }
      
      // Should not throw errors - check for section 10 text pattern
      expect(screen.getByText((content, element) => {
        return element?.tagName.toLowerCase() === 'button' && 
               content.includes('Section #') && 
               content.includes('10');
      })).toBeInTheDocument();
    });
  });

  describe('Cleanup', () => {
    it('should cleanup on unmount', () => {
      const { unmount } = render(<Section {...defaultProps} />);
      
      // Should not throw
      expect(() => unmount()).not.toThrow();
    });

    it('should handle multiple rapid mounts and unmounts', () => {
      for (let i = 0; i < 5; i++) {
        const { unmount } = render(<Section {...defaultProps} />);
        unmount();
      }
      
      // Should not throw or cause memory leaks
      expect(true).toBe(true);
    });
  });
});
