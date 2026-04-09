import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';

export type BookmarkCategory = 'Repo' | 'Docs' | 'Reference' | 'Tool';

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  category: BookmarkCategory;
  isPinned: boolean;
  createdAt: number;
}

export function useBookmarks() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      if (user === null) setIsLoaded(true);
      return;
    }
    fetch('/api/bookmarks')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBookmarks(data);
        setIsLoaded(true);
      })
      .catch((err) => {
        console.error('Failed to fetch bookmarks', err);
        setIsLoaded(true);
      });
  }, [user]);

  const addBookmark = async (bookmark: Omit<Bookmark, 'id' | 'isPinned' | 'createdAt'>) => {
    if (!user) return;

    const tempId = crypto.randomUUID();
    const newBookmarkOptimistic: Bookmark = {
      ...bookmark,
      id: tempId,
      isPinned: false,
      createdAt: Date.now(),
    };
    setBookmarks((prev) => [...prev, newBookmarkOptimistic]);

    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        body: JSON.stringify(bookmark),
      });
      const data = await res.json();
      setBookmarks((prev) => prev.map((b) => (b.id === tempId ? data : b)));
    } catch (err) {
      console.error(err);
    }
  };

  const togglePin = async (id: string) => {
    if (!user) return;

    const bmark = bookmarks.find((b) => b.id === id);
    if (!bmark) return;
    const newPinned = !bmark.isPinned;

    setBookmarks((prev) => prev.map((b) => (b.id === id ? { ...b, isPinned: newPinned } : b)));

    await fetch(`/api/bookmarks/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ isPinned: newPinned }),
    });
  };

  const deleteBookmark = async (id: string) => {
    if (!user) return;

    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    await fetch(`/api/bookmarks/${id}`, { method: 'DELETE' });
  };

  return {
    bookmarks,
    isLoaded,
    addBookmark,
    togglePin,
    deleteBookmark,
  };
}
