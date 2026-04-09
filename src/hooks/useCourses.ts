import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';

export type CourseCategory = string; // Upgraded to string for custom categories

export interface Course {
  id: string;
  title: string;
  itemType?: string;
  milestoneId?: string;
  url?: string;
  source?: string;
  totalLessons: number;
  completedLessons: number;
  category?: CourseCategory;
  consistencyGoal?: string;
  consistencyDetails?: any;
  progressStyle?: string;
  missedDaysTone?: string;
  createdAt: number;
}

export function useCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      if (user === null) setIsLoaded(true); // not logged in
      return;
    }

    fetch('/api/courses')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCourses(data);
        setIsLoaded(true);
      })
      .catch((err) => {
        console.error('Failed to fetch courses', err);
        setIsLoaded(true);
      });
  }, [user]);

  const addCourse = async (course: Omit<Course, 'id' | 'completedLessons' | 'createdAt'>) => {
    if (!user) return;

    // optimistic update
    const tempId = crypto.randomUUID();
    const newCourseOptimistic: Course = {
      ...course,
      id: tempId,
      completedLessons: 0,
      createdAt: Date.now(),
    };

    setCourses((prev) => [...prev, newCourseOptimistic]);

    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        body: JSON.stringify(course),
      });
      const data = await res.json();
      setCourses((prev) => prev.map((c) => (c.id === tempId ? data : c)));
    } catch (err) {
      console.error(err);
      // rollback could be implemented here
    }
  };

  const updateCourse = async (id: string, updates: Partial<Omit<Course, 'id' | 'createdAt'>>) => {
    if (!user) return;

    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));

    await fetch(`/api/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  };

  const updateCourseProgress = async (id: string, completedLessons: number) => {
    if (!user) return;

    const course = courses.find((c) => c.id === id);
    if (!course) return;
    const newProgress =
      course.totalLessons > 0 ? Math.min(completedLessons, course.totalLessons) : completedLessons;

    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, completedLessons: newProgress } : c)),
    );

    await fetch(`/api/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ completedLessons: newProgress }),
    });
  };

  const incrementProgress = async (id: string) => {
    if (!user) return;
    const course = courses.find((c) => c.id === id);
    if (!course) return;
    const newProgress =
      course.totalLessons > 0
        ? Math.min(course.completedLessons + 1, course.totalLessons)
        : course.completedLessons + 1;

    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, completedLessons: newProgress } : c)),
    );

    await fetch(`/api/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ completedLessons: newProgress }),
    });
  };

  const deleteCourse = async (id: string) => {
    if (!user) return;

    setCourses((prev) => prev.filter((c) => c.id !== id));
    await fetch(`/api/courses/${id}`, {
      method: 'DELETE',
    });
  };

  return {
    courses,
    isLoaded,
    addCourse,
    updateCourse,
    updateCourseProgress,
    incrementProgress,
    deleteCourse,
  };
}
