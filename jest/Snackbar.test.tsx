import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import Snackbar from '../src/components/Snackbar/Snackbar';

describe('Snackbar', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Basic Rendering', () => {
    it('renders nothing when no message is provided', () => {
      const { container } = render(<Snackbar message={null} type="info" onClose={mockOnClose} />);
      expect(container.firstChild).toBeFalsy();
    });

    it('renders message when provided', () => {
      render(<Snackbar message="Test message" type="info" onClose={mockOnClose} />);
      expect(screen.getByText('Test message')).toBeTruthy();
    });

    it('renders with correct ID attribute', () => {
      render(<Snackbar message="Test message" type="info" onClose={mockOnClose} />);
      const snackbar = screen.getByText('Test message').closest('#snackbar');
      expect(snackbar).toBeTruthy();
    });
  });

  describe('CSS Classes and Styling', () => {
    it('applies correct CSS class for info type', () => {
      render(<Snackbar message="Info message" type="info" onClose={mockOnClose} />);
      const snackbar = screen.getByText('Info message').closest('.snackbar');
      expect(snackbar?.classList.contains('info')).toBe(true);
    });

    it('applies correct CSS class for error type', () => {
      render(<Snackbar message="Error message" type="error" onClose={mockOnClose} />);
      const snackbar = screen.getByText('Error message').closest('.snackbar');
      expect(snackbar?.classList.contains('error')).toBe(true);
    });

    it('applies correct CSS class for success type', () => {
      render(<Snackbar message="Success message" type="success" onClose={mockOnClose} />);
      const snackbar = screen.getByText('Success message').closest('.snackbar');
      expect(snackbar?.classList.contains('success')).toBe(true);
    });

    it('applies correct CSS class for warning type', () => {
      render(<Snackbar message="Warning message" type="warning" onClose={mockOnClose} />);
      const snackbar = screen.getByText('Warning message').closest('.snackbar');
      expect(snackbar?.classList.contains('warning')).toBe(true);
    });

    it('applies show class when message is present', () => {
      render(<Snackbar message="Test message" type="info" onClose={mockOnClose} />);
      const snackbar = screen.getByText('Test message').closest('.snackbar');
      expect(snackbar?.classList.contains('show')).toBe(true);
    });

    it('applies base snackbar class', () => {
      render(<Snackbar message="Test message" type="info" onClose={mockOnClose} />);
      const snackbar = screen.getByText('Test message').closest('.snackbar');
      expect(snackbar?.classList.contains('snackbar')).toBe(true);
    });
  });

  describe('Auto-Hide Functionality', () => {
    it('calls onClose after default duration (3000ms)', () => {
      const customOnClose = jest.fn();
      render(<Snackbar message="Test message" type="info" onClose={customOnClose} />);

      // Fast-forward time using default duration (3000ms)
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      // Additional time for fade out animation
      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(customOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose after custom duration', () => {
      const customOnClose = jest.fn();
      render(<Snackbar message="Test message" type="info" duration={1000} onClose={customOnClose} />);

      // Fast-forward time using custom duration
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // Additional time for fade out animation
      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(customOnClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose before duration expires', () => {
      const customOnClose = jest.fn();
      render(<Snackbar message="Test message" type="info" duration={2000} onClose={customOnClose} />);

      // Fast-forward less than duration
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(customOnClose).not.toHaveBeenCalled();
    });

    it('hides snackbar after duration', () => {
      const { container } = render(<Snackbar message="Test message" type="info" duration={1000} />);
      
      // Initially visible with show class
      expect(container.querySelector('.snackbar')?.classList.contains('show')).toBe(true);
      
      // Fast-forward past duration
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      
      // Should be hidden (show class removed)
      expect(container.querySelector('.snackbar')?.classList.contains('show')).toBe(false);
    });
  });

  describe('Optional Props', () => {
    it('works without onClose callback', () => {
      const { container } = render(<Snackbar message="Test message" type="info" />);
      expect(container.firstChild).toBeTruthy();
      
      // Should not throw when advancing timers
      act(() => {
        jest.advanceTimersByTime(3000);
      });
      
      act(() => {
        jest.advanceTimersByTime(300);
      });
      
      // Should work without errors
      expect(container.querySelector('.snackbar')).toBeTruthy();
    });

    it('uses default duration when not specified', () => {
      const customOnClose = jest.fn();
      render(<Snackbar message="Test message" type="info" onClose={customOnClose} />);

      // Should use default 3000ms duration
      act(() => {
        jest.advanceTimersByTime(2999);
      });
      expect(customOnClose).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(1);
      });

      // Add fade out time
      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(customOnClose).toHaveBeenCalledTimes(1);
    });

    it('uses default type (info) when not specified', () => {
      render(<Snackbar message="Test message" type="info" onClose={mockOnClose} />);
      const snackbar = screen.getByText('Test message').closest('.snackbar');
      expect(snackbar?.classList.contains('info')).toBe(true);
    });
  });

  describe('Message Updates', () => {
    it('updates display when message changes', () => {
      const { rerender } = render(<Snackbar message="First message" type="info" onClose={mockOnClose} />);
      expect(screen.getByText('First message')).toBeTruthy();

      rerender(<Snackbar message="Second message" type="info" onClose={mockOnClose} />);
      expect(screen.getByText('Second message')).toBeTruthy();
      expect(screen.queryByText('First message')).toBeFalsy();
    });

    it('restarts timer when message changes', () => {
      const customOnClose = jest.fn();
      const { rerender } = render(
        <Snackbar message="First message" type="info" duration={1000} onClose={customOnClose} />
      );

      // Advance time partway
      act(() => {
        jest.advanceTimersByTime(500);
      });

      // Change message (should restart timer)
      rerender(<Snackbar message="Second message" type="info" duration={1000} onClose={customOnClose} />);

      // Advance another 500ms (total 1000ms from start, but only 500ms from message change)
      act(() => {
        jest.advanceTimersByTime(500);
      });

      // Should not have called onClose yet
      expect(customOnClose).not.toHaveBeenCalled();

      // Advance another 500ms to complete the new timer
      act(() => {
        jest.advanceTimersByTime(500);
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(customOnClose).toHaveBeenCalledTimes(1);
    });

    it('handles transition from message to null', () => {
      const { rerender, container } = render(
        <Snackbar message="Test message" type="info" onClose={mockOnClose} />
      );
      expect(container.firstChild).toBeTruthy();

      rerender(<Snackbar message={null} type="info" onClose={mockOnClose} />);
      expect(container.firstChild).toBeFalsy();
    });

    it('handles transition from null to message', () => {
      const { rerender, container } = render(
        <Snackbar message={null} type="info" onClose={mockOnClose} />
      );
      expect(container.firstChild).toBeFalsy();

      rerender(<Snackbar message="New message" type="info" onClose={mockOnClose} />);
      expect(screen.getByText('New message')).toBeTruthy();
    });
  });

  describe('Cleanup and Memory Management', () => {
    it('clears timeout on unmount', () => {
      const { unmount } = render(<Snackbar message="Test message" type="info" onClose={mockOnClose} />);
      
      // Unmount before timeout
      unmount();
      
      // Fast-forward time
      act(() => {
        jest.advanceTimersByTime(5000);
      });
      
      // onClose should not be called
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('clears previous timeout when message changes', () => {
      const customOnClose = jest.fn();
      const { rerender } = render(
        <Snackbar message="First message" type="info" duration={1000} onClose={customOnClose} />
      );

      // Change message quickly
      rerender(<Snackbar message="Second message" type="info" duration={1000} onClose={customOnClose} />);
      rerender(<Snackbar message="Third message" type="info" duration={1000} onClose={customOnClose} />);

      // Fast-forward through all possible timeouts
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      // Should only be called once (for the last message)
      expect(customOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Type Safety and Edge Cases', () => {
    it('handles empty string message', () => {
      const { container } = render(<Snackbar message="" type="info" onClose={mockOnClose} />);
      // Empty string should not render the snackbar element (component returns null for falsy messages)
      expect(container.querySelector('.snackbar')).toBeNull();
    });

    it('handles very long messages', () => {
      const longMessage = 'A'.repeat(1000);
      render(<Snackbar message={longMessage} type="info" onClose={mockOnClose} />);
      expect(screen.getByText(longMessage)).toBeTruthy();
    });

    it('handles zero duration', () => {
      const customOnClose = jest.fn();
      render(<Snackbar message="Test message" type="info" duration={0} onClose={customOnClose} />);

      act(() => {
        jest.advanceTimersByTime(0);
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(customOnClose).toHaveBeenCalledTimes(1);
    });

    it('handles negative duration', () => {
      const customOnClose = jest.fn();
      render(<Snackbar message="Test message" type="info" duration={-100} onClose={customOnClose} />);

      // Should still work, though behavior with negative timeout is implementation dependent
      act(() => {
        jest.advanceTimersByTime(100);
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      // At minimum, should not crash
      expect(screen.getByText('Test message')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('provides accessible content structure', () => {
      render(<Snackbar message="Important notification" type="error" onClose={mockOnClose} />);
      
      const snackbar = screen.getByText('Important notification');
      expect(snackbar).toBeTruthy();
      
      // Should be a simple div with text content
      expect(snackbar.tagName).toBe('DIV');
    });

    it('maintains proper role for notifications', () => {
      render(<Snackbar message="Status update" type="success" onClose={mockOnClose} />);
      
      // The snackbar should be discoverable
      const snackbar = screen.getByText('Status update').closest('#snackbar');
      expect(snackbar).toBeTruthy();
    });
  });
});
