'use client';

import { useState } from 'react';
import { useBookmarks, BookmarkCategory } from '@/hooks/useBookmarks';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { IconBookmark } from '@/components/Icons';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export default function BookmarksPage() {
  const { bookmarks, isLoaded, addBookmark, togglePin, deleteBookmark } = useBookmarks();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<BookmarkCategory>('Reference');

  if (!isLoaded) return null;

  const handleAddBookmark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return;

    addBookmark({
      title,
      url,
      category,
    });

    setTitle('');
    setUrl('');
    setCategory('Reference');
    setIsAddModalOpen(false);
  };

  const getCategoryColor = (cat: BookmarkCategory) => {
    switch (cat) {
      case 'Repo':
        return 'default';
      case 'Docs':
        return 'secondary';
      case 'Reference':
        return 'outline';
      case 'Tool':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <div className="p-6 md:p-10 pb-32 md:pb-10 max-w-5xl mx-auto w-full flex flex-col gap-8 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Bookmarks</h1>
          <p className="text-muted-foreground">Keep your most important technical resources handy.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>+ Add Bookmark</Button>
      </header>

      {bookmarks.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
            <p className="mb-4">No bookmarks added yet.</p>
            <Button variant="outline" onClick={() => setIsAddModalOpen(true)}>
              Save your first link
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Pinned Bookmarks first */}
          {[...bookmarks]
            .sort((a, b) => Number(b.isPinned) - Number(a.isPinned))
            .map((bookmark) => (
              <Card
                key={bookmark.id}
                className={`flex flex-col group relative ${bookmark.isPinned ? 'border-accent/50 bg-accent/5' : ''}`}
              >
                <CardHeader className="pb-3 border-b border-border/50">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <CardTitle
                        className="truncate font-medium text-base mb-1.5"
                        title={bookmark.title}
                      >
                        <a
                          href={bookmark.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-accent transition-colors"
                        >
                          {bookmark.title}
                        </a>
                      </CardTitle>
                      <Badge variant={getCategoryColor(bookmark.category) as any}>
                        {bookmark.category}
                      </Badge>
                    </div>
                    <button
                      onClick={() => togglePin(bookmark.id)}
                      className={`p-1.5 rounded-full transition-colors ${bookmark.isPinned ? 'text-accent bg-accent/20' : 'text-muted-foreground hover:bg-muted opacity-0 group-hover:opacity-100'}`}
                      title={bookmark.isPinned ? 'Unpin' : 'Pin'}
                    >
                      <IconBookmark className="w-4 h-4" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="pt-3 flex flex-col justify-end mt-auto">
                  <div className="flex justify-between items-center">
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground truncate hover:text-foreground hover:underline max-w-[70%]"
                    >
                      {new URL(bookmark.url).hostname}
                    </a>
                    <button
                      onClick={() => setDeleteConfirmId(bookmark.id)}
                      className="text-xs text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Delete
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      {/* Add Bookmark Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Bookmark"
      >
        <form onSubmit={handleAddBookmark} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Title</label>
            <Input
              placeholder="e.g. Next.js App Router Docs"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">URL</label>
            <Input
              type="url"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Category</label>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value as BookmarkCategory)}
            >
              <option value="Repo">Repository</option>
              <option value="Docs">Documentation</option>
              <option value="Reference">Reference</option>
              <option value="Tool">Tool</option>
            </Select>
          </div>
          <Button type="submit" className="mt-2 text-primary-foreground">
            Save Bookmark
          </Button>
        </form>
      </Modal>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={async () => {
          if (deleteConfirmId) {
            await deleteBookmark(deleteConfirmId);
            setDeleteConfirmId(null);
          }
        }}
        title="Delete Bookmark"
        description="Are you sure you want to delete this bookmark? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}
