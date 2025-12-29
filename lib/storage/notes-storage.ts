import type { Note } from '@/lib/types';

const STORAGE_KEY = 'design-news-notes';

export function getAllNotes(): Note[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const notes = JSON.parse(stored) as Note[];
    // Convert date strings back to Date objects
    return notes.map((note) => ({
      ...note,
      createdAt: new Date(note.createdAt),
      updatedAt: new Date(note.updatedAt),
    }));
  } catch (error) {
    console.error('Error reading notes from localStorage:', error);
    return [];
  }
}

export function getNoteById(id: string): Note | null {
  const notes = getAllNotes();
  return notes.find((note) => note.id === id) || null;
}

export function saveNote(note: Note): void {
  if (typeof window === 'undefined') return;
  
  try {
    const notes = getAllNotes();
    const existingIndex = notes.findIndex((n) => n.id === note.id);
    
    if (existingIndex >= 0) {
      notes[existingIndex] = { ...note, updatedAt: new Date() };
    } else {
      notes.push({ ...note, createdAt: new Date(), updatedAt: new Date() });
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Error saving note to localStorage:', error);
    throw error;
  }
}

export function deleteNote(id: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const notes = getAllNotes();
    const filtered = notes.filter((note) => note.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting note from localStorage:', error);
    throw error;
  }
}

export function createNote(title: string = 'Untitled Note'): Note {
  return {
    id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title,
    content: '',
    category: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'draft',
  };
}

export function exportNoteAsMarkdown(note: Note): string {
  return `# ${note.title}\n\n${note.content}`;
}

export function importNoteFromMarkdown(markdown: string): Note {
  const lines = markdown.split('\n');
  const title = lines[0].replace(/^#\s*/, '') || 'Imported Note';
  const content = lines.slice(1).join('\n').trim();
  
  return createNote(title);
}

