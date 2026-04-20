import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';

export type MilestoneStatus = 'Not Started' | 'In Progress' | 'Done';

export interface Milestone {
  id: string;
  title: string;
  targetDate: string; // YYYY-MM-DD
  linkedCourseIds: string[]; // Upgraded to array
  status: MilestoneStatus;
  createdAt: number;
}

export function useMilestones() {
  const { user } = useAuth();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      if (user === null) setIsLoaded(true);
      return;
    }
    fetch('/api/milestones')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMilestones(data);
        setIsLoaded(true);
      })
      .catch((err) => {
        console.error('Failed to fetch milestones', err);
        setIsLoaded(true);
      });
  }, [user]);

  const addMilestone = async (milestone: Omit<Milestone, 'id' | 'status' | 'createdAt'>) => {
    if (!user) return;

    const tempId = crypto.randomUUID();
    const newEntryOptimistic: Milestone = {
      ...milestone,
      id: tempId,
      status: 'Not Started',
      createdAt: Date.now(),
    };
    setMilestones((prev) => [...prev, newEntryOptimistic]);

    try {
      const res = await fetch('/api/milestones', {
        method: 'POST',
        body: JSON.stringify(milestone),
      });
      const data = await res.json();
      setMilestones((prev) => prev.map((m) => (m.id === tempId ? data : m)));
    } catch (err) {
      console.error(err);
    }
  };

  const updateMilestone = async (
    id: string,
    updates: Partial<Omit<Milestone, 'id' | 'createdAt'>>,
  ) => {
    if (!user) return;

    setMilestones((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));

    await fetch(`/api/milestones/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  };

  const updateStatus = async (id: string, status: MilestoneStatus) => {
    if (!user) return;

    setMilestones((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));

    await fetch(`/api/milestones/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  };

  const deleteMilestone = async (id: string) => {
    if (!user) return;

    setMilestones((prev) => prev.filter((m) => m.id !== id));
    await fetch(`/api/milestones/${id}`, { method: 'DELETE' });
  };

  return {
    milestones,
    isLoaded,
    addMilestone,
    updateMilestone,
    updateStatus,
    deleteMilestone,
  };
}
