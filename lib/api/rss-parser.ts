import Parser from 'rss-parser';
import type { NewsItem, Category, NewsSource } from '@/lib/types';

const parser = new Parser({
  customFields: {
    item: [
      ['content:encoded', 'content'],
      ['media:content', 'media'],
    ],
  },
});

export async function parseRSSFeed(url: string): Promise<NewsItem[]> {
  try {
    // Use Promise.race to add timeout
    const feed = await Promise.race([
      parser.parseURL(url),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('RSS feed timeout')), 8000)
      )
    ]);
    
    const items: NewsItem[] = [];

    for (const item of feed.items) {
      if (!item.title || !item.link) continue;

      const newsItem: NewsItem = {
        id: item.guid || item.link || `item-${Date.now()}-${Math.random()}`,
        title: item.title,
        excerpt: item.contentSnippet || item.content?.substring(0, 200) || '',
        content: item.content || item['content:encoded'] || '',
        url: item.link,
        source: feed.title || 'Unknown',
        category: categorizeContent(item.title, item.contentSnippet || item.content || ''),
        publishDate: item.pubDate ? new Date(item.pubDate) : new Date(),
        author: (item as any).creator || (item as any).author || undefined,
        imageUrl: item.enclosure?.url || item['media:content']?.['$']?.url || undefined,
      };

      items.push(newsItem);
    }

    return items;
  } catch (error) {
    console.error(`Error parsing RSS feed ${url}:`, error);
    return [];
  }
}

function categorizeContent(title: string, content: string): Category[] {
  const text = `${title} ${content}`.toLowerCase();
  const categories: Category[] = [];

  // UI keywords
  if (/\b(ui|user interface|interface design|visual design|pixel perfect|mockup|wireframe)\b/i.test(text)) {
    categories.push('UI');
  }

  // UX keywords
  if (/\b(ux|user experience|usability|user research|user testing|persona|journey map|user flow)\b/i.test(text)) {
    categories.push('UX');
  }

  // AX (Accessibility) keywords
  if (/\b(accessibility|a11y|wcag|screen reader|aria|accessible|inclusive design|disability)\b/i.test(text)) {
    categories.push('AX');
  }

  // Vibe Coding keywords
  if (/\b(vibe coding|creative coding|generative|artistic code|visual programming|creative tech)\b/i.test(text)) {
    categories.push('VibeCoding');
  }

  // Design Systems keywords
  if (/\b(design system|design token|component system|design language|design standards)\b/i.test(text)) {
    categories.push('DesignSystems');
  }

  // Prototypes keywords
  if (/\b(prototype|prototyping|interactive prototype|rapid prototyping|prototype tool)\b/i.test(text)) {
    categories.push('Prototypes');
  }

  // Component Libraries keywords
  if (/\b(component library|ui library|component kit|design library|component set)\b/i.test(text)) {
    categories.push('ComponentLibraries');
  }

  // Interactions keywords
  if (/\b(interaction|microinteraction|animation|motion design|transition|gesture|interactive)\b/i.test(text)) {
    categories.push('Interactions');
  }

  // Default to UI if no categories found
  if (categories.length === 0) {
    categories.push('UI');
  }

  return categories;
}

export const newsSources: NewsSource[] = [
  {
    name: 'Smashing Magazine',
    url: 'https://www.smashingmagazine.com',
    rssUrl: 'https://www.smashingmagazine.com/feed/',
  },
  {
    name: 'A List Apart',
    url: 'https://alistapart.com',
    rssUrl: 'https://alistapart.com/main/feed/',
  },
  {
    name: 'CSS-Tricks',
    url: 'https://css-tricks.com',
    rssUrl: 'https://css-tricks.com/feed/',
  },
  {
    name: 'Figma Blog',
    url: 'https://www.figma.com/blog',
    rssUrl: 'https://www.figma.com/blog/feed/',
  },
  {
    name: 'Adobe Design',
    url: 'https://xd.adobe.com',
    rssUrl: 'https://blog.adobe.com/en/feeds/all.rss',
  },
  {
    name: 'Design Systems Media',
    url: 'https://designsystems.media',
    rssUrl: 'https://designsystems.media/feed/',
  },
  {
    name: 'Design Systems',
    url: 'https://www.designsystems.com',
    rssUrl: 'https://www.designsystems.com/feed/',
  },
  {
    name: 'Medium Design',
    url: 'https://medium.com',
    rssUrl: 'https://medium.com/feed/tag/design',
  },
  {
    name: 'Craftwork Design',
    url: 'https://craftwork.design',
    rssUrl: 'https://craftwork.design/feed/',
  },
];

