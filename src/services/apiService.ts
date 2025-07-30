/**
 * API Service for form builder operations
 */

import { FormConfig } from '@/types';
import axios, { AxiosInstance } from 'axios';

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

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor(baseUrl: string = apiBaseUrl) {
    // Create axios instance with base configuration
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'accept': "application/json",
        'Access-Control-Allow-Origin': "*",
        'Authorization': `Bearer ${authToken}`
      }
    });
  }
  /**
   * Submits form data to the API.
   * @param data - The form data to submit.
   * @returns A promise that resolves to the API response.
   */

  setHeaders(headers: Record<string, string>) {
    this.axiosInstance.defaults.headers = {
      ...this.axiosInstance.defaults.headers,
      ...headers
    };
  }

  async submitForm(data: SubmitData): Promise<ApiResponse> {
    try {
      this.setHeaders({
        'version': data.version,
        'companyId': data.companyId,
      });
      const response = await this.axiosInstance.post<any>('DynamicForms', data);
      
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
  async loadForm(formConfig: FormConfig): Promise<ApiResponse> {
    try {
       this.setHeaders({
        'version': formConfig.version,
        'companyId': formConfig.companyId,
      });
      const response = await this.axiosInstance.get<any>(`DynamicForms?key=${formConfig.formKey}&FormVersionId=${formConfig.version}&ClientId=${formConfig.companyId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}

export default new ApiService();
