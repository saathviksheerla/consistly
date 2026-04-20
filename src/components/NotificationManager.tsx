'use client';

import { useEffect, useState } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { useStudyLog } from '@/hooks/useStudyLog';

export function NotificationManager() {
  const { settings, isLoaded: settingsLoaded } = useSettings();
  const { studyLog, isLoaded: logLoaded } = useStudyLog();
  const [showInAppBanner, setShowInAppBanner] = useState(false);

  useEffect(() => {
    if (!settingsLoaded || !logLoaded) return;

    // 1. Request Browser Permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // 2. Check if logged today for in-app banner
    const todayStr = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];
    const loggedToday = studyLog.some((log) => log.date === todayStr);

    if (!loggedToday) {
      setShowInAppBanner(true);
    } else {
      setShowInAppBanner(false);
    }

    // 3. Set interval for push notification
    const checkReminder = () => {
      if (!('Notification' in window) || Notification.permission !== 'granted') return;
      if (loggedToday) return; // Don't nag if already studied!

      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, '0');
      const currentMinutes = now.getMinutes().toString().padStart(2, '0');
      const currentTime = `${currentHours}:${currentMinutes}`;

      if (currentTime === settings.reminderTime) {
        const lastNotified = localStorage.getItem('consistly_lastNotified');
        if (lastNotified !== todayStr) {
          new Notification('Time to study, Saathvik! 🎯', {
            body: 'Keep your streak alive. Open consistly to log your session.',
            icon: '/favicon.ico', // simplified icon
          });
          localStorage.setItem('consistly_lastNotified', todayStr);
        }
      }
    };

    // Check immediately and then every 30 seconds
    checkReminder();
    const intervalId = setInterval(checkReminder, 30000);

    return () => clearInterval(intervalId);
  }, [settings.reminderTime, settingsLoaded, logLoaded, studyLog]);

  if (!showInAppBanner) return null;

  return (
    <div className="bg-accent/20 border-b border-accent/30 text-accent font-medium text-sm px-4 py-3 flex items-center justify-center gap-2 relative z-50">
      <span className="animate-pulse">⚠️</span>
      You haven't logged your study session for today. Keep the streak going!
      <button
        onClick={() => setShowInAppBanner(false)}
        className="ml-4 opacity-70 hover:opacity-100 p-1"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
