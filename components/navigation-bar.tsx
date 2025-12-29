'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Search, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useSearch } from '@/hooks/useSearch';
import { useQuery } from '@tanstack/react-query';
import { useNotes } from '@/hooks/useNotes';
import type { NewsItem } from '@/lib/types';
import { motion } from 'framer-motion';
import { setupButtonHover, animateSearchFocus, animateIcon } from '@/lib/utils/gsap-animations';
import { gsap } from 'gsap';

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

export function NavigationBar() {
  const pathname = usePathname();
  const { data: news = [] } = useQuery<NewsItem[]>({
    queryKey: ['news'],
    queryFn: fetchNews,
    staleTime: 2 * 60 * 60 * 1000,
  });
  const { notes } = useNotes();
  const { query, setQuery, results } = useSearch(news, notes);

  const logoIconRef = useRef<SVGSVGElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navButtonsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    // Animate logo icon on mount
    if (logoIconRef.current) {
      gsap.from(logoIconRef.current, {
        rotation: -180,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.7)',
      });
    }

    // Setup search input animation
    if (searchInputRef.current) {
      animateSearchFocus(searchInputRef.current);
    }

    // Setup button hover animations
    navButtonsRef.current.forEach((button) => {
      if (button) setupButtonHover(button);
    });
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav 
        className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex h-20 items-center justify-between px-12">
          <Link 
            href="/" 
            className="flex items-center space-x-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
            aria-label="Design News home page"
            onMouseEnter={() => {
              if (logoIconRef.current) {
                gsap.to(logoIconRef.current, {
                  rotation: 15,
                  scale: 1.1,
                  duration: 0.3,
                  ease: 'back.out(1.7)',
                });
              }
            }}
            onMouseLeave={() => {
              if (logoIconRef.current) {
                gsap.to(logoIconRef.current, {
                  rotation: 0,
                  scale: 1,
                  duration: 0.3,
                  ease: 'power2.out',
                });
              }
            }}
          >
            <Newspaper ref={logoIconRef} className="h-7 w-7 transition-colors group-hover:text-primary" aria-hidden="true" />
            <span className="text-2xl font-semibold transition-colors group-hover:text-primary">Design News</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              asChild
              className={cn(
                'text-lg font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                isActive('/notes') && 'text-foreground'
              )}
            >
              <Link 
                ref={(el) => { navButtonsRef.current[0] = el; }}
                href="/notes"
                aria-label="View and manage notes"
                aria-current={isActive('/notes') ? 'page' : undefined}
              >
                Notes
              </Link>
            </Button>
            <Button
              variant="ghost"
              asChild
              className={cn(
                'text-lg font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                isActive('/blog') && 'text-foreground'
              )}
            >
              <Link 
                ref={(el) => { navButtonsRef.current[1] = el; }}
                href="/blog"
                aria-label="View published blog posts"
                aria-current={isActive('/blog') ? 'page' : undefined}
              >
                Blog
              </Link>
            </Button>
            <Button
              variant="ghost"
              asChild
              className={cn(
                'text-lg font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                isActive('/videos') && 'text-foreground'
              )}
            >
              <Link 
                ref={(el) => { navButtonsRef.current[2] = el; }}
                href="/videos"
                aria-label="Browse design videos"
                aria-current={isActive('/videos') ? 'page' : undefined}
              >
                Videos
              </Link>
            </Button>
            <div className="relative w-80">
              <Search 
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors"
                aria-hidden="true"
              />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search articles and notes..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search design news articles and notes"
                aria-describedby="search-description"
                className="h-12 w-full rounded-full bg-muted pl-12 pr-4 text-base border-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 hover:bg-muted/80 focus:bg-muted/90"
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget, {
                    scale: 1.02,
                    duration: 0.3,
                    ease: 'power2.out',
                  });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out',
                  });
                }}
              />
              <span id="search-description" className="sr-only">Type to search articles and notes</span>
              {query.trim() && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  <div className="p-2 space-y-1">
                    {results.slice(0, 10).map((result) => (
                      <Link
                        key={result.id}
                        href={result.url || `/notes?note=${result.id}`}
                        target={result.url ? '_blank' : undefined}
                        rel={result.url ? 'noopener noreferrer' : undefined}
                        className="block p-3 rounded-md hover:bg-muted transition-colors"
                      >
                        <div className="font-medium text-sm mb-1">{result.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">{result.excerpt}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
