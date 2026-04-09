'use client';

import { useMilestones } from '@/hooks/useMilestones';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

export function UpcomingDeadlines() {
  const { milestones, isLoaded } = useMilestones();

  if (!isLoaded) return null;

  // Filter not done, sort by date nearest
  const upcoming = milestones
    .filter((m) => m.status !== 'Done')
    .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())
    .slice(0, 3);

  if (upcoming.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Deadlines</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">You have no upcoming deadlines.</p>
          <Link href="/roadmap" className="text-sm text-accent hover:underline">
            View Roadmap →
          </Link>
        </CardContent>
      </Card>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Deadlines</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {upcoming.map((m) => {
          const target = new Date(m.targetDate);
          target.setHours(0, 0, 0, 0);
          const diffDays = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

          let statusBadge = null;
          if (diffDays < 0) {
            statusBadge = (
              <Badge variant="danger" className="text-[10px] px-1.5 py-0">
                Overdue
              </Badge>
            );
          } else if (diffDays === 0) {
            statusBadge = (
              <Badge variant="warning" className="text-[10px] px-1.5 py-0">
                Today
              </Badge>
            );
          } else if (diffDays <= 3) {
            statusBadge = (
              <Badge variant="warning" className="text-[10px] px-1.5 py-0">
                {diffDays} days left
              </Badge>
            );
          } else {
            statusBadge = (
              <span className="text-xs text-muted-foreground">{diffDays} days left</span>
            );
          }

          return (
            <div
              key={m.id}
              className="flex flex-col gap-1 border-b border-border/50 pb-3 last:border-0 last:pb-0"
            >
              <div className="flex justify-between items-start">
                <span className="font-medium text-sm">{m.title}</span>
                {statusBadge}
              </div>
              <span className="text-xs text-muted-foreground">
                Due: {new Date(m.targetDate).toLocaleDateString()}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
