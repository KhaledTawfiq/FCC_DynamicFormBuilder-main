/**
 * Custom hook for managing enum groups
 */

import { useState, useEffect, useCallback } from 'react';
import apiService, { EnumGroup } from '../services/apiService';

interface UseEnumGroupsReturn {
  enumGroups: Array<{label: string, value: string}>;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching and managing enum groups
 */
export const useEnumGroups = (companyId: string = '78', language: string = 'en'): UseEnumGroupsReturn => {
  const [enumGroups, setEnumGroups] = useState<Array<{label: string, value: string}>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEnumGroups = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const options = await apiService.getEnumGroupsForDropdown(companyId, language);
      setEnumGroups(options);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch enum groups';
      setError(errorMessage);
      console.error('Error fetching enum groups:', err);
    } finally {
      setIsLoading(false);
    }
  }, [companyId, language]);

  // Initial fetch
  useEffect(() => {
    fetchEnumGroups();
  }, [fetchEnumGroups]);

  const refetch = useCallback(async () => {
    apiService.clearEnumGroupsCache();
    await fetchEnumGroups();
  }, [fetchEnumGroups]);

  return {
    enumGroups,
    isLoading,
    error,
    refetch
  };
};