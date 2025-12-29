'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, Grid3x3, List, LayoutGrid } from 'lucide-react';
import type { ViewMode } from '@/lib/types';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: ViewMode['type'];
  onViewModeChange: (mode: ViewMode['type']) => void;
}

export function FilterBar({ searchQuery, onSearchChange, viewMode, onViewModeChange }: FilterBarProps) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 h-12 text-base"
        />
      </div>
      <div className="flex items-center gap-3">
        <span className="text-base text-muted-foreground hidden sm:inline">View:</span>
        <div className="flex rounded-lg border">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className="rounded-r-none h-12 px-4"
            aria-label="Grid view"
          >
            <Grid3x3 className="h-5 w-5" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('list')}
            className="rounded-none border-x h-12 px-4"
            aria-label="List view"
          >
            <List className="h-5 w-5" />
          </Button>
          <Button
            variant={viewMode === 'compact' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('compact')}
            className="rounded-l-none h-12 px-4"
            aria-label="Compact view"
          >
            <LayoutGrid className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

