"use client";

import { StreakCounter } from "@/components/dashboard/StreakCounter";
import { TodayLogCard } from "@/components/dashboard/TodayLogCard";
import { ActiveCourses } from "@/components/dashboard/ActiveCourses";
import { UpcomingDeadlines } from "@/components/dashboard/UpcomingDeadlines";
import { QuickBookmarks } from "@/components/dashboard/QuickBookmarks";

export default function Home() {
  return (
    <div className="p-6 md:p-10 pb-20 max-w-5xl mx-auto w-full flex flex-col gap-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to consistly.</p>
      </header>

      <QuickBookmarks />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Priority Actions */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <StreakCounter />
          <TodayLogCard />
        </div>

        {/* Right Column - Status Overview */}
        <div className="flex flex-col gap-6">
          <ActiveCourses />
          <UpcomingDeadlines />
        </div>
      </div>
    </div>
  );
}
