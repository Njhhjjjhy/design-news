'use client';

import { useEffect, useRef } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Category } from '@/lib/types';
import { gsap } from 'gsap';

const categories: Category[] = [
  'UI',
  'UX',
  'AX',
  'VibeCoding',
  'DesignSystems',
  'Prototypes',
  'ComponentLibraries',
  'Interactions',
];

const categoryLabels: Record<Category, string> = {
  UI: 'UI',
  UX: 'UX',
  AX: 'Accessibility',
  VibeCoding: 'Vibe Coding',
  DesignSystems: 'Design Systems',
  Prototypes: 'Prototypes',
  ComponentLibraries: 'Components',
  Interactions: 'Interactions',
};

interface CategoryNavigationProps {
  activeCategory: Category | 'all';
  onCategoryChange: (category: Category | 'all') => void;
}

export function CategoryNavigation({ activeCategory, onCategoryChange }: CategoryNavigationProps) {
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tabsRef.current) {
      const triggers = tabsRef.current.querySelectorAll('[role="tab"]');
      gsap.from(triggers, {
        opacity: 0,
        y: -10,
        duration: 0.4,
        stagger: 0.03,
        ease: 'power2.out',
      });
    }
  }, []);

  return (
    <div ref={tabsRef}>
      <Tabs value={activeCategory} onValueChange={(value) => onCategoryChange(value as Category | 'all')}>
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9 h-auto" aria-label="Category navigation">
          <TabsTrigger 
            value="all" 
            className="text-base py-3"
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, {
                scale: 1.05,
                duration: 0.2,
                ease: 'power2.out',
              });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, {
                scale: 1,
                duration: 0.2,
                ease: 'power2.out',
              });
            }}
          >
            All
          </TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger 
              key={category} 
              value={category} 
              aria-label={`Filter by ${categoryLabels[category]}`} 
              className="text-base py-3"
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  scale: 1.05,
                  duration: 0.2,
                  ease: 'power2.out',
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  scale: 1,
                  duration: 0.2,
                  ease: 'power2.out',
                });
              }}
            >
              {categoryLabels[category]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
