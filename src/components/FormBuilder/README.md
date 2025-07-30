# FormBuilder Component Architecture

This directory contains the refactored FormBuilder components, following React best practices for maintainability and readability.

## Structure

```
FormBuilder/
├── FormBuilder.tsx          # Main FormBuilder component
├── FormBuilderPreview.tsx   # Preview area for form elements
├── FormBuilderToolbar.tsx   # Toolbar with draggable elements
├── ElementPreview.tsx       # Individual element preview
├── ElementActions.tsx       # Action buttons for each element
├── EditDrawer.tsx          # Side drawer for editing elements
├── useFormBuilder.ts       # Custom hook for form logic
├── types.ts                # TypeScript interfaces
├── utils.ts                # Utility functions and defaults
├── index.ts                # Component exports
└── README.md               # This file
```

## Components

### FormBuilder (Main Component)
- **Purpose**: Main orchestrator component
- **Props**: `FormBuilderProps`
- **Features**: Uses custom hook for state management, renders preview and toolbar

### FormBuilderPreview
- **Purpose**: Displays form elements with actions
- **Features**: Handles empty state, renders element list with actions

### FormBuilderToolbar
- **Purpose**: Displays draggable form elements
- **Features**: Click to add elements to form

### ElementPreview
- **Purpose**: Renders individual form element previews
- **Features**: Supports all form element types (Header, TextInput, Dropdown, etc.)

### ElementActions
- **Purpose**: Action buttons for each form element
- **Features**: Move up/down, edit, delete functionality

### EditDrawer
- **Purpose**: Side panel for editing element properties
- **Features**: ESC key support, backdrop click, prevents body scroll

### useFormBuilder (Custom Hook)
- **Purpose**: Manages form state and operations
- **Features**: Add/remove/update elements, element ordering, edit state management

## Key Features

1. **Full Type Safety**: Complete TypeScript coverage
2. **Custom Hook Pattern**: Separates logic from UI
3. **Component Composition**: Small, focused components
4. **No External Dependencies**: Pure React implementation
5. **Accessibility**: ARIA labels, keyboard navigation
6. **Performance**: useCallback for event handlers, proper memoization

## Usage

```tsx
import { FormBuilder } from './components/FormBuilder';

<FormBuilder
  sectionId="section_1"
  sectionUniqueId="unique_1"
  initialData={[]}
  onDataChange={(data) => console.log(data)}
  toolbarItems={toolbarItems}
  buildWrapId="form_builder_1"
/>
```

## Migration from Old FormBuilder

The new structure maintains the same API while providing better:
- **Readability**: Smaller, focused components
- **Maintainability**: Clear separation of concerns
- **Testability**: Each component can be tested independently
- **Performance**: Better optimization opportunities
- **Developer Experience**: Better TypeScript support and IntelliSense
