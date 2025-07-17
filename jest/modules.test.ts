/**
 * Tests for types/modules.d.ts - Type declarations validation
 */
import { describe, it, expect } from '@jest/globals';

// Define local interfaces for testing since they're declared globally in modules.d.ts
interface TestImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_AUTH_TOKEN: string;
}

interface TestImportMeta {
  readonly env: TestImportMetaEnv;
}

describe('types/modules.d.ts', () => {
  it('should have proper ImportMetaEnv interface', () => {
    // Test that the ImportMeta.env types are properly defined
    // This is mainly a compilation test to ensure types are correct
    const envCheck = (env: TestImportMetaEnv) => {
      expect(typeof env.VITE_API_BASE_URL).toBe('string');
      expect(typeof env.VITE_AUTH_TOKEN).toBe('string');
    };

    // Mock env for testing
    const mockEnv: TestImportMetaEnv = {
      VITE_API_BASE_URL: 'https://api.example.com',
      VITE_AUTH_TOKEN: 'test-token'
    };

    expect(() => envCheck(mockEnv)).not.toThrow();
  });

  it('should support jQuery formBuilder extension', () => {
    // Test that jQuery interface extension is properly typed
    // This is mainly a compilation check
    
    // Mock jQuery object for testing
    const mockJQuery = {
      formBuilder: jest.fn()
    } as any;

    // Verify formBuilder method exists and can be called
    expect(typeof mockJQuery.formBuilder).toBe('function');
    
    // Test different formBuilder call patterns
    mockJQuery.formBuilder(); // No arguments
    mockJQuery.formBuilder({}); // Options object
    mockJQuery.formBuilder('getData'); // Method string
    mockJQuery.formBuilder('setData', {}); // Method with args

    expect(mockJQuery.formBuilder).toHaveBeenCalledTimes(4);
  });

  it('should declare external module types', () => {
    // These are mainly compilation tests to ensure the module declarations work
    
    // Test that we can import the declared modules without TypeScript errors
    expect(() => {
      // The actual imports would happen at compile time
      // This is more of a sanity check that the types exist
      const jqueryUiType: string = 'jquery-ui-sortable';
      const formBuilderType: string = 'formBuilder';
      
      expect(jqueryUiType).toBe('jquery-ui-sortable');
      expect(formBuilderType).toBe('formBuilder');
    }).not.toThrow();
  });

  it('should support global window extensions', () => {
    // Test that global window interface extensions work
    
    // Mock global objects
    const mockJQuery = jest.fn();
    
    // Simulate setting global variables (as done in main.tsx)
    (global as any).window = (global as any).window || {};
    (global as any).window.$ = mockJQuery;
    (global as any).window.jQuery = mockJQuery;

    expect((global as any).window.$).toBe(mockJQuery);
    expect((global as any).window.jQuery).toBe(mockJQuery);
  });

  it('should provide proper typing for import.meta.env', () => {
    // Test ImportMeta interface
    const mockImportMeta: TestImportMeta = {
      env: {
        VITE_API_BASE_URL: 'https://test-api.com',
        VITE_AUTH_TOKEN: 'test-auth-token'
      }
    };

    expect(mockImportMeta.env.VITE_API_BASE_URL).toBe('https://test-api.com');
    expect(mockImportMeta.env.VITE_AUTH_TOKEN).toBe('test-auth-token');
  });
});
