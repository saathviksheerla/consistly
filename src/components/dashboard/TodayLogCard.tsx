'use client';

import { useState } from 'react';
import { useStudyLog } from '@/hooks/useStudyLog';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { IconCheckCircle } from '@/components/Icons';

export function TodayLogCard() {
  const { addLog, isLoaded, studyLog } = useStudyLog();
  const [minutes, setMinutes] = useState('');
  const [note, setNote] = useState('');

  if (!isLoaded) return null;

  const todayStr = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0];
  const loggedToday = studyLog.some((log) => log.date === todayStr);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!minutes || isNaN(Number(minutes))) return;

    addLog({
      minutes: Number(minutes),
      note,
      topics: [], // We can add topic tags later
    });

    setMinutes('');
    setNote('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Today's Log
          {loggedToday && <IconCheckCircle className="w-5 h-5 text-accent" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <Input
              type="number"
              placeholder="Minutes (e.g. 45)"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              className="w-1/3"
              required
              min={1}
            />
            <Input
              type="text"
              placeholder="What did you study?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="flex-1"
            />
          </div>
          <Button type="submit" variant="primary" className="w-full sm:w-auto self-end">
            Log Session
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
