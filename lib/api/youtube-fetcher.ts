import Parser from 'rss-parser';
import type { VideoItem, Category } from '@/lib/types';
import { youtubeChannels, getChannelRSSUrl, type YouTubeChannel } from './youtube-channels';

const parser = new Parser({
  customFields: {
    item: [
      ['media:group', 'mediaGroup'],
      ['yt:videoId', 'videoId'],
      ['yt:channelId', 'channelId'],
    ],
  },
});

function categorizeVideo(title: string, description: string): Category[] {
  const text = `${title} ${description}`.toLowerCase();
  const categories: Category[] = [];

  // UI keywords
  if (/\b(ui|user interface|interface design|visual design|pixel perfect|mockup|wireframe|figma|sketch)\b/i.test(text)) {
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
  if (/\b(vibe coding|creative coding|generative|artistic code|visual programming|creative tech|p5\.js|processing)\b/i.test(text)) {
    categories.push('VibeCoding');
  }

  // Design Systems keywords
  if (/\b(design system|design token|component system|design language|design standards|storybook)\b/i.test(text)) {
    categories.push('DesignSystems');
  }

  // Prototypes keywords
  if (/\b(prototype|prototyping|interactive prototype|rapid prototyping|prototype tool|framer|principle)\b/i.test(text)) {
    categories.push('Prototypes');
  }

  // Component Libraries keywords
  if (/\b(component library|ui library|component kit|design library|component set|react components|vue components)\b/i.test(text)) {
    categories.push('ComponentLibraries');
  }

  // Interactions keywords
  if (/\b(interaction|microinteraction|animation|motion design|transition|gesture|interactive|after effects)\b/i.test(text)) {
    categories.push('Interactions');
  }

  // Default to UI if no categories found
  if (categories.length === 0) {
    categories.push('UI');
  }

  return categories;
}

// Extract video ID from YouTube URL
function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Get thumbnail URL from video ID
function getThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

// Helper to get channel ID from @username (requires fetching the channel page)
async function getChannelIdFromUsername(username: string): Promise<string | null> {
  try {
    // Try to fetch channel page and extract channel ID
    const response = await fetch(`https://www.youtube.com/@${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    const html = await response.text();
    const channelIdMatch = html.match(/"channelId":"([^"]+)"/);
    return channelIdMatch ? channelIdMatch[1] : null;
  } catch (error) {
    console.error(`Error fetching channel ID for @${username}:`, error);
    return null;
  }
}

export async function fetchYouTubeVideos(): Promise<VideoItem[]> {
  if (youtubeChannels.length === 0) {
    console.warn('No YouTube channels configured. Add channels to lib/api/youtube-channels.ts');
    return [];
  }

  try {
    const allVideos: VideoItem[] = [];

    // Fetch videos from all channels in parallel
    const fetchPromises = youtubeChannels.map(async (channel) => {
      try {
        let rssUrl: string;
        
        // If we have channelId, use it directly
        if (channel.channelId) {
          rssUrl = getChannelRSSUrl(channel);
        } else if (channel.username) {
          // Try to get channel ID from username
          const channelId = await getChannelIdFromUsername(channel.username);
          if (channelId) {
            rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
          } else {
            // Fallback to old username format (may not work for @username channels)
            rssUrl = getChannelRSSUrl(channel);
          }
        } else {
          console.error(`Channel ${channel.name} has no channelId or username`);
          return [];
        }
        
        const feed = await parser.parseURL(rssUrl);

        if (!feed.items) return [];

        const videos: VideoItem[] = [];

        for (const item of feed.items) {
          if (!item.title || !item.link) continue;

          // Extract video ID from link
          const videoId = extractVideoId(item.link);
          if (!videoId) continue;

          // Get channel info from feed or item
          const channelName = feed.title || channel.name;
          const channelId = (item as any)['yt:channelId'] || channel.channelId || '';

          // Get description from content or media
          const description = item.contentSnippet || item.content?.substring(0, 500) || '';
          
          // Get thumbnail - try media:group first, then generate from video ID
          let thumbnailUrl = getThumbnailUrl(videoId);
          if ((item as any).mediaGroup) {
            const mediaGroup = (item as any).mediaGroup;
            if (mediaGroup['media:thumbnail']?.[0]?.['$']?.url) {
              thumbnailUrl = mediaGroup['media:thumbnail'][0]['$'].url;
            }
          }

          // Use pre-assigned categories or categorize based on title/description
          const categories = channel.category || categorizeVideo(item.title, description);

          const video: VideoItem = {
            id: videoId,
            title: item.title,
            description: description,
            url: item.link,
            thumbnailUrl: thumbnailUrl,
            channelName: channelName,
            channelId: channelId,
            category: categories,
            publishDate: item.pubDate ? new Date(item.pubDate) : new Date(),
          };

          videos.push(video);
        }

        return videos;
      } catch (error) {
        console.error(`Error fetching videos from channel "${channel.name}":`, error);
        return [];
      }
    });

    const results = await Promise.allSettled(fetchPromises);

    // Combine all successful results
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allVideos.push(...result.value);
      }
    });

    // Remove duplicates based on video ID
    const uniqueVideos = Array.from(
      new Map(allVideos.map(v => [v.id, v])).values()
    );

    // Sort by publish date (newest first)
    uniqueVideos.sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());

    return uniqueVideos;
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return [];
  }
}


