'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Grid3x3, List, LayoutGrid } from 'lucide-react';
import type { ViewMode } from '@/lib/types';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: ViewMode['type'];
  onViewModeChange: (mode: ViewMode['type']) => void;
}

export function FilterBar({ searchQuery, onSearchChange, viewMode, onViewModeChange }: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 md:left-4 top-1/2 h-4 w-4 md:h-5 md:w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 md:pl-12 pr-14 md:pr-16 h-10 md:h-12 text-sm md:text-base"
          aria-label="Search articles"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 active:bg-muted transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <span className="text-sm md:text-base text-muted-foreground hidden sm:inline">View:</span>
        <div className="flex rounded-lg border">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className="rounded-r-none h-9 md:h-12 px-3 md:px-4"
            aria-label="Grid view"
          >
            <Grid3x3 className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('list')}
            className="rounded-none border-x h-9 md:h-12 px-3 md:px-4"
            aria-label="List view"
          >
            <List className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          <Button
            variant={viewMode === 'compact' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('compact')}
            className="rounded-l-none h-9 md:h-12 px-3 md:px-4"
            aria-label="Compact view"
          >
            <LayoutGrid className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
