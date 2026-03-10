"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";

export default function ProfilePage() {
    const { user, login, logout, update } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [daysUntilNextUpdate, setDaysUntilNextUpdate] = useState<number | null>(null);

    useEffect(() => {
        if (user) {
            setNewName(user.name || "");
            if (user.lastUsernameUpdate) {
                const lastUpdate = new Date(user.lastUsernameUpdate);
                const ninetyDaysAgo = new Date();
                ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

                if (lastUpdate > ninetyDaysAgo) {
                    const daysLeft = Math.ceil((lastUpdate.getTime() - ninetyDaysAgo.getTime()) / (1000 * 60 * 60 * 24));
                    setDaysUntilNextUpdate(daysLeft);
                }
            }
        }
    }, [user]);

    const handleSave = async () => {
        if (!newName.trim() || newName.trim() === user?.name) {
            setIsEditing(false);
            return;
        }

        setIsSaving(true);
        setError("");

        try {
            const res = await fetch("/api/user/update-username", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName.trim() }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to update username");
            }

            // Successfully updated
            await update({ name: newName.trim() });

            alert("Username updated successfully!");
            setIsEditing(false);
            setDaysUntilNextUpdate(90); // Optimistic UI update
        } catch (err: unknown) {
            const error = err as Error;
            setError(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6 md:space-y-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Profile</h1>

            <div className="bg-card border border-border rounded-xl p-6">
                {user ? (
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-2xl">
                                {user.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div className="flex-1">
                                {isEditing ? (
                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="text"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            className="px-3 py-1.5 rounded-md bg-muted text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium"
                                            autoFocus
                                            maxLength={30}
                                            disabled={isSaving}
                                        />
                                        {error && <span className="text-xs text-destructive">{error}</span>}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleSave}
                                                disabled={isSaving}
                                                className="text-xs px-3 py-1 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                                            >
                                                {isSaving ? "Saving..." : "Save"}
                                            </button>
                                            <button
                                                onClick={() => { setIsEditing(false); setError(""); setNewName(user.name || ""); }}
                                                disabled={isSaving}
                                                className="text-xs px-3 py-1 bg-muted text-muted-foreground rounded-md font-medium hover:bg-muted/80 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 relative group w-fit">
                                        <h2 className="text-xl font-semibold text-foreground">{user.name}</h2>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            disabled={daysUntilNextUpdate !== null}
                                            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
                                        </button>
                                        {daysUntilNextUpdate !== null && (
                                            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:block w-fit bg-popover text-popover-foreground text-xs px-2 py-1 rounded-md shadow-md border border-border whitespace-nowrap z-10">
                                                Locked for {daysUntilNextUpdate} days
                                            </div>
                                        )}
                                    </div>
                                )}
                                <p className="text-muted-foreground">{user.email}</p>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-border">
                            <button
                                onClick={() => logout()}
                                className="px-4 py-2 rounded-lg bg-destructive/10 text-destructive font-medium hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 gap-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-2">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                        </div>
                        <h2 className="text-xl font-semibold text-foreground">Not Logged In</h2>
                        <p className="text-muted-foreground max-w-sm">Sign in to sync your progress, bookmarks, and settings across devices.</p>
                        <button
                            onClick={() => login()}
                            className="mt-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors cursor-pointer"
                        >
                            Log In
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
