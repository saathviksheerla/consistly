import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { calculateStreakState } from '@/lib/streak';

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

  const { streak, freezes } = isLoaded ? calculateStreakState(studyLog) : { streak: 0, freezes: 0 };

  return {
    studyLog,
    isLoaded,
    addLog,
    currentStreak: streak,
    availableFreezes: freezes,
  };
}
