# SCSS Architecture Documentation

This project has been modernized to use SCSS with a well-organized 7-1 architecture pattern. The CSS has been completely refactored to use modern Sass features including `@use`, `@forward`, variables, mixins, and proper modularization.

## Architecture Overview

The SCSS is organized using the 7-1 pattern:

```
src/scss/
├── abstracts/          # Variables, mixins, functions
├── base/              # Reset, animations, typography
├── components/        # Component-specific styles
├── layout/           # Layout-related styles
├── pages/            # Page-specific styles
└── main.scss         # Main entry point
```

## File Structure

### 📁 `abstracts/`
Contains Sass tools, helper files, variables, and configuration. These files don't output any CSS by themselves.

- `_variables.scss` - All project variables (colors, spacing, breakpoints, etc.)
- `_mixins.scss` - Reusable mixins for common patterns
- `_index.scss` - Forwards all abstracts for easy importing

### 📁 `base/`
Contains boilerplate code for the project including reset rules, animations, and base typography.

- `_reset.scss` - Reset and base styles
- `_animations.scss` - Keyframe animations
- `_index.scss` - Forwards all base styles

### 📁 `layout/`
Contains styling for layout components like header, footer, navigation, grid system, etc.

- `_app.scss` - Main app layout styles
- `_form-builder.scss` - Form builder specific layout
- `_index.scss` - Forwards all layout styles

### 📁 `components/`
Contains styles for individual components. Each component gets its own file.

- `_buttons.scss` - Button styles and variants
- `_accordion.scss` - Accordion component styles
- `_loader.scss` - Loading spinner styles
- `_snackbar.scss` - Notification styles
- `_drag-drop.scss` - Drag and drop interaction styles
- `_sections.scss` - Section and container styles
- `_index.scss` - Forwards all component styles

### 📁 `pages/`
Contains page-specific styles that don't belong to components or layout.

- `_form-builder.scss` - Form builder page specific styles
- `_index.scss` - Forwards all page styles

### 📄 `main.scss`
The main entry point that imports all other files using the modern `@use` directive.

## Key Features

### Modern Sass Syntax
- Uses `@use` and `@forward` instead of deprecated `@import`
- Proper variable scoping and namespacing
- No deprecation warnings

### Variables System
All variables are centralized in `_variables.scss`:

```scss
// Colors
$primary-color: #007bff;
$danger-color: #ad0909;
$success-color: #285735;

// Spacing
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 15px;

// Breakpoints
$mobile-max: 481px;
```

### Mixins Library
Reusable mixins for common patterns:

```scss
@include flex-center;           // Centers content
@include position-sticky;       // Sticky positioning
@include drag-styles;          // Drag and drop styles
@include mobile-responsive;    // Mobile breakpoint
```

### Component Organization
Each component has its own dedicated SCSS file, making it easy to:
- Find and modify component-specific styles
- Maintain consistent styling patterns
- Debug and troubleshoot issues
- Remove unused styles

## Usage

### Importing Styles
The main SCSS file is imported in `main.tsx`:

```tsx
import './scss/main.scss'
```

### Development
The SCSS automatically compiles when running the development server:

```bash
yarn dev
```

### Building
SCSS is compiled during the build process:

```bash
yarn build
```

## Migration from CSS

The following CSS files have been converted and organized:

- `src/index.css` → `src/scss/base/_reset.scss`
- `src/App.css` → `src/scss/layout/_app.scss`
- `src/styles/FormBuilder.css` → Split across multiple component files
- `src/styles/OriginalFormBuilder.css` → Merged and modernized

## Benefits

1. **Better Organization**: Styles are logically grouped and easy to find
2. **Maintainability**: Each component has its own file
3. **Reusability**: Variables and mixins promote consistency
4. **Modern Syntax**: Uses latest Sass features without deprecation warnings
5. **Performance**: Better tree-shaking and optimization
6. **Developer Experience**: Clear structure and naming conventions

## Adding New Styles

### For a new component:
1. Create `_component-name.scss` in `src/scss/components/`
2. Add `@use '../abstracts' as *;` at the top
3. Forward it in `src/scss/components/_index.scss`

### For new variables:
Add them to `src/scss/abstracts/_variables.scss`

### For new mixins:
Add them to `src/scss/abstracts/_mixins.scss`

## Browser Support
The compiled CSS supports all modern browsers and includes necessary vendor prefixes for animations and transitions.
