"use client";

import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
    const { login, user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && user) {
            router.push("/dashboard");
        }
    }, [isLoading, user, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center animate-in fade-in duration-1000">
            <div className="bg-accent/10 text-accent font-medium px-4 py-1.5 rounded-full text-sm mb-8 border border-accent/20">
                consistly v2.0
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl">
                Master anything through <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
                    relentless consistency
                </span>.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12">
                Your personal dashboard for tracking courses, curating resources, and turning study goals into unbroken streaks. All offline, all yours.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link
                    href="/dashboard"
                    onClick={() => login()}
                    className="h-12 px-8 flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all duration-300 rounded-xl font-medium shadow-[0_0_20px_rgba(13,148,136,0.3)]"
                >
                    Start Tracking Now →
                </Link>
                <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-12 px-8 flex items-center justify-center bg-muted text-foreground hover:bg-muted/80 transition-colors rounded-xl font-medium"
                >
                    View on GitHub
                </a>
            </div>

            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl text-left">
                <div className="p-6 rounded-2xl bg-card border border-border/50">
                    <div className="w-10 h-10 bg-accent/20 text-accent rounded-lg flex items-center justify-center mb-4 text-xl">🔥</div>
                    <h3 className="text-xl font-semibold mb-2">Build Streaks</h3>
                    <p className="text-muted-foreground text-sm">Visualize your daily efforts with GitHub-style heatmaps and Duolingo-style streaks.</p>
                </div>
                <div className="p-6 rounded-2xl bg-card border border-border/50">
                    <div className="w-10 h-10 bg-accent/20 text-accent rounded-lg flex items-center justify-center mb-4 text-xl">🎯</div>
                    <h3 className="text-xl font-semibold mb-2">Hit Milestones</h3>
                    <p className="text-muted-foreground text-sm">Set strict deadlines for courses and let the app hold you accountable with browser push notifications.</p>
                </div>
                <div className="p-6 rounded-2xl bg-card border border-border/50">
                    <div className="w-10 h-10 bg-accent/20 text-accent rounded-lg flex items-center justify-center mb-4 text-xl">🔒</div>
                    <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
                    <p className="text-muted-foreground text-sm">No backend means 100% privacy. Your data never leaves your browser's local storage.</p>
                </div>
            </div>
        </div>
    );
}
