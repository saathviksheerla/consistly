'use client';

import { useStudyLog } from '@/hooks/useStudyLog';
import { Card, CardContent } from '@/components/ui/Card';
import { IconFlame, IconSnowflake } from '@/components/Icons';

export function StreakCounter() {
  const { currentStreak, availableFreezes, isLoaded, studyLog } = useStudyLog();

  if (!isLoaded) return null;

  // Check if logged today
  const todayStr = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0];
  const loggedToday = studyLog.some((log) => log.date === todayStr);

  return (
    <Card className="bg-gradient-to-br from-card to-card/50 overflow-hidden relative border-accent/20">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <IconFlame className="w-24 h-24" />
      </div>
      <CardContent className="p-6 relative z-10 flex items-center gap-6">
        <div
          className={`flex items-center justify-center w-16 h-16 rounded-full ${loggedToday ? 'bg-accent/20 text-accent' : 'bg-muted text-muted-foreground'}`}
        >
          <IconFlame className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-1 flex items-center gap-3">
            <span>{currentStreak} Day{currentStreak !== 1 ? 's' : ''}</span>
            {availableFreezes > 0 && (
              <span className="flex items-center gap-1 text-sm bg-blue-500/10 text-blue-500 px-2.5 py-1 rounded-full font-medium tracking-normal">
                <IconSnowflake className="w-4 h-4" />
                {availableFreezes}
              </span>
            )}
          </h2>
          <p className="text-sm text-muted-foreground">
            {loggedToday
              ? "Awesome! You've logged your study for today."
              : 'Keep the streak alive! Log your study today.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
