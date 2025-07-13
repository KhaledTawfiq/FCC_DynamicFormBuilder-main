/**
 * Converts a string to PascalCase
 * @param str - The string to convert
 * @returns The PascalCase string
 */
export const toPascalCase = (str: string): string => {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => {
    return word.toUpperCase();
  }).replace(/\s+/g, '');
};

/**
 * Generates a unique ID
 * @returns A unique identifier
 */
export const generateUniqueId = (): string => {
  return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Debounce function to limit the rate at which a function can fire
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @returns The debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | undefined;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Deep clone an object
 * @param obj - The object to clone
 * @returns The cloned object
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T;
  if (typeof obj === "object") {
    const clonedObj: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone((obj as any)[key]);
      }
    }
    return clonedObj;
  }
  return obj;
};

/**
 * Format JSON with proper indentation
 * @param data - The data to format as JSON
 * @param spaces - Number of spaces for indentation (default: 2)
 * @returns Formatted JSON string
 */
export const formatJSON = (data: any, spaces: number = 2): string => {
  try {
    return JSON.stringify(data, null, spaces);
  } catch (error) {
    return '';
  }
};

/**
 * Validate if a string is valid JSON
 * @param str - The string to validate
 * @returns True if valid JSON, false otherwise
 */
export const isValidJSON = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

/**
 * Sanitize HTML to prevent XSS attacks
 * @param str - The string to sanitize
 * @returns Sanitized string
 */
export const sanitizeHTML = (str: string): string => {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};
