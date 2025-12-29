import type { NewsItem, Note } from '@/lib/types';

export interface SearchResult {
  type: 'news' | 'note';
  id: string;
  title: string;
  excerpt: string;
  url?: string;
  category: string[];
  date: Date;
}

export function searchNewsAndNotes(
  news: NewsItem[],
  notes: Note[],
  query: string
): SearchResult[] {
  if (!query.trim()) return [];

  const searchTerm = query.toLowerCase();
  const results: SearchResult[] = [];

  // Search news
  news.forEach((item) => {
    const matchesTitle = item.title.toLowerCase().includes(searchTerm);
    const matchesExcerpt = item.excerpt.toLowerCase().includes(searchTerm);
    const matchesSource = item.source.toLowerCase().includes(searchTerm);

    if (matchesTitle || matchesExcerpt || matchesSource) {
      results.push({
        type: 'news',
        id: item.id,
        title: item.title,
        excerpt: item.excerpt,
        url: item.url,
        category: item.category,
        date: item.publishDate,
      });
    }
  });

  // Search notes
  notes.forEach((note) => {
    const matchesTitle = note.title.toLowerCase().includes(searchTerm);
    const matchesContent = note.content.toLowerCase().includes(searchTerm);

    if (matchesTitle || matchesContent) {
      results.push({
        type: 'note',
        id: note.id,
        title: note.title,
        excerpt: note.content.replace(/<[^>]*>/g, '').substring(0, 200),
        category: note.category,
        date: note.updatedAt,
      });
    }
  });

  // Sort by relevance (title matches first) and date
  results.sort((a, b) => {
    const aTitleMatch = a.title.toLowerCase().startsWith(searchTerm) ? 1 : 0;
    const bTitleMatch = b.title.toLowerCase().startsWith(searchTerm) ? 1 : 0;
    if (aTitleMatch !== bTitleMatch) return bTitleMatch - aTitleMatch;
    return b.date.getTime() - a.date.getTime();
  });

  return results;
}

export function highlightMatch(text: string, query: string): string {
  if (!query.trim()) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

