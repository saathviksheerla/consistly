"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
                        className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-[3.5rem]
                            ${isActive
                                ? "text-accent font-medium scale-110"
                                : "text-muted-foreground hover:text-white"
                            }
                        `}
                    >
                        <item.icon className="w-6 h-6 mb-1" />
                        <span className="text-[10px] leading-tight text-center">{item.name}</span>
                    </Link>
                );
            })}
        </div>
    );
}
