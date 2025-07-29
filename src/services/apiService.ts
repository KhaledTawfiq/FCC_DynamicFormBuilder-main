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


export const getEnums = async () => {
  try {
    const response = await fetch(apiBaseUrl +'DynamicFormBuilder/EnumGroups', {
      method: 'GET',
      headers: {
        'companyId': '78',
        'language': 'en',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyOWRhZmJmNi0xNDc0LTQyODYtODdjMy0zMGIwMTJmNmQ4Y2EiLCJlbWFpbCI6Im1yYW1hZGFuQEZDQ2FyZXMub3JnIiwibmFtZSI6Ik1vaGFtZWQgUmFtYWRhbiIsImlhdCI6IjE3Mzk0NDU4NjUiLCJuYmYiOiIxNzM5NDQ1ODY1IiwiZXhwIjoiMTc2NTYyOTI3MSIsInRpZCI6IjUyY2Y1YTU3LWY5ZTgtNDI5My1iNjc4LTFjODlhMzc3Y2M1OSIsIm9pZCI6ImM2ZDhlY2ViLWFiYWUtNDk4YS05MzhiLTYwZTJmM2EyODU0OCIsIlVzZXJOYW1lIjoibXJhbWFkYW4iLCJEb21haW4iOiJGQ0NhcmVzLm9yZyIsIlByb2plY3RLZXkiOiJEZXZGZWRjYXBDQVJFUyIsIkNvbXBhbnlJZCI6Ijc4IiwiVXNlckdyb3VwOklkIjoiNiIsIlVzZXJHcm91cDpGY2NHcm91cElkIjoiNDQzIiwiVXNlckdyb3VwOkdyb3VwTmFtZSI6Ik1hbmFnZXJzL1N1cGVydmlzb3JzIiwiYXVkIjpbIkZjY1N0YXRpY0FwaSIsIkZjY0FwaSIsIkRvY3VTaWduQXBpIl0sImlzcyI6IkZjY1NlY3VyaXR5QXBpIn0.IAy4WFGkIqn-jf9SowrgCZJVTvih-1pFHB7nsXEglLQ',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Enum Groups:', error);
    throw error;
  }
};



export default new ApiService();
