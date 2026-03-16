"use client";

import { StreakCounter } from "@/components/dashboard/StreakCounter";
import { TodayLogCard } from "@/components/dashboard/TodayLogCard";
import { ActiveCourses } from "@/components/dashboard/ActiveCourses";
import { UpcomingDeadlines } from "@/components/dashboard/UpcomingDeadlines";
import { QuickBookmarks } from "@/components/dashboard/QuickBookmarks";
import { PageTransition } from "@/components/ui/PageTransition";
import { motion, Variants } from "framer-motion";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Home() {
  return (
    <PageTransition className="p-6 md:p-10 pb-32 md:pb-10 max-w-5xl mx-auto w-full flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to consistly.</p>
      </header>

      <QuickBookmarks />

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Priority Actions */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <motion.div variants={item}><StreakCounter /></motion.div>
          <motion.div variants={item}><TodayLogCard /></motion.div>
        </div>

        {/* Right Column - Status Overview */}
        <div className="flex flex-col gap-6">
          <motion.div variants={item}><ActiveCourses /></motion.div>
          <motion.div variants={item}><UpcomingDeadlines /></motion.div>
        </div>
      </motion.div>
    </PageTransition>
  );
}
