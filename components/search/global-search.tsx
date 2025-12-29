'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, FileText, Newspaper } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { highlightMatch } from '@/lib/utils/search';
import type { SearchResult } from '@/lib/utils/search';

interface GlobalSearchProps {
  results: SearchResult[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  query: string;
  onQueryChange: (query: string) => void;
}

export function GlobalSearch({
  results,
  isOpen,
  onOpenChange,
  query,
  onQueryChange,
}: GlobalSearchProps) {
  const groupedResults = results.reduce(
    (acc, result) => {
      if (!acc[result.type]) {
        acc[result.type] = [];
      }
      acc[result.type].push(result);
      return acc;
    },
    {} as Record<'news' | 'note', SearchResult[]>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search news and notes..."
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          {query.trim() && (
            <ScrollArea className="max-h-[400px]">
              {results.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No results found
                </div>
              ) : (
                <div className="space-y-6">
                  {groupedResults.news && groupedResults.news.length > 0 && (
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                        <Newspaper className="h-4 w-4" />
                        News Articles ({groupedResults.news.length})
                      </div>
                      <div className="space-y-2">
                        {groupedResults.news.map((result) => (
                          <Link
                            key={result.id}
                            href={result.url || '#'}
                            target={result.url ? '_blank' : undefined}
                            rel={result.url ? 'noopener noreferrer' : undefined}
                            className="block rounded-lg border p-3 hover:bg-muted transition-colors"
                            onClick={() => onOpenChange(false)}
                          >
                            <div
                              className="mb-1 font-medium"
                              dangerouslySetInnerHTML={{
                                __html: highlightMatch(result.title, query),
                              }}
                            />
                            <div
                              className="mb-2 text-xs text-muted-foreground line-clamp-2"
                              dangerouslySetInnerHTML={{
                                __html: highlightMatch(result.excerpt, query),
                              }}
                            />
                            <div className="flex items-center gap-2">
                              <div className="flex flex-wrap gap-1">
                                {result.category.slice(0, 2).map((cat) => (
                                  <Badge key={cat} variant="outline" className="text-xs">
                                    {cat}
                                  </Badge>
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {format(result.date, 'MMM d, yyyy')}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {groupedResults.note && groupedResults.note.length > 0 && (
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                        <FileText className="h-4 w-4" />
                        Notes ({groupedResults.note.length})
                      </div>
                      <div className="space-y-2">
                        {groupedResults.note.map((result) => (
                          <Link
                            key={result.id}
                            href={`/notes?note=${result.id}`}
                            className="block rounded-lg border p-3 hover:bg-muted transition-colors"
                            onClick={() => onOpenChange(false)}
                          >
                            <div
                              className="mb-1 font-medium"
                              dangerouslySetInnerHTML={{
                                __html: highlightMatch(result.title, query),
                              }}
                            />
                            <div
                              className="mb-2 text-xs text-muted-foreground line-clamp-2"
                              dangerouslySetInnerHTML={{
                                __html: highlightMatch(result.excerpt, query),
                              }}
                            />
                            <div className="flex items-center gap-2">
                              <div className="flex flex-wrap gap-1">
                                {result.category.slice(0, 2).map((cat) => (
                                  <Badge key={cat} variant="outline" className="text-xs">
                                    {cat}
                                  </Badge>
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {format(result.date, 'MMM d, yyyy')}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

