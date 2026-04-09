'use client';

import { useBookmarks } from '@/hooks/useBookmarks';
import { Badge } from '@/components/ui/Badge';
import { IconBookmark } from '@/components/Icons';

export function QuickBookmarks() {
  const { bookmarks, isLoaded } = useBookmarks();

  if (!isLoaded) return null;

  const pinned = bookmarks.filter((b) => b.isPinned);

  if (pinned.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Quick Bookmarks
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {pinned.map((b) => (
          <a
            key={b.id}
            href={b.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 min-w-[200px] bg-card hover:bg-muted/50 transition-colors border border-border p-3 rounded-xl shadow-sm group"
          >
            <div className="bg-primary/10 text-primary p-2 rounded-lg group-hover:scale-105 transition-transform">
              <IconBookmark className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-medium text-sm truncate">{b.title}</span>
              <span className="text-xs text-muted-foreground">{b.category}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
