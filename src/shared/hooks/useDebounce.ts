import { useEffect, useState } from "react";

/**
 * Retarde la propagation d'une valeur : utile pour ne pas relancer
 * un filtrage ou une requête à chaque frappe clavier.
 */
export function useDebounce<T>(value: T, delay = 350): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
}
