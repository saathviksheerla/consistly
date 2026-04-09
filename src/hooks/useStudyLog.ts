import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';

export interface StudyLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  minutes: number;
  note?: string;
  topics: string[];
}

export function useStudyLog() {
  const { user } = useAuth();
  const [studyLog, setStudyLog] = useState<StudyLogEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      if (user === null) setIsLoaded(true);
      return;
    }
    fetch('/api/studylog')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // ensure notes mapped to note if backend mismatch
          const mapped = data.map((d) => ({ ...d, note: d.notes || d.note }));
          setStudyLog(mapped);
        }
        setIsLoaded(true);
      })
      .catch((err) => {
        console.error('Failed to fetch study log', err);
        setIsLoaded(true);
      });
  }, [user]);

  const addLog = async (entry: Omit<StudyLogEntry, 'id' | 'date'> & { date?: string }) => {
    if (!user) return;

    const dateStr = entry.date || new Date().toISOString().split('T')[0];
    const tempId = crypto.randomUUID();

    const newEntryOptimistic: StudyLogEntry = {
      ...entry,
      id: tempId,
      date: dateStr,
    };

    setStudyLog((prev) => [...prev, newEntryOptimistic]);

    try {
      const dbEntry = {
        ...entry,
        notes: entry.note, // Map to schema
        date: dateStr,
      };

      const res = await fetch('/api/studylog', {
        method: 'POST',
        body: JSON.stringify(dbEntry),
      });
      const data = await res.json();
      const finalEntry = { ...data, note: data.notes || data.note };

      setStudyLog((prev) => prev.map((l) => (l.id === tempId ? finalEntry : l)));
    } catch (err) {
      console.error(err);
    }
  };

  const calculateStreak = () => {
    if (!studyLog.length) return 0;
    const dates = [...new Set(studyLog.map((log) => log.date))].sort((a, b) => b.localeCompare(a));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = new Date(yesterday.getTime() - yesterday.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];

    if (!dates.includes(todayStr) && !dates.includes(yesterdayStr)) {
      return 0;
    }

    let streak = 0;
    let currentDate = new Date(dates.includes(todayStr) ? todayStr : yesterdayStr);

    for (let i = 0; i < 3650; i++) {
      const dStr = new Date(currentDate.getTime() - currentDate.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0];
      if (dates.includes(dStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  return {
    studyLog,
    isLoaded,
    addLog,
    currentStreak: isLoaded ? calculateStreak() : 0,
  };
}
