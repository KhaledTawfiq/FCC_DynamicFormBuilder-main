import { describe, it, expect } from '@jest/globals';
import type { 
  FormConfig, 
  FieldConfig, 
  OptionValue, 
  Section, 
  SectionProps,
  UseFormBuilderReturn,
  SnackbarProps,
  SnackbarType,
  ActionButtonsProps,
  JsonModalProps,
  FormConfigurationProps,
  InputSet
} from '../src/types';

describe('Type Definitions', () => {
  describe('FormConfig', () => {
    it('should accept valid FormConfig object', () => {
      const formConfig: FormConfig = {
        formKey: 'test-key',
        companyId: 'test-company', 
        version: '1.0.0'
      };
      
      expect(formConfig.formKey).toBe('test-key');
      expect(formConfig.companyId).toBe('test-company');
      expect(formConfig.version).toBe('1.0.0');
    });

    it('should accept FormConfig with optional fields', () => {
      const formConfig: FormConfig = {
        formId: 'form-123',
        formTitle: 'Test Form',
        formKey: 'test-key',
        companyId: 'test-company',
        version: '1.0.0',
        formClass: 'form-class',
        disableInjectedStyle: true,
        disabledActionButtons: ['save'],
        disabledAttrs: ['class'],
        disabledFieldButtons: { text: ['copy'] },
        disabledSubtypes: { button: ['submit'] },
        editOnAdd: true,
        fields: [],
        inputSets: [],
        typeUserAttrs: { text: { maxlength: 100 } },
        typeUserEvents: { text: { click: 'handleClick' } }
      };
      
      expect(formConfig.formId).toBe('form-123');
      expect(formConfig.formTitle).toBe('Test Form');
      expect(formConfig.disableInjectedStyle).toBe(true);
      expect(formConfig.editOnAdd).toBe(true);
      expect(Array.isArray(formConfig.fields)).toBe(true);
    });
  });

  describe('FieldConfig', () => {
    it('should accept basic field configuration', () => {
      const field: FieldConfig = {
        label: 'Text Field',
        type: 'text'
      };
      
      expect(field.label).toBe('Text Field');
      expect(field.type).toBe('text');
    });

    it('should accept field with all properties', () => {
      const field: FieldConfig = {
        label: 'Complete Field',
        type: 'text',
        required: true,
        description: 'A complete field example',
        subtype: 'email',
        className: 'form-control',
        name: 'email_field',
        value: 'default@example.com',
        values: [
          { label: 'Option 1', value: 'opt1' },
          { label: 'Option 2', value: 'opt2', selected: true }
        ],
        placeholder: 'Enter email',
        maxlength: 255,
        rows: 3,
        cols: 40,
        min: 1,
        max: 100,
        step: 1,
        multiple: false,
        other: false,
        toggle: false,
        inline: true,
        style: 'color: blue',
        access: true,
        userData: ['custom1', 'custom2']
      };
      
      expect(field.required).toBe(true);
      expect(field.values).toHaveLength(2);
      expect(field.values?.[1].selected).toBe(true);
      expect(field.userData).toContain('custom1');
    });
  });

  describe('OptionValue', () => {
    it('should accept basic option value', () => {
      const option: OptionValue = {
        label: 'Option Label',
        value: 'option_value'
      };
      
      expect(option.label).toBe('Option Label');
      expect(option.value).toBe('option_value');
    });

    it('should accept option value with selected state', () => {
      const option: OptionValue = {
        label: 'Selected Option',
        value: 'selected_value',
        selected: true
      };
      
      expect(option.selected).toBe(true);
    });
  });

  describe('Section', () => {
    it('should accept basic section', () => {
      const section: Section = {
        id: 'section-1',
        title: 'Section Title',
        fields: []
      };
      
      expect(section.id).toBe('section-1');
      expect(section.title).toBe('Section Title');
      expect(Array.isArray(section.fields)).toBe(true);
    });

    it('should accept section with fields', () => {
      const section: Section = {
        id: 'section-1',
        title: 'Section with Fields',
        fields: [
          { label: 'Field 1', type: 'text' },
          { label: 'Field 2', type: 'select' }
        ]
      };
      
      expect(section.fields).toHaveLength(2);
      expect(section.fields[0].type).toBe('text');
    });

    it('should accept section with formData', () => {
      const section: Section = {
        id: 'section-1',
        title: 'Section with Data',
        fields: [],
        formData: '{"field1": "value1"}'
      };
      
      expect(section.formData).toBe('{"field1": "value1"}');
    });
  });

  describe('Props Interfaces', () => {
    it('should define SnackbarProps correctly', () => {
      const props: SnackbarProps = {
        message: 'Test message',
        type: 'success' as SnackbarType,
        onClose: () => {}
      };
      
      expect(props.message).toBe('Test message');
      expect(props.type).toBe('success');
      expect(typeof props.onClose).toBe('function');
    });

    it('should define ActionButtonsProps correctly', () => {
      const props: ActionButtonsProps = {
        onAddSection: () => {},
        onViewJson: () => {},
        onSubmit: () => {},
        onLoadJson: () => {},
        isSubmitting: false,
        isLoading: false
      };
      
      expect(typeof props.onAddSection).toBe('function');
      expect(typeof props.onViewJson).toBe('function');
      expect(typeof props.onSubmit).toBe('function');
      expect(typeof props.onLoadJson).toBe('function');
      expect(props.isSubmitting).toBe(false);
      expect(props.isLoading).toBe(false);
    });

    it('should define JsonModalProps correctly', () => {
      const props: JsonModalProps = {
        isOpen: true,
        jsonData: { test: 'data' },
        onClose: () => {}
      };
      
      expect(props.isOpen).toBe(true);
      expect(props.jsonData).toEqual({ test: 'data' });
      expect(typeof props.onClose).toBe('function');
    });

    it('should define FormConfigurationProps correctly', () => {
      const props: FormConfigurationProps = {
        formConfig: {
          formKey: 'test',
          companyId: 'test',
          version: '1.0.0'
        },
        onConfigChange: () => {}
      };
      
      expect(props.formConfig.formKey).toBe('test');
      expect(typeof props.onConfigChange).toBe('function');
    });

    it('should define InputSet correctly', () => {
      const inputSet: InputSet = {
        label: 'Test Input Set'
      };
      
      expect(inputSet.label).toBe('Test Input Set');
      
      const inputSetWithOptional: InputSet = {
        label: 'Complete Input Set',
        name: 'test_set',
        icon: 'fa fa-cog'
      };
      
      expect(inputSetWithOptional.name).toBe('test_set');
      expect(inputSetWithOptional.icon).toBe('fa fa-cog');
    });
  });

  describe('Type Unions', () => {
    it('should handle SnackbarType union correctly', () => {
      const types: SnackbarType[] = ['info', 'success', 'error', 'warning'];
      
      types.forEach(type => {
        const snackbar: SnackbarProps = {
          message: `Test ${type}`,
          type: type
        };
        
        expect(snackbar.type).toBe(type);
      });
    });
  });

  describe('Hook Return Types', () => {
    it('should define UseFormBuilderReturn correctly', () => {
      // We can't easily test the actual hook return, but we can verify the type structure
      const mockReturn: UseFormBuilderReturn = {
        formConfig: {
          formKey: 'test',
          companyId: 'test',
          version: '1.0.0'
        },
        sections: [],
        formBuilderOptions: {
          controlOrder: ['text', 'select']
        },
        isSubmitting: false,
        isLoadingForm: false,
        addSection: () => {},
        removeSection: () => {},
        updateSection: () => {},
        reorderSections: () => {},
        generateFormData: () => ({ formattedTemplateJson: '{}' }),
        submitForm: async () => {},
        loadJson: async () => {},
        setFormConfig: () => {}
      };
      
      expect(Array.isArray(mockReturn.sections)).toBe(true);
      expect(typeof mockReturn.addSection).toBe('function');
      expect(typeof mockReturn.generateFormData).toBe('function');
      expect(typeof mockReturn.submitForm).toBe('function');
      expect(typeof mockReturn.loadJson).toBe('function');
    });
  });

  describe('Type Safety', () => {
    it('should enforce required properties', () => {
      // This test ensures TypeScript compiler catches missing required properties
      
      // FormConfig requires formKey, companyId, version
      const validConfig: FormConfig = {
        formKey: 'required',
        companyId: 'required',
        version: 'required'
      };
      
      expect(validConfig.formKey).toBeDefined();
      expect(validConfig.companyId).toBeDefined();
      expect(validConfig.version).toBeDefined();
    });

    it('should allow optional properties to be undefined', () => {
      const config: FormConfig = {
        formKey: 'test',
        companyId: 'test',
        version: '1.0.0'
      };
      
      // Optional properties can be undefined
      expect(config.formTitle).toBeUndefined();
      expect(config.formId).toBeUndefined();
      expect(config.fields).toBeUndefined();
    });

    it('should enforce correct property types', () => {
      const field: FieldConfig = {
        label: 'Test Field',
        type: 'text',
        required: true, // boolean
        maxlength: 100, // number
        values: [      // array
          { label: 'Option', value: 'opt' }
        ]
      };
      
      expect(typeof field.required).toBe('boolean');
      expect(typeof field.maxlength).toBe('number');
      expect(Array.isArray(field.values)).toBe(true);
    });
  });

  describe('Complex Type Combinations', () => {
    it('should handle nested type structures', () => {
      const complexConfig: FormConfig = {
        formKey: 'complex',
        companyId: 'test',
        version: '1.0.0',
        fields: [
          {
            label: 'Select Field',
            type: 'select',
            values: [
              { label: 'First', value: '1', selected: true },
              { label: 'Second', value: '2' }
            ]
          }
        ],
        disabledFieldButtons: {
          text: ['copy', 'remove'],
          select: ['edit']
        },
        typeUserAttrs: {
          text: { placeholder: 'Enter text' },
          select: { multiple: true }
        }
      };
      
      expect(complexConfig.fields?.[0].values?.[0].selected).toBe(true);
      expect(complexConfig.disabledFieldButtons?.text).toContain('copy');
      expect(complexConfig.typeUserAttrs?.text.placeholder).toBe('Enter text');
    });

    it('should handle function types in props', () => {
      const props: SectionProps = {
        section: {
          id: 'test',
          title: 'Test',
          fields: []
        },
        index: 0,
        formBuilderOptions: {
          controlOrder: ['text']
        },
        onRemove: (index: number) => {
          expect(typeof index).toBe('number');
        },
        onUpdate: (index: number, section: Section) => {
          expect(typeof index).toBe('number');
          expect(typeof section).toBe('object');
        },
        onDragStart: (index: number) => {
          expect(typeof index).toBe('number');
        },
        onDragOver: (index: number) => {
          expect(typeof index).toBe('number');
        },
        onDrop: (index: number) => {
          expect(typeof index).toBe('number');
        },
        onReorder: (fromIndex: number, toIndex: number) => {
          expect(typeof fromIndex).toBe('number');
          expect(typeof toIndex).toBe('number');
        }
      };
      
      // Test function signatures
      props.onRemove(0);
      props.onUpdate(0, props.section);
      if (props.onDragStart) props.onDragStart(0);
      if (props.onDragOver) props.onDragOver(0);
      if (props.onDrop) props.onDrop(0);
      if (props.onReorder) props.onReorder(0, 1);
    });
  });
});
