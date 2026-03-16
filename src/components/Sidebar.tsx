"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { IconHome, IconBookOpen, IconBookmark, IconCalendar, IconMap, IconFlame, IconUser } from "./Icons";
import { useSettings } from "@/hooks/useSettings";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";

const navigation = [
    { name: "Dashboard", href: "/", icon: IconHome },
    { name: "Courses", href: "/courses", icon: IconBookOpen },
    { name: "Bookmarks", href: "/bookmarks", icon: IconBookmark },
    { name: "Log", href: "/log", icon: IconCalendar },
    { name: "Roadmap", href: "/roadmap", icon: IconMap },
    { name: "Profile", href: "/profile", icon: IconUser },
];

export function Sidebar({ className = "" }: { className?: string }) {
    const pathname = usePathname();
    const { settings, updateSettings, isLoaded } = useSettings();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [tempTime, setTempTime] = useState("18:00");
    const [exportSuccess, setExportSuccess] = useState(false);

    const openSettings = () => {
        if (isLoaded) setTempTime(settings.reminderTime);
        setIsSettingsOpen(true);
    };

    const saveSettings = (e: React.FormEvent) => {
        e.preventDefault();
        updateSettings({ reminderTime: tempTime });
        setIsSettingsOpen(false);
    };

    const exportData = () => {
        const data: Record<string, any> = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith("consistly_")) {
                try {
                    data[key] = JSON.parse(localStorage.getItem(key) || "");
                } catch {
                    data[key] = localStorage.getItem(key);
                }
            }
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `consistly_backup_${new Date().toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 3000);
    };

    const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target?.result as string);
                Object.keys(data).forEach((key) => {
                    if (key.startsWith("consistly_")) {
                        localStorage.setItem(key, typeof data[key] === "string" ? data[key] : JSON.stringify(data[key]));
                    }
                });
                alert("Data imported successfully! The app will now reload.");
                window.location.reload();
            } catch (error) {
                alert("Failed to parse the backup file. Please make sure it is a valid consistly backup.");
                console.error("Import error:", error);
            }
        };
        reader.readAsText(file);
    };

    return (
        <>
            <div className={`flex flex-col h-full bg-card p-4 ${className}`}>
                <div className="flex items-center gap-2 px-2 py-4 mb-8">
                    <div className="bg-accent text-accent-foreground p-1.5 rounded-lg">
                        <IconFlame className="w-5 h-5 text-zinc-950" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">consistly</span>
                </div>

                <nav className="flex-1 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                  relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 z-10
                  ${isActive
                                        ? "text-accent font-medium"
                                        : "text-muted-foreground hover:bg-muted/50 hover:text-white"
                                    }
                `}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute inset-0 bg-primary/20 rounded-lg -z-10"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                    />
                                )}
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto px-2 py-4 border-t border-border flex justify-between items-center">
                    <p className="text-xs text-muted-foreground hidden lg:block">Keep up the momentum.</p>
                    <button
                        onClick={openSettings}
                        className="text-xs font-medium text-muted-foreground hover:text-white transition-colors p-2 hover:bg-muted rounded-md"
                        title="Settings"
                    >
                        ⚙️
                    </button>
                </div>
            </div>

            <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Settings">
                <div className="flex flex-col gap-8">
                    <form onSubmit={saveSettings} className="flex flex-col gap-4">
                        <div>
                            <h3 className="font-semibold mb-2">Notifications</h3>
                            <label className="text-sm font-medium mb-1 block">Daily Reminder Time</label>
                            <p className="text-xs text-muted-foreground mb-3">Set a time to receive a browser push notification so you don't break your streak.</p>
                            <Input
                                type="time"
                                value={tempTime}
                                onChange={e => setTempTime(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium transition-colors">
                            Save Preferences
                        </button>
                    </form>

                    <div className="border-t border-border pt-6">
                        <h3 className="font-semibold mb-2">Data Management (SaaS Prep)</h3>
                        <p className="text-xs text-muted-foreground mb-4">
                            Since consistly currently stores everything directly in your browser, you can export your data to back it up or import it on another device.
                            When Cloud Sync launches, you will be able to upload this backup file to your account!
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={exportData}
                                type="button"
                                className="flex-1 h-10 px-4 py-2 border border-border hover:bg-muted text-foreground rounded-lg font-medium transition-colors cursor-pointer text-sm"
                            >
                                {exportSuccess ? "Exported!" : "Export Backup (.json)"}
                            </button>

                            <label className="flex-1 h-10 px-4 py-2 border border-border hover:bg-muted text-foreground rounded-lg font-medium transition-colors flex items-center justify-center cursor-pointer text-sm">
                                <span>Import Backup</span>
                                <input
                                    type="file"
                                    accept=".json"
                                    className="hidden"
                                    onChange={importData}
                                />
                            </label>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}
