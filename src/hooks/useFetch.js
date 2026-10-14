import { useState, useEffect, useCallback } from 'react';
import { parseApiError } from '../utils/errorHandler';

/**
 * Custom hook for data fetching with loading, error, and refetch handling.
 * 
 * @param {Function} fetchFn - Async function returning data
 * @param {Array} dependencies - Dependency array for re-fetching
 * @param {boolean} immediate - Whether to fetch immediately on mount (default true)
 */
export function useFetch(fetchFn, dependencies = [], immediate = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
      return result;
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    if (immediate) {
      execute().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [execute, immediate, ...dependencies]);

  return {
    data,
    setData,
    loading,
    error,
    refetch: execute
  };
}

export default useFetch;
