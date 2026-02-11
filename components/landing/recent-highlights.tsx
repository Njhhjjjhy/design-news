'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';
import type { NewsItem, Category } from '@/lib/types';

interface RecentHighlightsProps {
  highlights?: NewsItem[];
}

const categoryColors: Record<Category, string> = {
  UI: 'bg-blue-500/10 text-blue-500',
  UX: 'bg-purple-500/10 text-purple-500',
  AX: 'bg-green-500/10 text-green-500',
  VibeCoding: 'bg-orange-500/10 text-orange-500',
  DesignSystems: 'bg-pink-500/10 text-pink-500',
  Prototypes: 'bg-yellow-500/10 text-yellow-500',
  ComponentLibraries: 'bg-cyan-500/10 text-cyan-500',
  Interactions: 'bg-indigo-500/10 text-indigo-500',
};

const mockHighlights: NewsItem[] = [
  {
    id: '1',
    title: 'The Future of Design Systems',
    excerpt: 'Exploring how modern design systems are evolving to support better collaboration and scalability.',
    url: '#',
    source: 'Smashing Magazine',
    category: ['DesignSystems'],
    publishDate: new Date(),
  },
  {
    id: '2',
    title: 'Accessibility First: A New Standard',
    excerpt: 'Why accessibility should be at the core of every design decision, not an afterthought.',
    url: '#',
    source: 'A List Apart',
    category: ['AX'],
    publishDate: new Date(),
  },
  {
    id: '3',
    title: 'Building Interactive Prototypes',
    excerpt: 'A comprehensive guide to creating prototypes that truly communicate your design vision.',
    url: '#',
    source: 'Medium',
    category: ['Prototypes'],
    publishDate: new Date(),
  },
  {
    id: '4',
    title: 'Component Library Best Practices',
    excerpt: 'Learn how to structure and maintain component libraries that scale with your team.',
    url: '#',
    source: 'Figma Blog',
    category: ['ComponentLibraries'],
    publishDate: new Date(),
  },
];

export function RecentHighlights({ highlights = mockHighlights }: RecentHighlightsProps) {
  return (
    <section className="w-full px-4 md:px-5 lg:px-12 py-8 md:py-16 lg:py-24 large:py-32">
      <div className="mx-auto w-full max-w-none">
        <div className="mb-4 md:mb-12 lg:mb-16 flex items-center justify-between gap-4">
          <h2 className="text-2xl md:text-4xl lg:text-5xl large:text-6xl font-bold">Recent Highlights</h2>
          <Button asChild variant="outline" className="text-xs md:text-lg px-4 md:px-6 py-2 md:py-3 h-auto shrink-0">
            <Link href="/latest">View All</Link>
          </Button>
        </div>
        <div className="grid gap-3 md:gap-6 lg:gap-8 large:gap-10 grid-cols-1 md:grid-cols-2">
          {highlights.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="p-4 md:p-6">
                <div className="mb-2 md:mb-4 flex flex-wrap gap-1.5 md:gap-3">
                  {item.category.map((cat) => (
                    <Badge key={cat} className={`${categoryColors[cat]} text-xs md:text-base px-2 md:px-3 py-0.5 md:py-1`}>
                      {cat}
                    </Badge>
                  ))}
                </div>
                <CardTitle className="line-clamp-2 text-base md:text-2xl mb-1 md:mb-2">{item.title}</CardTitle>
                <CardDescription className="text-sm md:text-lg">{item.source}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
                <p className="mb-3 md:mb-6 text-sm md:text-lg text-muted-foreground line-clamp-2 leading-relaxed">{item.excerpt}</p>
                <div className="flex items-center justify-between text-xs md:text-base text-muted-foreground">
                  <span>{format(item.publishDate, 'MMM d, yyyy')}</span>
                  <Button asChild variant="ghost" size="sm" className="text-xs md:text-base">
                    <Link href={item.url} target="_blank" rel="noopener noreferrer">
                      Read More →
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

