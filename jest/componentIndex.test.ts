/**
 * Tests for components/index.ts - Component exports
 */
import { describe, it, expect } from '@jest/globals';

// Mock all the component modules to avoid issues with complex dependencies
jest.mock('../src/components/FormBuilder', () => ({
  default: 'FormBuilder'
}));

jest.mock('../src/components/FormConfiguration/FormConfiguration', () => ({
  default: 'FormConfiguration'
}));

jest.mock('../src/components/Section/Section', () => ({
  default: 'Section'
}));

jest.mock('../src/components/ActionButtons/ActionButtons', () => ({
  default: 'ActionButtons'
}));

jest.mock('../src/components/JsonModal/JsonModal', () => ({
  default: 'JsonModal'
}));

jest.mock('../src/components/Snackbar/Snackbar', () => ({
  default: 'Snackbar'
}));

describe('components/index.ts', () => {
  it('should export all expected components', async () => {
    const componentExports = await import('../src/components/index');
    
    // Check that all expected exports are present
    expect(componentExports.FormBuilder).toBeDefined();
    expect(componentExports.FormConfiguration).toBeDefined();
    expect(componentExports.Section).toBeDefined();
    expect(componentExports.ActionButtons).toBeDefined();
    expect(componentExports.JsonModal).toBeDefined();
    expect(componentExports.Snackbar).toBeDefined();
  });

  it('should export the correct component values', async () => {
    const {
      FormBuilder,
      FormConfiguration,
      Section,
      ActionButtons,
      JsonModal,
      Snackbar
    } = await import('../src/components/index');
    
    // Since we're mocking the components as strings, they come as { default: 'ComponentName' }
    expect(FormBuilder).toEqual({ default: 'FormBuilder' });
    expect(FormConfiguration).toEqual({ default: 'FormConfiguration' });
    expect(Section).toEqual({ default: 'Section' });
    expect(ActionButtons).toEqual({ default: 'ActionButtons' });
    expect(JsonModal).toEqual({ default: 'JsonModal' });
    expect(Snackbar).toEqual({ default: 'Snackbar' });
  });

  it('should have 6 named exports', async () => {
    const componentExports = await import('../src/components/index');
    const exportNames = Object.keys(componentExports);
    
    expect(exportNames).toHaveLength(6);
    expect(exportNames).toEqual(
      expect.arrayContaining([
        'FormBuilder',
        'FormConfiguration', 
        'Section',
        'ActionButtons',
        'JsonModal',
        'Snackbar'
      ])
    );
  });
});
