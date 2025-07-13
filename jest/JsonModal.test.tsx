import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import JsonModal from '../src/components/JsonModal/JsonModal';

// Mock navigator.clipboard
const mockClipboard = {
  writeText: jest.fn()
};

Object.assign(navigator, {
  clipboard: mockClipboard
});

// Mock document.body style and classList
Object.defineProperty(document.body, 'style', {
  value: {
    overflow: ''
  },
  writable: true
});

Object.defineProperty(document.body, 'classList', {
  value: {
    add: jest.fn(),
    remove: jest.fn()
  }
});

describe('JsonModal Component', () => {
  const defaultProps = {
    isOpen: true,
    jsonData: '{"test": "data"}',
    onClose: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockClipboard.writeText.mockResolvedValue(undefined);
  });

  afterEach(() => {
    // Cleanup any event listeners
    document.removeEventListener('keydown', () => {});
  });

  describe('Basic Rendering', () => {
    it('should not render when isOpen is false', () => {
      const { container } = render(
        <JsonModal {...defaultProps} isOpen={false} />
      );
      expect(container.firstChild).toBeNull();
    });

    it('should render when isOpen is true', () => {
      render(<JsonModal {...defaultProps} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should display the default title', () => {
      render(<JsonModal {...defaultProps} />);
      expect(screen.getByText('JSON Data')).toBeInTheDocument();
    });

    it('should display custom title', () => {
      render(<JsonModal {...defaultProps} title="Custom Title" />);
      expect(screen.getByText('Custom Title')).toBeInTheDocument();
    });

    it('should display JSON data', () => {
      render(<JsonModal {...defaultProps} />);
      expect(screen.getByText('{"test": "data"}')).toBeInTheDocument();
    });

    it('should display "No data available" when jsonData is null', () => {
      render(<JsonModal {...defaultProps} jsonData={null} />);
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('should display "No data available" when jsonData is undefined', () => {
      render(<JsonModal {...defaultProps} jsonData={undefined} />);
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });
  });

  describe('Modal Structure and Accessibility', () => {
    it('should have correct modal attributes', () => {
      render(<JsonModal {...defaultProps} />);
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('id', 'jsonModal');
      expect(modal).toHaveAttribute('tabIndex', '-1');
      expect(modal).toHaveAttribute('aria-labelledby', 'jsonModalLabel');
      expect(modal).toHaveAttribute('aria-hidden', 'false');
    });

    it('should have correct title id for accessibility', () => {
      render(<JsonModal {...defaultProps} />);
      const title = screen.getByText('JSON Data');
      expect(title).toHaveAttribute('id', 'jsonModalLabel');
    });

    it('should have close button with aria-label', () => {
      render(<JsonModal {...defaultProps} />);
      const closeButton = screen.getByLabelText('Close');
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe('Body Scroll Management', () => {
    it('should add modal-open class and hide body overflow when modal opens', () => {
      render(<JsonModal {...defaultProps} />);
      expect(document.body.classList.add).toHaveBeenCalledWith('modal-open');
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should remove modal-open class and restore body overflow when modal closes', () => {
      const { rerender } = render(<JsonModal {...defaultProps} />);
      
      rerender(<JsonModal {...defaultProps} isOpen={false} />);
      
      expect(document.body.classList.remove).toHaveBeenCalledWith('modal-open');
      expect(document.body.style.overflow).toBe('');
    });

    it('should cleanup body styles on unmount', () => {
      const { unmount } = render(<JsonModal {...defaultProps} />);
      
      unmount();
      
      expect(document.body.classList.remove).toHaveBeenCalledWith('modal-open');
      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('Close Functionality', () => {
    it('should call onClose when close button is clicked', () => {
      const onClose = jest.fn();
      render(<JsonModal {...defaultProps} onClose={onClose} />);
      
      const closeButton = screen.getByLabelText('Close');
      fireEvent.click(closeButton);
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when footer close button is clicked', () => {
      const onClose = jest.fn();
      render(<JsonModal {...defaultProps} onClose={onClose} />);
      
      // Get the Close button in the footer specifically
      const footerCloseButton = screen.getByText('Close');
      fireEvent.click(footerCloseButton);
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when backdrop is clicked', () => {
      const onClose = jest.fn();
      render(<JsonModal {...defaultProps} onClose={onClose} />);
      
      const backdrop = screen.getByRole('dialog');
      fireEvent.click(backdrop);
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose when modal content is clicked', () => {
      const onClose = jest.fn();
      render(<JsonModal {...defaultProps} onClose={onClose} />);
      
      const modalContent = screen.getByText('JSON Data').closest('.modal-content');
      fireEvent.click(modalContent!);
      
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should call onClose when Escape key is pressed', () => {
      const onClose = jest.fn();
      render(<JsonModal {...defaultProps} onClose={onClose} />);
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose when other keys are pressed', () => {
      const onClose = jest.fn();
      render(<JsonModal {...defaultProps} onClose={onClose} />);
      
      fireEvent.keyDown(document, { key: 'Enter' });
      fireEvent.keyDown(document, { key: 'Space' });
      fireEvent.keyDown(document, { key: 'Tab' });
      
      expect(onClose).not.toHaveBeenCalled();
    });

    it('should not respond to Escape when modal is closed', () => {
      const onClose = jest.fn();
      render(<JsonModal {...defaultProps} isOpen={false} onClose={onClose} />);
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      expect(onClose).not.toHaveBeenCalled();
    });

    it('should remove keydown listener when modal closes', () => {
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
      const { rerender } = render(<JsonModal {...defaultProps} />);
      
      rerender(<JsonModal {...defaultProps} isOpen={false} />);
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });
  });

  describe('Copy to Clipboard', () => {
    it('should copy JSON data to clipboard when copy button is clicked', async () => {
      render(<JsonModal {...defaultProps} />);
      
      const copyButton = screen.getByRole('button', { name: 'Copy to Clipboard' });
      fireEvent.click(copyButton);
      
      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalledWith('{"test": "data"}');
      });
    });

    it('should copy empty string when jsonData is null', async () => {
      render(<JsonModal {...defaultProps} jsonData={null} />);
      
      const copyButton = screen.getByRole('button', { name: 'Copy to Clipboard' });
      fireEvent.click(copyButton);
      
      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalledWith('');
      });
    });

    it('should handle clipboard API failure gracefully', async () => {
      mockClipboard.writeText.mockRejectedValue(new Error('Clipboard failed'));
      
      render(<JsonModal {...defaultProps} />);
      
      const copyButton = screen.getByRole('button', { name: 'Copy to Clipboard' });
      
      // Should not throw error
      expect(() => fireEvent.click(copyButton)).not.toThrow();
      
      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalled();
      });
    });
  });

  describe('Complex JSON Data', () => {
    it('should handle complex JSON data', () => {
      const complexData = JSON.stringify({
        users: [
          { id: 1, name: 'John', active: true },
          { id: 2, name: 'Jane', active: false }
        ],
        metadata: {
          count: 2,
          timestamp: '2023-01-01'
        }
      }, null, 2);
      
      render(<JsonModal {...defaultProps} jsonData={complexData} />);      // Check for parts of the JSON content rather than exact match
      expect(screen.getByText((content, element) => {
        return !!(element && element.className && element.className.includes('json-modal-content') && 
                content.includes('"users"') && 
                content.includes('"John"'));
      })).toBeInTheDocument();
    });

    it('should handle malformed JSON strings', () => {
      const malformedJson = '{"incomplete": true';
      render(<JsonModal {...defaultProps} jsonData={malformedJson} />);
      expect(screen.getByText(malformedJson)).toBeInTheDocument();
    });

    it('should handle very long JSON data', () => {
      const longData = JSON.stringify({ data: 'x'.repeat(10000) });
      render(<JsonModal {...defaultProps} jsonData={longData} />);
      expect(screen.getByText(longData)).toBeInTheDocument();
    });
  });

  describe('Props Changes', () => {
    it('should update content when jsonData changes', () => {
      const { rerender } = render(<JsonModal {...defaultProps} />);
      expect(screen.getByText('{"test": "data"}')).toBeInTheDocument();
      
      rerender(<JsonModal {...defaultProps} jsonData='{"updated": "content"}' />);
      expect(screen.getByText('{"updated": "content"}')).toBeInTheDocument();
      expect(screen.queryByText('{"test": "data"}')).not.toBeInTheDocument();
    });

    it('should update title when title prop changes', () => {
      const { rerender } = render(<JsonModal {...defaultProps} title="Original Title" />);
      expect(screen.getByText('Original Title')).toBeInTheDocument();
      
      rerender(<JsonModal {...defaultProps} title="Updated Title" />);
      expect(screen.getByText('Updated Title')).toBeInTheDocument();
      expect(screen.queryByText('Original Title')).not.toBeInTheDocument();
    });

    it('should handle rapid isOpen state changes', () => {
      const { rerender } = render(<JsonModal {...defaultProps} isOpen={false} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      
      rerender(<JsonModal {...defaultProps} isOpen={true} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      
      rerender(<JsonModal {...defaultProps} isOpen={false} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Modal Styling', () => {
    it('should apply correct modal styles', () => {
      render(<JsonModal {...defaultProps} />);
      const modal = screen.getByRole('dialog');
      
      expect(modal).toHaveStyle({
        display: 'block',
        backgroundColor: 'rgba(0,0,0,0.5)',
        overflow: 'hidden'
      });
    });

    it('should apply correct dialog height styles', () => {
      render(<JsonModal {...defaultProps} />);
      const modalDialog = screen.getByRole('dialog').querySelector('.modal-dialog');
      
      expect(modalDialog).toHaveStyle({
        height: '90vh',
        margin: '5vh auto'
      });
    });

    it('should apply correct content flex styles', () => {
      render(<JsonModal {...defaultProps} />);
      const modalContent = screen.getByRole('dialog').querySelector('.modal-content');
      
      expect(modalContent).toHaveStyle({
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      });
    });
  });
});
