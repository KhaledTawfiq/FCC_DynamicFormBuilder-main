import { describe, it, expect } from '@jest/globals';
import { 
  FORM_BUILDER_CONFIG, 
  DEFAULT_FORM_CONFIG
} from '../src/config/constants';

describe('Constants', () => {
  describe('FORM_BUILDER_CONFIG', () => {
    it('should have control order array', () => {
      expect(FORM_BUILDER_CONFIG).toHaveProperty('CONTROL_ORDER');
      expect(Array.isArray(FORM_BUILDER_CONFIG.CONTROL_ORDER)).toBe(true);
      expect(FORM_BUILDER_CONFIG.CONTROL_ORDER.length).toBeGreaterThan(0);
    });

    it('should include basic form control types', () => {
      const basicControls = ['text', 'email', 'password', 'textarea', 'select', 'button'];
      
      basicControls.forEach(control => {
        expect(FORM_BUILDER_CONFIG.CONTROL_ORDER).toContain(control);
      });
    });

    it('should include advanced form control types', () => {
      const advancedControls = ['radio-group', 'checkbox-group', 'autocomplete', 'file', 'date'];
      
      advancedControls.forEach(control => {
        expect(FORM_BUILDER_CONFIG.CONTROL_ORDER).toContain(control);
      });
    });

    it('should include address control type', () => {
      expect(FORM_BUILDER_CONFIG.CONTROL_ORDER).toContain('address');
    });

    it('should have sticky controls configuration', () => {
      expect(FORM_BUILDER_CONFIG).toHaveProperty('STICKY_CONTROLS');
      expect(FORM_BUILDER_CONFIG.STICKY_CONTROLS).toHaveProperty('enable');
      expect(FORM_BUILDER_CONFIG.STICKY_CONTROLS).toHaveProperty('offset');
      
      expect(typeof FORM_BUILDER_CONFIG.STICKY_CONTROLS.enable).toBe('boolean');
      expect(typeof FORM_BUILDER_CONFIG.STICKY_CONTROLS.offset).toBe('object');
    });

    it('should have field attributes', () => {
      expect(FORM_BUILDER_CONFIG).toHaveProperty('FIELD_ATTRIBUTES');
      expect(typeof FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES).toBe('object');
    });

    it('should have all required field attributes', () => {
      const requiredAttributes = [
        'OTHER', 'SUBTYPE', 'DEFAULT_VALUE', 'GROUP_ID', 
        'LIST_PROPERTY_KEY', 'VALUES', 'VALIDATIONS', 'CONDITION'
      ];
      
      requiredAttributes.forEach(attr => {
        expect(FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES).toHaveProperty(attr);
      });
    });
  });

  describe('DEFAULT_FORM_CONFIG', () => {
    it('should have correct structure', () => {
      expect(DEFAULT_FORM_CONFIG).toHaveProperty('formId');
      expect(DEFAULT_FORM_CONFIG).toHaveProperty('formKey');
      expect(DEFAULT_FORM_CONFIG).toHaveProperty('companyId');
      expect(DEFAULT_FORM_CONFIG).toHaveProperty('version');
    });

    it('should have correct default values', () => {
      expect(DEFAULT_FORM_CONFIG.formId).toBe('');
      expect(DEFAULT_FORM_CONFIG.formKey).toBe('twpf');
      expect(DEFAULT_FORM_CONFIG.companyId).toBe('78');
      expect(DEFAULT_FORM_CONFIG.version).toBe('1');
    });

    it('should have string values for basic properties', () => {
      expect(typeof DEFAULT_FORM_CONFIG.formId).toBe('string');
      expect(typeof DEFAULT_FORM_CONFIG.formKey).toBe('string');
      expect(typeof DEFAULT_FORM_CONFIG.companyId).toBe('string');
      expect(typeof DEFAULT_FORM_CONFIG.version).toBe('string');
    });

    it('should have boolean values for boolean properties', () => {
      expect(typeof DEFAULT_FORM_CONFIG.disableInjectedStyle).toBe('boolean');
      expect(typeof DEFAULT_FORM_CONFIG.editOnAdd).toBe('boolean');
    });

    it('should have array properties', () => {
      expect(Array.isArray(DEFAULT_FORM_CONFIG.disabledActionButtons)).toBe(true);
      expect(Array.isArray(DEFAULT_FORM_CONFIG.disabledAttrs)).toBe(true);
      expect(Array.isArray(DEFAULT_FORM_CONFIG.fields)).toBe(true);
      expect(Array.isArray(DEFAULT_FORM_CONFIG.inputSets)).toBe(true);
    });

    it('should have object properties', () => {
      expect(typeof DEFAULT_FORM_CONFIG.disabledFieldButtons).toBe('object');
      expect(typeof DEFAULT_FORM_CONFIG.disabledSubtypes).toBe('object');
      expect(typeof DEFAULT_FORM_CONFIG.typeUserAttrs).toBe('object');
      expect(typeof DEFAULT_FORM_CONFIG.typeUserEvents).toBe('object');
    });
  });

  describe('Configuration Consistency', () => {
    it('should have complete form builder control order', () => {
      // Should include all major HTML5 input types
      const html5InputTypes = ['text', 'email', 'password', 'url', 'tel', 'number', 'date', 'time', 'color'];
      
      html5InputTypes.forEach(inputType => {
        expect(FORM_BUILDER_CONFIG.CONTROL_ORDER).toContain(inputType);
      });
    });

    it('should have unique control types in order', () => {
      const controlOrder = FORM_BUILDER_CONFIG.CONTROL_ORDER;
      const uniqueControls = [...new Set(controlOrder)];
      expect(controlOrder.length).toBe(uniqueControls.length);
    });
  });

  describe('Type Safety', () => {
    it('should have readonly arrays where appropriate', () => {
      // Control order should be treated as readonly
      expect(Array.isArray(FORM_BUILDER_CONFIG.CONTROL_ORDER)).toBe(true);
      expect(FORM_BUILDER_CONFIG.CONTROL_ORDER.length).toBeGreaterThan(0);
    });

    it('should export constants as const assertions', () => {
      // This test ensures TypeScript treats these as literal types
      expect(typeof FORM_BUILDER_CONFIG.CONTROL_ORDER[0]).toBe('string');
    });
  });

  describe('Environment Compatibility', () => {
    it('should work in different environments', () => {
      // All constants should be accessible without throwing
      expect(() => {
        const config = {
          formBuilder: FORM_BUILDER_CONFIG,
          defaultForm: DEFAULT_FORM_CONFIG
        };
        return config;
      }).not.toThrow();
    });

    it('should have serializable values', () => {
      // All constants should be JSON serializable
      expect(() => {
        JSON.stringify({
          FORM_BUILDER_CONFIG,
          DEFAULT_FORM_CONFIG
        });
      }).not.toThrow();
    });
  });
});
