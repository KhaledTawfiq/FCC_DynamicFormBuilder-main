import $ from 'jquery';
import { FORM_BUILDER_CONFIG } from '../../config/constants';

/**
 * FormBuilder configuration and options
 */
export const getFormBuilderOptions = () => ({
  controlOrder: FORM_BUILDER_CONFIG.CONTROL_ORDER,
  stickyControls: FORM_BUILDER_CONFIG.STICKY_CONTROLS,
  typeUserAttrs: {
    date: {
      defaultValue: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.DEFAULT_VALUE,
      other: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.OTHER,
      subtype: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.SUBTYPE,
      groupId: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.GROUP_ID,
      values: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.VALUES,
      validations: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.VALIDATIONS,
      condition: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.CONDITION,
    },
    text: {
      defaultValue: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.DEFAULT_VALUE,
      other: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.OTHER,
      subtype: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.SUBTYPE,
      groupId: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.GROUP_ID,
      values: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.VALUES,
      validations: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.VALIDATIONS,
      condition: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.CONDITION,
    },
    email: {
      defaultValue: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.DEFAULT_VALUE,
      other: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.OTHER,
      subtype: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.SUBTYPE,
      groupId: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.GROUP_ID,
      values: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.VALUES,
      validations: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.VALIDATIONS,
      condition: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.CONDITION,
    },
    password: {
      defaultValue: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.DEFAULT_VALUE,
      subtype: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.SUBTYPE,
      groupId: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.GROUP_ID,
      validations: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.VALIDATIONS,
      condition: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.CONDITION,
    },
    select: {
      defaultValue: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.DEFAULT_VALUE,
      other: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.OTHER,
      subtype: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.SUBTYPE,
      groupId: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.GROUP_ID,
      validations: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.VALIDATIONS,
      condition: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.CONDITION,
    },
    "radio-group": {
      defaultValue: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.DEFAULT_VALUE,
      subtype: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.SUBTYPE,
      groupId: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.GROUP_ID,
      condition: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.CONDITION,
      validations: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.VALIDATIONS,
    },
    "checkbox-group": {
      defaultValue: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.DEFAULT_VALUE,
      subtype: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.SUBTYPE,
      groupId: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.GROUP_ID,
      listPropertyKey: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.LIST_PROPERTY_KEY,
      condition: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.CONDITION,
      validations: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.VALIDATIONS,
    },
    textarea: {
      defaultValue: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.DEFAULT_VALUE,
      other: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.OTHER,
      subtype: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.SUBTYPE,
      groupId: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.GROUP_ID,
      values: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.VALUES,
      validations: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.VALIDATIONS,
      condition: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.CONDITION,
    },
    address: {
      defaultValue: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.DEFAULT_VALUE,
      subtype: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.SUBTYPE,
      groupId: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.GROUP_ID,
      validations: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.VALIDATIONS,
      condition: FORM_BUILDER_CONFIG.FIELD_ATTRIBUTES.CONDITION,
      includeAddressCountry: {
        label: 'Include Address Country',
        type: 'checkbox',
        value: false
      },
      includeAddressApartment: {
        label: 'Include Address Apartment',
        type: 'checkbox', 
        value: false
      },
      access: false // Hide the Access option for address fields
    },
  }
});

/**
 * Initialize jQuery libraries and custom controls
 */
export const initializeLibraries = async (): Promise<void> => {
  try {
    // Make jQuery globally available
    window.$ = window.jQuery = $;

    // Dynamically import jQuery UI and formBuilder
    await import("jquery-ui-sortable");
    await import("formBuilder");

    // Import and register address control
    const { registerAddressControl } = await import('../controls/addressControl');
    registerAddressControl();
  } catch (error) {
    // Error loading libraries - fail silently
  }
};
