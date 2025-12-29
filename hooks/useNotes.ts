'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAllNotes, saveNote, deleteNote, createNote, getNoteById } from '@/lib/storage/notes-storage';
import type { Note, Category } from '@/lib/types';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setNotes(getAllNotes());
    setIsLoading(false);
  }, []);

  const addNote = useCallback((title?: string) => {
    const newNote = createNote(title);
    saveNote(newNote);
    setNotes(getAllNotes());
    return newNote;
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    const existing = getNoteById(id);
    if (!existing) return;
    
    const updated: Note = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    
    saveNote(updated);
    setNotes(getAllNotes());
  }, []);

  const removeNote = useCallback((id: string) => {
    deleteNote(id);
    setNotes(getAllNotes());
  }, []);

  const getNote = useCallback((id: string) => {
    return getNoteById(id);
  }, []);

  return {
    notes,
    isLoading,
    addNote,
    updateNote,
    removeNote,
    getNote,
    refreshNotes: () => setNotes(getAllNotes()),
  };
}

