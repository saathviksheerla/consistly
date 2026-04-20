"use client";

import { useState } from "react";
import { useCourses, Course } from "@/hooks/useCourses";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { IconCheckCircle } from "@/components/Icons";
import { PageTransition } from "@/components/ui/PageTransition";
import { motion, AnimatePresence } from "framer-motion";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export default function CoursesPage() {
    const { courses, isLoaded, addCourse, updateCourse, incrementProgress, deleteCourse } = useCourses();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    // Form State
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [totalLessons, setTotalLessons] = useState("");
    const [category, setCategory] = useState("");

    if (!isLoaded) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !totalLessons) return;

        if (editingId) {
            updateCourse(editingId, {
                title,
                url,
                totalLessons: Number(totalLessons),
                category,
            });
        } else {
            addCourse({
                title,
                url,
                totalLessons: Number(totalLessons),
                category,
            });
        }

        closeModal();
    };

    const openModal = (course?: Course) => {
        if (course) {
            setEditingId(course.id);
            setTitle(course.title);
            setUrl(course.url || "");
            setTotalLessons(course.totalLessons.toString());
            setCategory(course.category || "Uncategorized");
            setIsModalOpen(true);
        } else {
            // For new courses/habits, redirect to our new flow
            window.location.href = "/courses/add";
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setTitle("");
        setUrl("");
        setTotalLessons("");
        setCategory("");
    };

    return (
        <PageTransition className="p-6 md:p-10 pb-32 md:pb-10 max-w-5xl mx-auto w-full flex flex-col gap-8">
            <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Courses & Playlists</h1>
                    <p className="text-muted-foreground">Track your progress through your learning materials.</p>
                </div>
                <Button onClick={() => openModal()}>+ Add Course or Habit</Button>
            </header>

            {courses.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                        <p className="mb-4">You haven't added any courses yet.</p>
                        <Button variant="outline" onClick={() => openModal()}>Add your first course</Button>
                    </CardContent>
                </Card>
            ) : (
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatePresence mode="popLayout">
                        {courses.map(course => {
                            // For flexible items/habits where totalLessons is 0, progress tracking differs.
                            // They shouldn't be immediately "done" just because 0 >= 0.
                            const isFlexibleItem = course.totalLessons === 0;
                            const progress = course.totalLessons > 0 ? (course.completedLessons / course.totalLessons) * 100 : 0;
                            const isDone = !isFlexibleItem && course.completedLessons >= course.totalLessons;

                            return (
                                <motion.div
                                    key={course.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -15 }}
                                    transition={{ duration: 0.2, type: "spring", bounce: 0.3 }}
                                >
                                    <Card className="flex flex-col h-full">
                                        <CardHeader className="pb-3">
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <CardTitle className="truncate text-lg">
                                                        {course.url ? (
                                                            <a href={course.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent hover:underline transition-colors">
                                                                {course.title}
                                                            </a>
                                                        ) : (
                                                            course.title
                                                        )}
                                                    </CardTitle>
                                                    <Badge variant="secondary" className="mt-2 text-xs">{course.category}</Badge>
                                                </div>
                                                {isDone && <IconCheckCircle className="text-accent w-6 h-6 flex-shrink-0" />}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex flex-col gap-4 mt-auto">
                                            <div>
                                                {isFlexibleItem ? (
                                                    <div className="flex justify-between text-sm mb-2">
                                                        <span className="text-muted-foreground">Times logged</span>
                                                        <span className="font-medium">{course.completedLessons}</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="flex justify-between text-sm mb-2">
                                                            <span className="text-muted-foreground">Progress</span>
                                                            <span className="font-medium">{course.completedLessons} / {course.totalLessons} ({Math.round(progress)}%)</span>
                                                        </div>
                                                        <ProgressBar progress={progress} />
                                                    </>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                <Button
                                                    variant="secondary"
                                                    className="flex-1 md:flex-none text-xs md:text-sm px-2 md:px-4"
                                                    onClick={() => incrementProgress(course.id)}
                                                    disabled={isDone}
                                                >
                                                    {isDone ? "Completed" : isFlexibleItem ? "Log Activity" : "+1 Lesson"}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="px-3 text-xs md:text-sm flex-1 md:flex-none"
                                                    onClick={() => openModal(course)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    className="text-red-500 hover:text-red-400 hover:bg-red-500/10 px-3 text-xs md:text-sm w-full md:w-auto mt-1 md:mt-0"
                                                    onClick={() => setDeleteConfirmId(course.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* Add/Edit Course Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingId ? "Edit Course" : "Add Course or Playlist"}
            >
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-medium mb-1 block">Title</label>
                        <Input
                            placeholder="e.g. Next.js 14 Full Course"
                            value={title} onChange={e => setTitle(e.target.value)} required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">URL (Optional)</label>
                        <Input
                            type="url"
                            placeholder="https://youtube.com/..."
                            value={url} onChange={e => setUrl(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-sm font-medium mb-1 block">Total Lessons</label>
                            <Input
                                type="number" min={1} required
                                placeholder="e.g. 24"
                                value={totalLessons} onChange={e => setTotalLessons(e.target.value)}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-sm font-medium mb-1 block">Category</label>
                            <Input
                                placeholder="e.g. Next.js, Math, etc."
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <Button type="submit" className="mt-2 text-primary-foreground">
                        {editingId ? "Save Changes" : "Add Course"}
                    </Button>
                </form>
            </Modal>

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={!!deleteConfirmId}
                onClose={() => setDeleteConfirmId(null)}
                onConfirm={async () => {
                    if (deleteConfirmId) {
                        await deleteCourse(deleteConfirmId);
                        setDeleteConfirmId(null);
                    }
                }}
                title="Delete Course"
                description="Are you sure you want to delete this course? This action cannot be undone."
                confirmText="Delete"
            />
        </PageTransition>
    );
}
