import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T, userId: string = 'guest') {
  const scopedKey = `consistly_${userId}_${key}`;
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const item = window.localStorage.getItem(scopedKey);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${scopedKey}":`, error);
    }
  }, [scopedKey]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(scopedKey, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${scopedKey}":`, error);
    }
  };

  return [storedValue, setValue, isMounted] as const;
}
