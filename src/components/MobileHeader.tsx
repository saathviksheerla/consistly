"use client";

import { useAuth } from "@/providers/AuthProvider";
import { useNavigation } from "@/hooks/useNavigation";
import { IconFlame } from "./Icons";

export function MobileHeader() {
    const { user, login } = useAuth();
    const { goToProfile } = useNavigation();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-card/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 md:hidden">
            <div className="flex items-center gap-2">
                <div className="bg-accent text-accent-foreground p-1 rounded-md">
                    <IconFlame className="w-4 h-4 text-zinc-950" />
                </div>
                <span className="text-lg font-bold tracking-tight text-white">consistencie</span>
            </div>

            <div className="flex items-center">
                {user ? (
                    <div
                        onClick={() => goToProfile()}
                        className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-sm cursor-pointer border border-accent/30"
                    >
                        {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                ) : (
                    <button
                        onClick={() => login()}
                        className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors cursor-pointer"
                    >
                        Log In
                    </button>
                )}
            </div>
        </header>
    );
}
