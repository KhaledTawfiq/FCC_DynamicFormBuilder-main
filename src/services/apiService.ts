/**
 * Enhanced API Service for form builder operations including GetEnums
 */

import { FormConfig } from '../types';
import axios, { AxiosInstance } from 'axios';

// API Configuration using environment variables
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

interface EnumGroup {
  id: string;
  name: string;
  description?: string;
  items?: EnumItem[];
}

interface EnumItem {
  id: string;
  value: string;
  label: string;
  groupId: string;
}

class ApiService {
  private axiosInstance: AxiosInstance;
  private enumGroupsCache: EnumGroup[] | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

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
   * Sets additional headers for the axios instance
   * @param headers - The headers to set
   */
  setHeaders(headers: Record<string, string>) {
    this.axiosInstance.defaults.headers = {
      ...this.axiosInstance.defaults.headers,
      ...headers
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
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Loads form data from the API
   * @param formConfig - The form configuration
   * @returns A promise that resolves to the API response
   */
  async loadForm(formConfig: FormConfig): Promise<ApiResponse> {
    try {
      this.setHeaders({
        'version': formConfig.version,
        'companyId': formConfig.companyId,
      });
      const response = await this.axiosInstance.get<any>(
        `DynamicForms?key=${formConfig.formKey}&FormVersionId=${formConfig.version}&ClientId=${formConfig.companyId}`
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Fetches enum groups from the API with caching
   * @param companyId - The company ID (defaults to '78')
   * @param language - The language code (defaults to 'en')
   * @returns A promise that resolves to the enum groups
   */
  async getEnumGroups(companyId: string = '78', language: string = 'en'): Promise<ApiResponse<EnumGroup[]>> {
    try {
      // Check if we have cached data that's still valid
      const now = Date.now();
      if (this.enumGroupsCache && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
        return { success: true, data: this.enumGroupsCache };
      }

      const response = await this.axiosInstance.get<EnumGroup[]>('DynamicFormBuilder/EnumGroups', {
        headers: {
          'companyId': companyId,
          'language': language,
        }
      });

      // Cache the response
      this.enumGroupsCache = response.data;
      this.cacheTimestamp = now;

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching enum groups:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch enum groups' 
      };
    }
  }

  /**
   * Clears the enum groups cache
   */
  clearEnumGroupsCache(): void {
    this.enumGroupsCache = null;
    this.cacheTimestamp = 0;
  }

  /**
   * Gets enum groups for dropdown options
   * @param companyId - The company ID
   * @param language - The language code
   * @returns A promise that resolves to dropdown options
   */
  async getEnumGroupsForDropdown(companyId?: string, language?: string): Promise<Array<{label: string, value: string}>> {
    try {
      const response = await this.getEnumGroups(companyId, language);
      if (response.success && response.data) {
        return response.data.map(group => ({
          label: group.name,
          value: group.id
        }));
      }
      return [];
    } catch (error) {
      console.error('Error getting enum groups for dropdown:', error);
      return [];
    }
  }
}

export default new ApiService();
export type { EnumGroup, EnumItem };