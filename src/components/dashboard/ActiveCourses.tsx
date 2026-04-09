'use client';

import { useCourses } from '@/hooks/useCourses';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ProgressRing } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

export function ActiveCourses() {
  const { courses, isLoaded } = useCourses();

  if (!isLoaded) return null;

  const activeCourses = courses
    .filter((c) => {
      const isFlexibleItem = c.totalLessons === 0;
      return isFlexibleItem || c.completedLessons < c.totalLessons;
    })
    .slice(0, 3); // top 3 active

  if (activeCourses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Active Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">No active courses right now.</p>
          <Link href="/courses" className="text-sm text-accent hover:underline">
            Add a course →
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Courses</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {activeCourses.map((course) => {
          const isFlexibleItem = course.totalLessons === 0;
          const progress =
            course.totalLessons > 0 ? (course.completedLessons / course.totalLessons) * 100 : 0;
          return (
            <div
              key={course.id}
              className="flex items-center gap-4 bg-muted/30 p-3 rounded-lg border border-border/50"
            >
              {!isFlexibleItem && <ProgressRing progress={progress} size={48} strokeWidth={4} />}
              <div className="flex-1 min-w-0">
                <Link
                  href="/courses"
                  className="font-medium text-sm truncate block hover:text-accent transition-colors"
                >
                  {course.title}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    {course.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {isFlexibleItem
                      ? `Logged: ${course.completedLessons} times`
                      : `${course.completedLessons} / ${course.totalLessons}`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
