# Dynamic Form Builder

A React-based dynamic form builder with drag-and-drop functionality, built using jQuery FormBuilder. **Now fully migrated to TypeScript with modern SCSS architecture!**

## 🚀 Features

- **Dynamic Form Creation**: Add and remove form sections dynamically
- **Drag & Drop**: Intuitive field placement with drag-and-drop interface
- **Multiple Field Types**: Support for various input types (text, email, select, etc.)
- **JSON Export/Import**: Save and load form configurations
- **Responsive Design**: Bootstrap-based responsive UI
- **Section Management**: Organize forms into collapsible sections
- **TypeScript Support**: Full type safety and enhanced developer experience
- **Modern SCSS Architecture**: Organized 7-1 pattern with modern Sass features
- **Path Aliases**: Clean imports using `@/` prefix

## 🎨 SCSS Architecture

This project uses a modern SCSS architecture following the 7-1 pattern:

- **Variables & Mixins**: Centralized design tokens and reusable patterns
- **Component-based Styling**: Each component has its own SCSS file
- **Modern Syntax**: Uses `@use` and `@forward` (no deprecation warnings)
- **Responsive Design**: Mobile-first approach with breakpoint mixins

📖 **[View detailed SCSS documentation](./SCSS-ARCHITECTURE.md)**

## 📦 Available Field Types

- Text, Email, Password, URL, Tel
- Textarea, Number, Range, Color  
- Date, Time, DateTime-Local, Month, Week
- Select, Radio Group, Checkbox Group
- Button, File Upload, Hidden Input
- Autocomplete, Paragraph, Header

## 🛠️ Development

### Prerequisites
- Node.js 16+
- yarn

### Installation
```bash
yarn install
```

### Development Server
```bash
yarn dev
```

### Build for Production
```bash
yarn build
```

### TypeScript Type Checking
```bash
yarn type-check
```

### Linting
```bash
yarn lint
```

### Preview Production Build
```bash
yarn preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── FormBuilder.tsx              # Main form builder component
│   ├── FormConfiguration/
│   │   └── FormConfiguration.tsx    # Form configuration component
│   ├── Section/
│   │   └── Section.tsx              # Individual form section
│   ├── ActionButtons/
│   │   └── ActionButtons.tsx        # Action buttons component
│   ├── JsonModal/
│   │   └── JsonModal.tsx            # JSON display modal
│   ├── Snackbar/
│   │   └── Snackbar.tsx             # Toast notifications
│   ├── UI/
│   │   └── LoadingSpinner.tsx       # Loading spinner component
│   └── index.ts                     # Component exports
├── hooks/
│   └── useFormBuilder.ts            # Form builder custom hook
├── services/
│   └── apiService.ts                # API service layer
├── config/
│   └── constants.ts                 # Application constants
├── utils/
│   └── helpers.ts                   # Utility functions
├── types/
│   ├── index.ts                     # Type definitions
│   └── modules.d.ts                 # External module declarations
├── scss/                            # Modern SCSS architecture
│   ├── abstracts/                   # Variables, mixins, functions
│   ├── base/                        # Reset, animations, typography  
│   ├── components/                  # Component-specific styles
│   ├── layout/                      # Layout-related styles
│   ├── pages/                       # Page-specific styles
│   └── main.scss                    # Main SCSS entry point
├── assets/                          # Static assets
├── App.tsx                          # Main app component
└── main.tsx                         # App entry point
```

## 🎯 Usage

The form builder provides:
- **Add Section**: Create new form sections
- **View JSON**: Preview generated form structure
- **Submit**: Send form data to API
- **Load JSON**: Import existing form configurations

### TypeScript Features
- **Type Safety**: Compile-time error detection
- **IntelliSense**: Full auto-completion and error highlighting
- **Path Aliases**: Clean imports using `@/` prefix (e.g., `@/components`, `@/hooks`)
- **Interface-Based Design**: Clear component contracts

## 🔧 API Integration

Form submissions are sent to the configured API endpoint with proper authentication headers. The API service is fully typed with TypeScript interfaces.

## 📋 TypeScript Migration

This project has been fully migrated from JavaScript to TypeScript, providing:

- **100% Type Coverage**: All components and utilities are properly typed
- **Enhanced Developer Experience**: Better IDE support and error detection
- **Maintainable Codebase**: Self-documenting code through type definitions
- **Build-time Safety**: Catch errors before they reach production

### Key TypeScript Features Used:
- React.FC for functional components
- Custom interfaces for props and state
- Utility types for complex data structures
- Module declarations for external libraries
- Path mapping for cleaner imports

## 🏗️ Architecture

The application follows a modular TypeScript architecture:

- **Components**: Fully typed React components with proper interfaces
- **Hooks**: Custom hooks with typed return values
- **Services**: API layer with typed request/response interfaces
- **Types**: Centralized type definitions
- **Utils**: Typed utility functions

## 📄 License

This project is part of the FCC Dynamic Form Builder system.

---

## 🎉 Recent Updates

- **TypeScript Migration Complete**: Fully converted from JavaScript to TypeScript
- **Enhanced Type Safety**: All components now have proper type definitions
- **Improved Developer Experience**: Better IDE support and error detection
- **Clean Architecture**: Modular structure with path aliases
- **Zero Type Errors**: Strict TypeScript configuration enabled
