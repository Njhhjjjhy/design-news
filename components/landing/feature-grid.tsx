'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Newspaper, 
  FileText, 
  BookOpen, 
  Search,
  Tag,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Newspaper,
    title: 'Curated News Aggregation',
    description: 'Stay updated with the latest design industry news from trusted sources, automatically categorized for easy discovery.',
    badges: ['RSS Feeds', 'Auto-Categorization'],
    href: '/latest',
  },
  {
    icon: Tag,
    title: '8 Design Categories',
    description: 'Organized content across UI, UX, Accessibility, Vibe Coding, Design Systems, Prototypes, Component Libraries, and Interactions.',
    badges: ['UI', 'UX', 'AX', 'More'],
    href: '/latest',
  },
  {
    icon: FileText,
    title: 'Integrated Note-Taking',
    description: 'Capture insights and ideas with a powerful markdown editor. Your notes are saved locally and ready to publish.',
    badges: ['Markdown', 'Auto-Save'],
    href: '/notes',
  },
  {
    icon: BookOpen,
    title: 'Blog Publishing',
    description: 'Transform your notes into polished blog posts with one click. Generate clean HTML with proper styling and metadata.',
    badges: ['One-Click', 'SEO Ready'],
    href: '/blog',
  },
  {
    icon: Search,
    title: 'Unified Search',
    description: 'Search across all news articles and your notes simultaneously. Find exactly what you need with intelligent filtering.',
    badges: ['Real-time', 'Debounced'],
    href: '/latest',
  },
  {
    icon: Zap,
    title: 'Fast & Responsive',
    description: 'Built with Next.js 14+ for optimal performance. Fully responsive design that works beautifully on all devices.',
    badges: ['Next.js', 'Mobile-First'],
    href: null,
  },
];

export function FeatureGrid() {
  return (
    <section className="w-full px-4 md:px-5 lg:px-12 py-8 md:py-16 lg:py-24 large:py-32">
      <div className="mx-auto w-full max-w-none">
        <h2 className="mb-6 md:mb-12 lg:mb-16 text-center text-2xl md:text-4xl lg:text-5xl large:text-6xl font-bold">Features</h2>
        <div className="grid gap-3 md:gap-6 lg:gap-8 large:gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {feature.href ? (
                  <Link href={feature.href} className="block h-full">
                    <Card className="flex flex-col hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer h-full">
                      <CardHeader>
                        <div className="mb-4 md:mb-6 flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                        </div>
                        <CardTitle className="text-lg md:text-2xl mb-2 md:mb-4">{feature.title}</CardTitle>
                        <CardDescription className="text-sm md:text-lg leading-relaxed">{feature.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="mt-auto">
                        <div className="flex flex-wrap gap-3">
                          {feature.badges.map((badge) => (
                            <Badge key={badge} variant="secondary" className="text-xs md:text-base px-2 md:px-3 py-0.5 md:py-1">
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ) : (
                  <Card className="flex flex-col h-full">
                    <CardHeader>
                      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="text-2xl mb-4">{feature.title}</CardTitle>
                      <CardDescription className="text-lg leading-relaxed">{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto">
                      <div className="flex flex-wrap gap-3">
                        {feature.badges.map((badge) => (
                          <Badge key={badge} variant="secondary" className="text-base px-3 py-1">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

