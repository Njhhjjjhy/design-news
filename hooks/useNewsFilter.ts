'use client';

import { useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { NewsItem, Category, ViewMode } from '@/lib/types';

export function useNewsFilter(news: NewsItem[]) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [viewMode, setViewMode] = useState<ViewMode['type']>(
    (searchParams.get('view') as ViewMode['type']) || 'grid'
  );

  const activeCategory = (searchParams.get('category') as Category | 'all') || 'all';

  const filteredNews = useMemo(() => {
    let filtered = [...news];

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter((item) => item.category.includes(activeCategory));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.excerpt.toLowerCase().includes(query) ||
          item.source.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [news, activeCategory, searchQuery]);

  const setCategory = (category: Category | 'all') => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === 'all') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    router.push(`/latest?${params.toString()}`, { scroll: false });
  };

  const updateSearch = (query: string) => {
    setSearchQuery(query);
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    router.push(`/latest?${params.toString()}`, { scroll: false });
  };

  const updateViewMode = (mode: ViewMode['type']) => {
    setViewMode(mode);
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', mode);
    router.push(`/latest?${params.toString()}`, { scroll: false });
  };

  return {
    filteredNews,
    activeCategory,
    searchQuery,
    viewMode,
    setCategory,
    updateSearch,
    updateViewMode,
  };
}

