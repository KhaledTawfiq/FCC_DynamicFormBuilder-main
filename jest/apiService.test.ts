/**
 * Tests for services/apiService.ts - Basic API Service tests
 */
import { describe, it, expect } from '@jest/globals';

describe('ApiService', () => {
  it('should be importable', () => {
    // Basic test to ensure the module can be imported
    expect(() => {
      require('../src/services/apiService');
    }).not.toThrow();
  });

  it('should export default service', async () => {
    const apiService = await import('../src/services/apiService');
    expect(apiService.default).toBeDefined();
  });

  it('should have required methods', async () => {
    const { default: apiService } = await import('../src/services/apiService');
    expect(typeof apiService.submitForm).toBe('function');
    expect(typeof apiService.loadForm).toBe('function');
    expect(typeof apiService.setHeaders).toBe('function');
  });
});
