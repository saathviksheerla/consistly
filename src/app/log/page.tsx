"use client";

import { useState } from "react";
import { useStudyLog } from "@/hooks/useStudyLog";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Heatmap } from "@/components/dashboard/Heatmap";

export default function LogPage() {
    const { studyLog, isLoaded, addLog } = useStudyLog();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Form State
    const todayStr = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];
    const [date, setDate] = useState(todayStr);
    const [minutes, setMinutes] = useState("");
    const [note, setNote] = useState("");

    if (!isLoaded) return null;

    const handleAddLog = (e: React.FormEvent) => {
        e.preventDefault();
        if (!date || !minutes || isNaN(Number(minutes))) return;

        addLog({
            date,
            minutes: Number(minutes),
            note,
            topics: [],
        });

        setDate(todayStr);
        setMinutes("");
        setNote("");
        setIsAddModalOpen(false);
    };

    // Sort logs by date descending
    const sortedLogs = [...studyLog].sort((a, b) => b.date.localeCompare(a.date));

    return (
        <div className="p-6 md:p-10 pb-32 md:pb-10 max-w-5xl mx-auto w-full flex flex-col gap-8 animate-in fade-in duration-500">
            <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Study Log</h1>
                    <p className="text-muted-foreground">Review your consistency and past sessions.</p>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)}>+ Add Entry</Button>
            </header>

            <Heatmap />

            <div>
                <h2 className="text-xl font-semibold mb-4">Recent Sessions</h2>
                {sortedLogs.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                            <p>No study logs found.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="flex flex-col gap-3">
                        {sortedLogs.map((log) => (
                            <Card key={log.id}>
                                <CardContent className="p-4 flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
                                    <div>
                                        <div className="font-semibold text-lg">{new Date(log.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                        {log.note && <p className="text-muted-foreground mt-1">{log.note}</p>}
                                    </div>
                                    <div className="bg-accent/10 text-accent font-medium px-4 py-2 rounded-lg whitespace-nowrap text-center">
                                        {log.minutes} mins
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Log Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add Study Session"
            >
                <form onSubmit={handleAddLog} className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-medium mb-1 block">Date</label>
                        <Input
                            type="date"
                            value={date} onChange={e => setDate(e.target.value)} required
                            max={todayStr}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Duration (Minutes)</label>
                        <Input
                            type="number" min={1}
                            placeholder="e.g. 60"
                            value={minutes} onChange={e => setMinutes(e.target.value)} required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Notes (Optional)</label>
                        <Input
                            placeholder="What did you learn?"
                            value={note} onChange={e => setNote(e.target.value)}
                        />
                    </div>
                    <Button type="submit" className="mt-2 text-primary-foreground">Save Entry</Button>
                </form>
            </Modal>
        </div>
    );
}
