import { useState, useEffect } from 'react';

interface UseDataFetchingProps<T> {
  data: T;
  delay?: number;
}

interface UseDataFetchingReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useDataFetching<T>({ 
  data, 
  delay = 2000 
}: UseDataFetchingProps<T>): UseDataFetchingReturn<T> {
  const [loading, setLoading] = useState(true);
  const [fetchedData, setFetchedData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        // Simulate random failure (5% chance)
        if (Math.random() < 0.05) {
          throw new Error('Failed to fetch data');
        }
        
        setFetchedData(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [data, delay]);

  return { data: fetchedData, loading, error };
}