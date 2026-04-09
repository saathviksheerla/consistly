'use client';

import { useState } from 'react';
import { useMilestones, MilestoneStatus, Milestone } from '@/hooks/useMilestones';
import { useCourses } from '@/hooks/useCourses';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { IconMap, IconCheckCircle } from '@/components/Icons';
import { PageTransition } from '@/components/ui/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';

export default function RoadmapPage() {
  const {
    milestones,
    isLoaded: mlLoaded,
    addMilestone,
    updateMilestone,
    updateStatus,
    deleteMilestone,
  } = useMilestones();
  const { courses, isLoaded: cLoaded } = useCourses();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [linkedCourseIds, setLinkedCourseIds] = useState<string[]>([]);

  if (!mlLoaded || !cLoaded) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetDate) return;

    if (editingId) {
      updateMilestone(editingId, {
        title,
        targetDate,
        linkedCourseIds,
      });
    } else {
      addMilestone({
        title,
        targetDate,
        linkedCourseIds,
      });
    }

    closeModal();
  };

  const openModal = (milestone?: Milestone) => {
    if (milestone) {
      setEditingId(milestone.id);
      setTitle(milestone.title);
      setTargetDate(milestone.targetDate);
      setLinkedCourseIds(milestone.linkedCourseIds || []);
      setIsModalOpen(true);
    } else {
      // For new milestones (Goals), redirect to our new Flow which supports creating goals inline
      window.location.href = '/courses/add';
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setTitle('');
    setTargetDate('');
    setLinkedCourseIds([]);
  };

  // Sort by date nearest to furthest
  const sortedMilestones = [...milestones].sort(
    (a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime(),
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <PageTransition className="p-6 md:p-10 pb-32 md:pb-10 max-w-5xl mx-auto w-full flex flex-col gap-8">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Roadmap & Deadlines</h1>
          <p className="text-muted-foreground">Keep your eyes on the prize and hit your goals.</p>
        </div>
        <Button onClick={() => openModal()}>+ Add Goal or Item</Button>
      </header>

      {milestones.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
            <IconMap className="w-12 h-12 mb-4 opacity-20" />
            <p className="mb-4">No milestones set. Where are you heading next?</p>
            <Button variant="outline" onClick={() => openModal()}>
              Set a Goal / Add Item
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4 relative">
          {/* Vertical timeline line */}
          <div className="absolute left-6 top-4 bottom-4 w-px bg-border hidden md:block" />

          {sortedMilestones.map((m) => {
            const linkedCourses = courses.filter((c) => m.linkedCourseIds?.includes(c.id));
            const target = new Date(m.targetDate);
            target.setHours(0, 0, 0, 0);
            const diffDays = Math.ceil(
              (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
            );

            const isDone = m.status === 'Done';

            let statusBadge = null;
            if (isDone) {
              statusBadge = <Badge variant="success">Achieved</Badge>;
            } else if (diffDays < 0) {
              statusBadge = <Badge variant="danger">Overdue ({Math.abs(diffDays)}d)</Badge>;
            } else if (diffDays === 0) {
              statusBadge = <Badge variant="warning">Due Today</Badge>;
            } else if (diffDays <= 7) {
              statusBadge = <Badge variant="warning">{diffDays} days left</Badge>;
            } else {
              statusBadge = <Badge variant="outline">{diffDays} days away</Badge>;
            }

            return (
              <Card key={m.id} className={`relative md:ml-12 ${isDone ? 'opacity-70' : ''}`}>
                {/* Timeline dot */}
                <div
                  className={`absolute -left-[54px] top-6 w-4 h-4 rounded-full border-4 border-background hidden md:block 
                  ${isDone ? 'bg-green-500' : diffDays < 0 ? 'bg-red-500' : diffDays <= 7 ? 'bg-yellow-500' : 'bg-muted-foreground'}
                `}
                />

                <CardContent className="p-5 flex flex-col md:flex-row gap-4 justify-between md:items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3
                        className={`text-lg font-semibold ${isDone ? 'line-through text-muted-foreground' : ''}`}
                      >
                        {m.title}
                      </h3>
                      {statusBadge}
                    </div>
                    <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-2 mt-2">
                      <span>
                        Target:{' '}
                        {new Date(m.targetDate).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      {linkedCourses.length > 0 && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-muted-foreground/50 hidden sm:block" />
                          <span className="truncate max-w-[300px]">
                            Courses: {linkedCourses.map((c) => c.title).join(', ')}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isDone ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateStatus(m.id, 'Done')}
                        className="gap-2"
                      >
                        <IconCheckCircle className="w-4 h-4" />
                        Mark Done
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateStatus(m.id, 'In Progress')}
                      >
                        Undo
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => openModal(m)}>
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                      onClick={() => deleteMilestone(m.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add/Edit Milestone Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingId ? 'Edit Milestone' : 'Add Milestone'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Title</label>
            <Input
              placeholder="e.g. Finish Module 1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Target Date</label>
            <Input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Linked Courses (Optional)</label>
            <div className="max-h-32 overflow-y-auto border border-border rounded-lg p-2 flex flex-col gap-2">
              {courses.length === 0 ? (
                <span className="text-sm text-muted-foreground p-2">No courses available.</span>
              ) : (
                courses.map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      className="rounded border-border accent-accent"
                      checked={linkedCourseIds.includes(c.id)}
                      onChange={(e) => {
                        if (e.target.checked) setLinkedCourseIds((prev) => [...prev, c.id]);
                        else setLinkedCourseIds((prev) => prev.filter((id) => id !== c.id));
                      }}
                    />
                    <span className="truncate">{c.title}</span>
                  </label>
                ))
              )}
            </div>
          </div>
          <Button type="submit" className="mt-2 text-primary-foreground">
            {editingId ? 'Save Changes' : 'Set Milestone'}
          </Button>
        </form>
      </Modal>
    </PageTransition>
  );
}
