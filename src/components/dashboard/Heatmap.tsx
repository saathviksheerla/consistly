'use client';

import { useStudyLog } from '@/hooks/useStudyLog';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export function Heatmap() {
  const { studyLog, isLoaded } = useStudyLog();

  if (!isLoaded) return null;

  // Let's generate the last 120 days (approx 4 months)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = Array.from({ length: 120 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (119 - i));
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  });

  // Calculate intensity based on minutes studied
  const getIntensity = (minutes: number) => {
    if (minutes === 0) return 'bg-muted/50 border border-border/50';
    if (minutes < 30) return 'bg-accent/30 text-accent';
    if (minutes < 60) return 'bg-accent/60 text-accent-foreground';
    return 'bg-accent text-accent-foreground shadow-[0_0_8px_rgba(20,184,166,0.5)]';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Study Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-card border border-border/50">
          {days.map((dateStr) => {
            const dayLogs = studyLog.filter((l) => l.date === dateStr);
            const totalMinutes = dayLogs.reduce((acc, curr) => acc + curr.minutes, 0);

            return (
              <div
                key={dateStr}
                className={`w-4 h-4 rounded-sm transition-all hover:scale-125 hover:z-10 cursor-help ${getIntensity(totalMinutes)}`}
                title={`${dateStr}: ${totalMinutes} mins`}
              />
            );
          })}
        </div>
        <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground justify-end">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-muted/50 border border-border/50" />
          <div className="w-3 h-3 rounded-sm bg-accent/30" />
          <div className="w-3 h-3 rounded-sm bg-accent/60" />
          <div className="w-3 h-3 rounded-sm bg-accent" />
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
