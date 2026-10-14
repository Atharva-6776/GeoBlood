import { useEffect, useRef } from 'react';

/**
 * Custom hook for periodic background polling
 * 
 * @param {Function} callback - Function to run on each interval
 * @param {number|null} intervalMs - Interval in milliseconds (pass null or 0 to pause)
 * @param {boolean} active - Condition determining whether polling is active
 */
export function usePolling(callback, intervalMs = 15000, active = true) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!active || !intervalMs || intervalMs <= 0) return;

    const tick = () => {
      savedCallback.current();
    };

    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, active]);
}

export default usePolling;
