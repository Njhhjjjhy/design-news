'use client';

import { useState, useEffect, useMemo } from 'react';
import { searchNewsAndNotes } from '@/lib/utils/search';
import type { NewsItem, Note } from '@/lib/types';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useSearch(news: NewsItem[], notes: Note[]) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    return searchNewsAndNotes(news, notes, debouncedQuery);
  }, [news, notes, debouncedQuery]);

  return {
    query,
    setQuery,
    results,
    isSearching: debouncedQuery.trim().length > 0,
  };
}

