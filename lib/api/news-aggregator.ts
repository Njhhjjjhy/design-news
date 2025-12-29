import { parseRSSFeed, newsSources } from './rss-parser';
import type { NewsItem } from '@/lib/types';

interface CacheEntry {
  data: NewsItem[];
  timestamp: number;
}

const CACHE_TTL = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
const cache = new Map<string, CacheEntry>();

export async function aggregateNews(): Promise<NewsItem[]> {
  const cacheKey = 'all-news';
  const cached = cache.get(cacheKey);

  // Return cached data if still valid
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    // Fetch from all sources in parallel with timeout
    const fetchPromises = newsSources.map((source) => 
      Promise.race([
        parseRSSFeed(source.rssUrl),
        new Promise<NewsItem[]>((resolve) => 
          setTimeout(() => resolve([]), 8000) // 8 second timeout per feed
        )
      ])
    );
    const results = await Promise.allSettled(fetchPromises);

    // Combine all successful results
    const allItems: NewsItem[] = [];
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allItems.push(...result.value);
      } else {
        console.error(`Failed to fetch from ${newsSources[index].name}:`, result.reason);
      }
    });

    // Remove duplicates based on URL
    const uniqueItems = removeDuplicates(allItems);

    // Sort by publish date (newest first)
    uniqueItems.sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());

    // Cache the results
    cache.set(cacheKey, {
      data: uniqueItems,
      timestamp: Date.now(),
    });

    return uniqueItems;
  } catch (error) {
    console.error('Error aggregating news:', error);
    // Return cached data even if expired as fallback
    if (cached) {
      return cached.data;
    }
    return [];
  }
}

function removeDuplicates(items: NewsItem[]): NewsItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.url.toLowerCase();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

export function clearCache(): void {
  cache.clear();
}

