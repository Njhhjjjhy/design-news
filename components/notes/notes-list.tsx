'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { Search, Plus, Trash2 } from 'lucide-react';
import type { Note, Category } from '@/lib/types';

interface NotesListProps {
  notes: Note[];
  activeNoteId?: string;
  onNoteSelect: (noteId: string) => void;
  onNoteCreate: () => void;
  onNoteDelete: (noteId: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function NotesList({
  notes,
  activeNoteId,
  onNoteSelect,
  onNoteCreate,
  onNoteDelete,
  searchQuery = '',
  onSearchChange,
}: NotesListProps) {
  const filteredNotes = notes.filter((note) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    );
  });

  const sortedNotes = [...filteredNotes].sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
  );

  return (
    <div className="flex h-full flex-col border-r">
      <div className="border-b p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Notes</h2>
          <Button onClick={onNoteCreate} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {onSearchChange && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        )}
      </div>
        <ScrollArea className="flex-1">
          <div className="p-2">
            {sortedNotes.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                {searchQuery ? 'No notes found' : 'No notes yet. Create one to get started!'}
              </div>
            ) : (
              <div className="space-y-2">
                {sortedNotes.map((note) => (
                  <div
                    key={note.id}
                    className={`group relative cursor-pointer rounded-lg border p-3 transition-colors hover:bg-muted ${
                      activeNoteId === note.id ? 'bg-muted border-primary' : ''
                    }`}
                    onClick={() => onNoteSelect(note.id)}
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <h3 className="line-clamp-2 flex-1 text-sm font-medium">
                        {note.title || 'Untitled Note'}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNoteDelete(note.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <p className="mb-2 line-clamp-2 text-xs text-muted-foreground">
                      {note.content.replace(/<[^>]*>/g, '').substring(0, 100)}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {note.category.slice(0, 2).map((cat) => (
                          <Badge key={cat} variant="outline" className="text-xs">
                            {cat}
                          </Badge>
                        ))}
                        {note.category.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{note.category.length - 2}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(note.updatedAt, 'MMM d')}
                      </span>
                    </div>
                    {note.status === 'published' && (
                      <Badge variant="secondary" className="mt-2 text-xs">
                        Published
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
    </div>
  );
}

