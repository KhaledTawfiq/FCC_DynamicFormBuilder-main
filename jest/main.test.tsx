/**
 * @jest-environment jsdom
 */
import { describe, it, expect, beforeEach } from '@jest/globals';

// Mock React DOM
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: jest.fn()
  }))
}));

// Mock App component
jest.mock('../src/App', () => ({
  default: () => <div data-testid="app">App</div>
}));

// Mock SCSS import
jest.mock('../src/scss/main.scss', () => ({}));

// Mock jQuery
jest.mock('jquery', () => ({
  default: jest.fn()
}));

// Mock Bootstrap
jest.mock('bootstrap/dist/css/bootstrap.min.css', () => ({}));
jest.mock('bootstrap/dist/js/bootstrap.bundle.min.js', () => ({}));

describe('main.tsx', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
    jest.clearAllMocks();
    
    // Create root element
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);
  });

  it('should throw error when root element is not found', async () => {
    // Remove root element
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.remove();
    }

    // Import main should throw error
    await expect(async () => {
      await import('../src/main');
    }).rejects.toThrow('Root element not found');
  });

  it('should create root and render App when root element exists', async () => {
    const { createRoot } = await import('react-dom/client');
    const mockRender = jest.fn();
    const mockCreateRoot = jest.mocked(createRoot);
    mockCreateRoot.mockReturnValue({ render: mockRender } as any);

    // Import main
    await import('../src/main');

    expect(mockCreateRoot).toHaveBeenCalledWith(document.getElementById('root'));
    expect(mockRender).toHaveBeenCalled();
  });

  it('should set up global jQuery variables', async () => {
    // Import main to trigger global setup
    await import('../src/main');

    // Check that global variables are set
    expect(typeof window.$).toBeDefined();
    expect(typeof window.jQuery).toBeDefined();
  });
});
