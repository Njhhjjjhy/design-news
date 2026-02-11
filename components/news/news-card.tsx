'use client';

import { useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ExternalLink } from 'lucide-react';
import type { NewsItem, Category } from '@/lib/types';
import { motion } from 'framer-motion';
import { setupCardHover, setupBadgeHover, setupButtonHover } from '@/lib/utils/gsap-animations';
import { gsap } from 'gsap';

const categoryColors: Record<Category, string> = {
  UI: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  UX: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  AX: 'bg-green-500/10 text-green-500 border-green-500/20',
  VibeCoding: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  DesignSystems: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
  Prototypes: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  ComponentLibraries: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  Interactions: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
};

interface NewsCardProps {
  item: NewsItem;
  viewMode?: 'grid' | 'list' | 'compact';
}

export function NewsCard({ item, viewMode = 'grid' }: NewsCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      setupCardHover(cardRef.current);
    }
    // Setup badge animations after mount to avoid hydration issues
    if (cardContainerRef.current) {
      const badges = cardContainerRef.current.querySelectorAll('[data-slot="badge"]');
      badges.forEach((badge) => {
        if (badge instanceof HTMLElement) {
          setupBadgeHover(badge);
        }
      });
    }
  }, []);

  if (viewMode === 'compact') {
    return (
      <Card 
        className="hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
        role="article"
        aria-labelledby={`article-title-${item.id}-compact`}
        tabIndex={0}
      >
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-3">
            <CardTitle id={`article-title-${item.id}-compact`} className="text-base line-clamp-2 flex-1">{item.title}</CardTitle>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="flex-shrink-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label={`Read full article: ${item.title} from ${item.source}. Opens in new tab.`}
              >
                <ExternalLink className="h-5 w-5" aria-hidden="true" />
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              <span className="sr-only">Published by </span>
              {item.source}
            </span>
            <time dateTime={item.publishDate.toISOString()}>{format(item.publishDate, 'MMM d')}</time>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ x: 4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <Card
          className="hover:shadow-xl transition-all duration-300 cursor-pointer group focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
          role="article"
          aria-labelledby={`article-title-${item.id}-list`}
          tabIndex={0}
        >
        <CardHeader className="p-4 md:p-6">
          <div className="mb-2 md:mb-4 flex flex-wrap gap-1.5 md:gap-3">
            {item.category.map((cat) => (
              <Badge key={cat} variant="outline" className={`${categoryColors[cat]} text-xs md:text-base px-2 md:px-3 py-0.5 md:py-1`} aria-label={`Category: ${cat}`}>
                {cat}
              </Badge>
            ))}
          </div>
          <CardTitle id={`article-title-${item.id}-list`} className="line-clamp-2 text-lg md:text-2xl mb-1 md:mb-2">{item.title}</CardTitle>
          <CardDescription className="text-sm md:text-lg">
            <span className="sr-only">Published by </span>
            {item.source}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
          <p className="mb-3 md:mb-6 text-sm md:text-lg text-muted-foreground line-clamp-2 md:line-clamp-3 leading-relaxed">{item.excerpt}</p>
          <div className="flex items-center justify-between">
            <div className="text-xs md:text-base text-muted-foreground">
              <time dateTime={item.publishDate.toISOString()}>{format(item.publishDate, 'MMM d, yyyy')}</time>
              {item.author && (
                <>
                  <span className="sr-only"> by </span>
                  <span aria-label={`Author: ${item.author}`}> • {item.author}</span>
                </>
              )}
            </div>
            <Button asChild variant="outline" size="sm" className="text-xs md:text-base group-hover:bg-accent transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Read full article: ${item.title} from ${item.source}. Opens in new tab.`}
              >
                Read More <ExternalLink className="ml-1 md:ml-2 h-4 w-4 md:h-5 md:w-5 inline-block group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
    );
  }

  // Grid view (default)
  return (
    <div ref={cardContainerRef}>
      <Card
        ref={cardRef}
        className="hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer group focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
        role="article"
        aria-labelledby={`article-title-${item.id}`}
        tabIndex={0}
      >
      <CardHeader className="p-4 md:p-6">
        <div className="mb-2 md:mb-4 flex flex-wrap gap-1.5 md:gap-3">
          {item.category.map((cat) => (
            <Badge
              key={cat}
              variant="outline"
              className={`${categoryColors[cat]} text-xs md:text-base px-2 md:px-3 py-0.5 md:py-1 cursor-pointer transition-all hover:shadow-sm`}
              aria-label={`Category: ${cat}`}
            >
              {cat}
            </Badge>
          ))}
        </div>
        <CardTitle id={`article-title-${item.id}`} className="line-clamp-2 text-base md:text-xl mb-1 md:mb-2">{item.title}</CardTitle>
        <CardDescription className="text-sm md:text-base">
          <span className="sr-only">Published by </span>
          {item.source}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-4 pt-0 md:p-6 md:pt-0">
        <p className="mb-3 md:mb-6 text-sm md:text-base text-muted-foreground line-clamp-2 flex-1 leading-relaxed">{item.excerpt}</p>
        <div className="flex items-center justify-between text-xs md:text-base text-muted-foreground">
          <time dateTime={item.publishDate.toISOString()}>{format(item.publishDate, 'MMM d, yyyy')}</time>
            <Button asChild variant="ghost" size="sm" className="text-xs md:text-base group-hover:bg-accent transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Read full article: ${item.title} from ${item.source}. Opens in new tab.`}
                onMouseEnter={(e) => {
                  const icon = e.currentTarget.querySelector('svg');
                  if (icon) {
                    gsap.to(icon, { x: 4, duration: 0.3, ease: 'power2.out' });
                  }
                }}
                onMouseLeave={(e) => {
                  const icon = e.currentTarget.querySelector('svg');
                  if (icon) {
                    gsap.to(icon, { x: 0, duration: 0.3, ease: 'power2.out' });
                  }
                }}
              >
                Read <ExternalLink className="ml-1 h-4 w-4 inline-block" aria-hidden="true" />
              </a>
            </Button>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}

