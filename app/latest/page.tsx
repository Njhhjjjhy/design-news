'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CategoryNavigation } from '@/components/news/category-navigation';
import { NewsCard } from '@/components/news/news-card';
import { FilterBar } from '@/components/news/filter-bar';
import { useNewsFilter } from '@/hooks/useNewsFilter';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { NewsItem } from '@/lib/types';
import { animateCardsIn, scrollFadeIn } from '@/lib/utils/gsap-animations';

async function fetchNews(): Promise<NewsItem[]> {
  const response = await fetch('/api/news');
  if (!response.ok) {
    throw new Error('Failed to fetch news');
  }
  const data = await response.json();
  // Convert date strings back to Date objects
  return data.map((item: NewsItem) => ({
    ...item,
    publishDate: new Date(item.publishDate),
  }));
}

function LatestPageContent() {
  const [isMounted, setIsMounted] = useState(false);
  
  const { data: news = [], isLoading, error } = useQuery<NewsItem[]>({
    queryKey: ['news'],
    queryFn: fetchNews,
    staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus if data is stale
    refetchOnMount: true, // Refetch on mount if data is stale
    refetchOnReconnect: true, // Refetch when network reconnects
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    filteredNews,
    activeCategory,
    searchQuery,
    viewMode,
    setCategory,
    updateSearch,
    updateViewMode,
  } = useNewsFilter(news);

  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!isLoading && filteredNews.length > 0 && cardsContainerRef.current) {
      const cards = cardsContainerRef.current.querySelectorAll('[role="listitem"]');
      animateCardsIn(cards, 0.2);
    }
  }, [filteredNews, isLoading, viewMode]);

  useEffect(() => {
    if (titleRef.current) {
      scrollFadeIn(titleRef.current);
    }
  }, []);

  // Keyboard shortcuts for categories (1-8)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const categoryMap: Record<string, 'UI' | 'UX' | 'AX' | 'VibeCoding' | 'DesignSystems' | 'Prototypes' | 'ComponentLibraries' | 'Interactions' | 'all'> = {
        '0': 'all',
        '1': 'UI',
        '2': 'UX',
        '3': 'AX',
        '4': 'VibeCoding',
        '5': 'DesignSystems',
        '6': 'Prototypes',
        '7': 'ComponentLibraries',
        '8': 'Interactions',
      };

      if (categoryMap[e.key]) {
        setCategory(categoryMap[e.key]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [setCategory]);

  if (error) {
    return (
      <div className="w-full px-4 md:px-5 lg:px-12 py-10 md:py-14 lg:py-20">
        <div className="mx-auto max-w-2xl text-center" role="alert">
          <h1 className="mb-4 text-2xl md:text-3xl lg:text-4xl font-bold">Error Loading News</h1>
          <p className="mb-4 text-xl text-muted-foreground">
            Failed to load news articles. Please try again later.
          </p>
          <Button onClick={() => window.location.reload()} className="text-lg px-6 py-3 h-auto">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-5 lg:px-12 py-6 md:py-8 lg:py-12 large:py-16">
      <header className="mb-4 md:mb-8 lg:mb-12 large:mb-16">
        <h1 ref={titleRef} className="text-2xl md:text-4xl lg:text-5xl large:text-6xl font-bold">Latest in Design</h1>
      </header>

      <div className="mb-4 md:mb-6 space-y-3 md:space-y-4">
        <CategoryNavigation activeCategory={activeCategory} onCategoryChange={setCategory} />
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={updateSearch}
          viewMode={viewMode}
          onViewModeChange={updateViewMode}
        />
      </div>

      {!isMounted || isLoading ? (
        <div
          className="grid gap-4 md:gap-6 lg:gap-8 large:gap-10 md:grid-cols-2 lg:grid-cols-3 large:grid-cols-4"
          role="list"
          aria-label="News articles"
        >
          {[...Array(6)].map((_, i) => (
            <div key={i} role="listitem">
              <div>
                <Card
                  className="hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer group focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 animate-pulse"
                  role="article"
                  tabIndex={0}
                >
                  <CardHeader>
                    <div className="mb-4 flex flex-wrap gap-3">
                      <Badge variant="outline" className="opacity-50">
                        <span className="invisible">UI</span>
                      </Badge>
                      <Badge variant="outline" className="opacity-50">
                        <span className="invisible">UX</span>
                      </Badge>
                    </div>
                    <CardTitle className="h-6 bg-muted rounded w-3/4 mb-2"></CardTitle>
                    <CardDescription className="h-4 bg-muted rounded w-1/2"></CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="space-y-2 mb-6">
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded w-5/6"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-muted rounded w-24"></div>
                      <div className="h-8 bg-muted rounded w-16"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-xl text-muted-foreground">No articles found matching your filters.</p>
        </div>
      ) : (
        <div
          ref={cardsContainerRef}
          className={
            viewMode === 'grid'
              ? 'grid gap-3 md:gap-6 lg:gap-8 large:gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 large:grid-cols-4'
              : viewMode === 'list'
                ? 'space-y-3 md:space-y-6 lg:space-y-8 large:space-y-10'
                : 'grid gap-3 md:gap-5 lg:gap-6 large:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 large:grid-cols-4'
          }
          role="list"
          aria-label="News articles"
        >
          {filteredNews.map((item) => (
            <div key={item.id} role="listitem">
              <NewsCard item={item} viewMode={viewMode} />
            </div>
          ))}
        </div>
      )}

      {isMounted && !isLoading && filteredNews.length > 0 && (
        <div className="mt-4 md:mt-8 lg:mt-12 large:mt-16 text-center text-sm md:text-lg text-muted-foreground">
          Showing {filteredNews.length} of {news.length} articles
        </div>
      )}
    </div>
  );
}

export default function LatestPage() {
  return (
    <Suspense fallback={
      <div className="w-full px-4 md:px-5 lg:px-12 py-6 md:py-8 lg:py-12 large:py-16">
        <div
          className="grid gap-4 md:gap-6 lg:gap-8 large:gap-10 md:grid-cols-2 lg:grid-cols-3 large:grid-cols-4"
          role="list"
          aria-label="News articles"
        >
          {[...Array(6)].map((_, i) => (
            <div key={i} role="listitem">
              <div>
                <Card 
                  className="hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer group focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 animate-pulse"
                  role="article"
                  tabIndex={0}
                >
                  <CardHeader>
                    <div className="mb-4 flex flex-wrap gap-3">
                      <Badge variant="outline" className="opacity-50">
                        <span className="invisible">UI</span>
                      </Badge>
                      <Badge variant="outline" className="opacity-50">
                        <span className="invisible">UX</span>
                      </Badge>
                    </div>
                    <CardTitle className="h-6 bg-muted rounded w-3/4 mb-2"></CardTitle>
                    <CardDescription className="h-4 bg-muted rounded w-1/2"></CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="space-y-2 mb-6">
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded w-5/6"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-muted rounded w-24"></div>
                      <div className="h-8 bg-muted rounded w-16"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
    }>
      <LatestPageContent />
    </Suspense>
  );
}

