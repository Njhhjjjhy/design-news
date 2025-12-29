'use client';

import { useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { VideoItem, Category, ViewMode } from '@/lib/types';

export function useVideoFilter(videos: VideoItem[]) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [viewMode, setViewMode] = useState<ViewMode['type']>(
    (searchParams.get('view') as ViewMode['type']) || 'grid'
  );

  const activeCategory = (searchParams.get('category') as Category | 'all') || 'all';

  const filteredVideos = useMemo(() => {
    let filtered = [...videos];

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter((video) => video.category.includes(activeCategory));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (video) =>
          video.title.toLowerCase().includes(query) ||
          video.description.toLowerCase().includes(query) ||
          video.channelName.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [videos, activeCategory, searchQuery]);

  const setCategory = (category: Category | 'all') => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === 'all') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    router.push(`/videos?${params.toString()}`, { scroll: false });
  };

  const updateSearch = (query: string) => {
    setSearchQuery(query);
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    router.push(`/videos?${params.toString()}`, { scroll: false });
  };

  const updateViewMode = (mode: ViewMode['type']) => {
    setViewMode(mode);
    const params = new URLSearchParams(searchParams.toString());
    if (mode === 'grid') {
      params.delete('view');
    } else {
      params.set('view', mode);
    }
    router.push(`/videos?${params.toString()}`, { scroll: false });
  };

  return {
    filteredVideos,
    activeCategory,
    searchQuery,
    viewMode,
    setCategory,
    updateSearch,
    updateViewMode,
  };
}

