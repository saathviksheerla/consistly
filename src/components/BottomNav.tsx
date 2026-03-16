"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { IconHome, IconBookOpen, IconBookmark, IconCalendar, IconMap, IconUser } from "./Icons";

const navigation = [
    { name: "Dashboard", href: "/", icon: IconHome },
    { name: "Courses", href: "/courses", icon: IconBookOpen },
    { name: "Bookmarks", href: "/bookmarks", icon: IconBookmark },
    { name: "Log", href: "/log", icon: IconCalendar },
    { name: "Roadmap", href: "/roadmap", icon: IconMap },
    { name: "Profile", href: "/profile", icon: IconUser },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border flex items-center justify-around px-2 py-2 md:hidden pb-safe">
            {navigation.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`relative flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 min-w-[3.5rem] z-10
                            ${isActive
                                ? "text-accent font-medium"
                                : "text-muted-foreground hover:text-white"
                            }
                        `}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="bottomnav-active"
                                className="absolute inset-0 bg-primary/20 rounded-lg -z-10"
                                initial={false}
                                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                            />
                        )}
                        <motion.div
                            animate={{ scale: isActive ? 1.1 : 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            className="flex flex-col items-center"
                        >
                            <item.icon className="w-6 h-6 mb-1" />
                            <span className="text-[10px] leading-tight text-center">{item.name}</span>
                        </motion.div>
                    </Link>
                );
            })}
        </div>
    );
}
