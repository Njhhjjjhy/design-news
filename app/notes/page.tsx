'use client';

import { useState, useEffect } from 'react';
import { useNotes } from '@/hooks/useNotes';
import { NoteEditor } from '@/components/notes/note-editor';
import { NotesList } from '@/components/notes/notes-list';
import { NoteMetadata } from '@/components/notes/note-metadata';
import { PublishModal } from '@/components/notes/publish-modal';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import type { Note } from '@/lib/types';

export default function NotesPage() {
  const { notes, addNote, updateNote, removeNote, getNote } = useNotes();
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPublishModal, setShowPublishModal] = useState(false);

  const activeNote = activeNoteId ? getNote(activeNoteId) : null;

  useEffect(() => {
    if (notes.length > 0 && !activeNoteId) {
      setActiveNoteId(notes[0].id);
    }
  }, [notes, activeNoteId]);

  const handleNoteSelect = (noteId: string) => {
    setActiveNoteId(noteId);
  };

  const handleNoteCreate = () => {
    const newNote = addNote();
    setActiveNoteId(newNote.id);
  };

  const handleNoteSave = (note: Note) => {
    updateNote(note.id, note);
  };

  const handleNoteDelete = (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      removeNote(noteId);
      if (activeNoteId === noteId) {
        const remainingNotes = notes.filter((n) => n.id !== noteId);
        setActiveNoteId(remainingNotes.length > 0 ? remainingNotes[0].id : null);
      }
    }
  };

  const handlePublish = () => {
    if (!activeNote) return;
    // Import here to avoid SSR issues
    import('@/lib/storage/blog-storage').then(({ publishNoteAsBlogPost }) => {
      publishNoteAsBlogPost(activeNote);
      updateNote(activeNote.id, { status: 'published' });
      setShowPublishModal(false);
    });
  };

  return (
    <div className="container flex h-[calc(100vh-4rem)]">
      <div className="w-80 flex-shrink-0">
        <NotesList
          notes={notes}
          activeNoteId={activeNoteId || undefined}
          onNoteSelect={handleNoteSelect}
          onNoteCreate={handleNoteCreate}
          onNoteDelete={handleNoteDelete}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>
      <div className="flex flex-1 flex-col">
        {activeNote ? (
          <>
            <div className="flex-1 overflow-hidden">
              <NoteEditor note={activeNote} onSave={handleNoteSave} />
            </div>
            <NoteMetadata note={activeNote} />
            <div className="border-t p-4">
              <Button
                onClick={() => setShowPublishModal(true)}
                disabled={activeNote.status === 'published'}
              >
                <FileText className="mr-2 h-4 w-4" />
                Publish as Blog Post
              </Button>
            </div>
            <PublishModal
              note={activeNote}
              open={showPublishModal}
              onOpenChange={setShowPublishModal}
              onConfirm={handlePublish}
            />
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No note selected</h3>
              <p className="text-muted-foreground">
                Select a note from the list or create a new one to get started.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

