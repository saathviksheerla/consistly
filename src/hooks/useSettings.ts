import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';

export interface Settings {
  reminderTime: string; // HH:mm format
  streakFreezeUsed: boolean;
  theme?: string;
}

const defaultSettings: Settings = {
  reminderTime: '18:00',
  streakFreezeUsed: false,
};

export function useSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      if (user === null) setIsLoaded(true);
      return;
    }
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setSettings(data);
        setIsLoaded(true);
      })
      .catch((err) => {
        console.error('Failed to fetch settings', err);
        setIsLoaded(true);
      });
  }, [user]);

  const updateSettings = async (updates: Partial<Settings>) => {
    if (!user) return;

    setSettings((prev) => ({ ...prev, ...updates }));

    await fetch('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  };

  return {
    settings,
    isLoaded,
    updateSettings,
  };
}
