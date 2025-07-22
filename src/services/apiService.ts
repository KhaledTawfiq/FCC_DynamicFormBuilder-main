/**
 * API Service for form builder operations
 */

import { FormConfig } from '../types';
import axios, { AxiosInstance, AxiosError } from 'axios';

// API Configuration
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const authToken = import.meta.env.VITE_AUTH_TOKEN;

interface SubmitData {
  key: string;
  version: string;
  companyId: string;
  template: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Define possible error response structures
interface ApiErrorResponse {
  message?: string;
  error?: string;
  Error?: string;
  Message?: string;
  details?: string;
  [key: string]: any; // Allow other properties
}

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor(baseUrl: string = apiBaseUrl) {
    // Create axios instance with base configuration
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      timeout: 30000, // 30 seconds timeout
      headers: {
        'Content-Type': 'application/json',
        'accept': "application/json",
        'Access-Control-Allow-Origin': "*",
        'Authorization': `Bearer ${authToken}`
      }
    });

    // Add request interceptor for logging
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
          headers: config.headers,
          data: config.data
        });
        return config;
      },
      (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for logging
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
          status: response.status,
          data: response.data
        });
        return response;
      },
      (error) => {
        console.error(`❌ API Response Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
          status: error.response?.status,
          message: error.message,
          data: error.response?.data
        });
        return Promise.reject(error);
      }
    );
  }

  setHeaders(headers: Record<string, string>) {
    this.axiosInstance.defaults.headers = {
      ...this.axiosInstance.defaults.headers,
      ...headers
    };
  }

  private handleApiError(error: any): ApiResponse {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      
      // Handle different types of errors
      if (axiosError.code === 'ECONNABORTED') {
        return { success: false, error: 'Request timeout. Please try again.' };
      }
      
      if (axiosError.response) {
        // Server responded with error status
        const status = axiosError.response.status;
        const statusText = axiosError.response.statusText;
        
        // Safely extract error message from response data
        const responseData = axiosError.response.data;
        const errorMessage = responseData?.message || 
                            responseData?.error || 
                            responseData?.Error || 
                            responseData?.Message ||
                            responseData?.details;
        
        switch (status) {
          case 401:
            return { 
              success: false, 
              error: errorMessage || 'Unauthorized. Please check your credentials.' 
            };
          case 403:
            return { 
              success: false, 
              error: errorMessage || 'Forbidden. You do not have permission to access this resource.' 
            };
          case 404:
            return { 
              success: false, 
              error: errorMessage || 'Resource not found.' 
            };
          case 500:
            return { 
              success: false, 
              error: errorMessage || 'Internal server error. Please try again later.' 
            };
          default:
            return { 
              success: false, 
              error: `Server error: ${status} ${statusText}${
                errorMessage ? ` - ${errorMessage}` : ''
              }` 
            };
        }
      } else if (axiosError.request) {
        // Network error
        return { success: false, error: 'Network error. Please check your connection and try again.' };
      }
    }
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }

  /**
   * Submits form data to the API.
   * @param data - The form data to submit.
   * @returns A promise that resolves to the API response.
   */
  async submitForm(data: SubmitData): Promise<ApiResponse> {
    try {
      this.setHeaders({
        'version': data.version,
        'companyId': data.companyId,
      });
      
      const response = await this.axiosInstance.post<any>('DynamicForms', data);
      
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async loadForm(formConfig: FormConfig): Promise<ApiResponse> {
    try {
      this.setHeaders({
        'version': formConfig.version,
        'companyId': formConfig.companyId,
      });
      
      const queryParams = new URLSearchParams({
        key: formConfig.formKey,
        FormVersionId: formConfig.version,
        ClientId: formConfig.companyId
      });
      
      const response = await this.axiosInstance.get<any>(`DynamicForms?${queryParams}`);
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  /**
   * Fetches enum groups from the API
   * @param companyId - Optional company ID (defaults to '78')
   * @param language - Optional language code (defaults to 'en')
   * @returns A promise that resolves to the API response with group options
   */
  async getEnumGroups(companyId: string = '78', language: string = 'en'): Promise<ApiResponse> {
    try {
      // Set headers for this specific request
      this.setHeaders({
        'companyId': companyId,
        'language': language,
      });
      
      console.log('🔄 Fetching enum groups from API...');
      const response = await this.axiosInstance.get<any>('DynamicFormBuilder/EnumGroups');
      
      // Validate response structure
      if (!response.data) {
        throw new Error('No data received from enum groups API');
      }
      
      console.log('✅ Enum groups fetched successfully:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Failed to fetch enum groups:', error);
      return this.handleApiError(error);
    }
  }

  /**
   * Test connection to the API
   * @returns A promise that resolves to the API response
   */
  async testConnection(): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.get('health-check');
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleApiError(error);
    }
  }
}

export default new ApiService();