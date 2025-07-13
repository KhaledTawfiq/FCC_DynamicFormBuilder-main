import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import LoadingSpinner from '../src/components/UI/LoadingSpinner';

describe('LoadingSpinner', () => {
  describe('Visibility', () => {
    it('renders nothing when isVisible is false', () => {
      const { container } = render(<LoadingSpinner isVisible={false} />);
      expect(container.firstChild).toBeFalsy();
    });

    it('renders spinner when isVisible is true', () => {
      const { container } = render(<LoadingSpinner isVisible={true} />);
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('Size', () => {
    it('applies medium size class by default', () => {
      const { container } = render(<LoadingSpinner isVisible={true} />);
      const loader = container.querySelector('.loader');
      expect(loader?.classList.contains('spinner-medium')).toBe(true);
    });

    it('applies small size class when size is small', () => {
      const { container } = render(<LoadingSpinner isVisible={true} size="small" />);
      const loader = container.querySelector('.loader');
      expect(loader?.classList.contains('spinner-small')).toBe(true);
    });

    it('applies medium size class when size is medium', () => {
      const { container } = render(<LoadingSpinner isVisible={true} size="medium" />);
      const loader = container.querySelector('.loader');
      expect(loader?.classList.contains('spinner-medium')).toBe(true);
    });

    it('applies large size class when size is large', () => {
      const { container } = render(<LoadingSpinner isVisible={true} size="large" />);
      const loader = container.querySelector('.loader');
      expect(loader?.classList.contains('spinner-large')).toBe(true);
    });
  });

  describe('Overlay', () => {
    it('does not apply overlay class by default', () => {
      const { container } = render(<LoadingSpinner isVisible={true} />);
      const loaderContainer = container.querySelector('.loader-container');
      expect(loaderContainer?.classList.contains('overlay')).toBe(false);
    });

    it('applies overlay class when overlay is true', () => {
      const { container } = render(<LoadingSpinner isVisible={true} overlay={true} />);
      const loaderContainer = container.querySelector('.loader-container');
      expect(loaderContainer?.classList.contains('overlay')).toBe(true);
    });

    it('does not apply overlay class when overlay is false', () => {
      const { container } = render(<LoadingSpinner isVisible={true} overlay={false} />);
      const loaderContainer = container.querySelector('.loader-container');
      expect(loaderContainer?.classList.contains('overlay')).toBe(false);
    });
  });

  describe('Structure', () => {
    it('has correct DOM structure', () => {
      const { container } = render(<LoadingSpinner isVisible={true} />);
      
      const loaderContainer = container.querySelector('.loader-container');
      expect(loaderContainer).toBeTruthy();
      
      const loader = loaderContainer?.querySelector('.loader');
      expect(loader).toBeTruthy();
    });

    it('applies correct base classes', () => {
      const { container } = render(<LoadingSpinner isVisible={true} />);
      
      const loaderContainer = container.querySelector('.loader-container');
      expect(loaderContainer?.classList.contains('loader-container')).toBe(true);
      
      const loader = container.querySelector('.loader');
      expect(loader?.classList.contains('loader')).toBe(true);
    });
  });

  describe('Props combination', () => {
    it('handles all props together', () => {
      const { container } = render(
        <LoadingSpinner 
          isVisible={true} 
          size="large" 
          overlay={true} 
        />
      );
      
      const loaderContainer = container.querySelector('.loader-container');
      expect(loaderContainer?.classList.contains('overlay')).toBe(true);
      
      const loader = container.querySelector('.loader');
      expect(loader?.classList.contains('spinner-large')).toBe(true);
    });

    it('handles visibility change', () => {
      const { container, rerender } = render(<LoadingSpinner isVisible={true} />);
      expect(container.firstChild).toBeTruthy();
      
      rerender(<LoadingSpinner isVisible={false} />);
      expect(container.firstChild).toBeFalsy();
    });
  });
});
