/**
 * Address control registration for FormBuilder
 */

export const registerAddressControl = (): void => {
  if (typeof window !== 'undefined' && window.$ && (window.$ as any).fn.formBuilder) {
    // Initialize fbControls array if not exists
    if (!window.fbControls) {
      window.fbControls = [];
    }

    // Add address control to fbControls
    window.fbControls.push(function (controlClass: any) {
      class controlAddress extends controlClass {
        
        static get definition() {
            return {
            icon: '🏠︎',
            i18n: {
              default: 'Address'
            }
            };
        }

        build() {
          const { 
            name = 'address', 
            required = false, 
            placeholder = 'Enter address label',
            value = '',
          } = this.config;
          
          // Build the main address input field
          let html = `<input type="text" class="form-control" name="${name}" placeholder="${placeholder}" value="${value}" ${required ? 'required' : ''}>`;
          
          return html;
        }

        onRender() {
          const self = this;
          
          // Listen for FormBuilder events that indicate configuration changes
          if (self.$control) {
            // Listen for changes in the attribute panel
            const $formBuilder = self.$control.closest('.form-builder');
            
            // Listen for checkbox changes in the attribute panel
            $formBuilder.on('change', 'input[name="includeAddressCountry"], input[name="includeAddressApartment"]', function() {
              setTimeout(() => {
                self.rebuild();
              }, 100);
            });
            
            // Listen for any field update events
            $formBuilder.on('fieldUpdated', function() {
              setTimeout(() => {
                self.rebuild();
              }, 100);
            });
          }
          
          return this;
        }

        // Method to rebuild the control when config changes
        rebuild() {
          if (this.$control && this.$control.length > 0) {
            const newHtml = this.build();
            this.$control.replaceWith(newHtml);
            // Update the $control reference
            this.$control = $(this.$control.parent()).find(`[name="${this.config.name}"]`);
          }
        }
      }

      // Register the control
      controlClass.register('address', controlAddress);
      return controlAddress;
    });
  }
};
