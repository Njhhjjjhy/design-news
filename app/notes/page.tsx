'use client';

import { useState, useEffect } from 'react';
import { useNotes } from '@/hooks/useNotes';
import { NoteEditor } from '@/components/notes/note-editor';
import { NotesList } from '@/components/notes/notes-list';
import { NoteMetadata } from '@/components/notes/note-metadata';
import { PublishModal } from '@/components/notes/publish-modal';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { FileText, Menu } from 'lucide-react';
import type { Note } from '@/lib/types';

export default function NotesPage() {
  const { notes, addNote, updateNote, removeNote, getNote } = useNotes();
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeNote = activeNoteId ? getNote(activeNoteId) : null;

  useEffect(() => {
    if (notes.length > 0 && !activeNoteId) {
      setActiveNoteId(notes[0].id);
    }
  }, [notes, activeNoteId]);

  const handleNoteSelect = (noteId: string) => {
    setActiveNoteId(noteId);
    setSidebarOpen(false);
  };

  const handleNoteCreate = () => {
    const newNote = addNote();
    setActiveNoteId(newNote.id);
    setSidebarOpen(false);
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
    import('@/lib/storage/blog-storage').then(({ publishNoteAsBlogPost }) => {
      publishNoteAsBlogPost(activeNote);
      updateNote(activeNote.id, { status: 'published' });
      setShowPublishModal(false);
    });
  };

  const notesListElement = (
    <NotesList
      notes={notes}
      activeNoteId={activeNoteId || undefined}
      onNoteSelect={handleNoteSelect}
      onNoteCreate={handleNoteCreate}
      onNoteDelete={handleNoteDelete}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    />
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col md:flex-row">
      {/* Mobile: Sheet trigger for notes sidebar */}
      <div className="flex items-center border-b p-3 md:hidden">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="min-h-11">
              <Menu className="mr-2 h-4 w-4" />
              Notes ({notes.length})
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[85vw] max-w-80 p-0">
            {notesListElement}
          </SheetContent>
        </Sheet>
        {activeNote && (
          <span className="ml-3 text-sm font-medium truncate">{activeNote.title}</span>
        )}
      </div>

      {/* Desktop: Sidebar */}
      <div className="hidden md:block w-80 shrink-0">
        {notesListElement}
      </div>

      {/* Editor area */}
      <div className="flex flex-1 flex-col min-w-0">
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
