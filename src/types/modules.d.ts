// Type declarations for external modules
declare module 'jquery-ui-sortable' {
  const sortable: any;
  export default sortable;
}

declare module 'formBuilder' {
  const formBuilder: any;
  export default formBuilder;
}

// Vite environment variables
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_AUTH_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Extend jQuery interface to include formBuilder
declare global {
  interface JQuery {
    formBuilder(options?: any): any;
    formBuilder(method: string, ...args: any[]): any;
  }
}
