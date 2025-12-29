import type { Category } from '@/lib/types';

// YouTube Channel Configuration
// Add channels by their Channel ID or Username
// To find a channel ID: Go to the channel page, view page source, search for "channelId"
// Or use: https://www.youtube.com/channel/CHANNEL_ID (the ID is in the URL)

export interface YouTubeChannel {
  name: string;
  channelId?: string; // Use this for modern channels
  username?: string; // Use this for older channels with usernames
  category?: Category[]; // Optional: pre-assign categories
}

// Add your YouTube channels here
export const youtubeChannels: YouTubeChannel[] = [
  {
    name: 'Zero To Mastery',
    channelId: 'UCJ6vMDXdKNS3cmokLze7VQg', // @ZeroToMastery
  },
  {
    name: 'UXDX',
    username: 'UXDX', // Will auto-fetch channel ID
  },
  {
    name: 'Riley Brown AI',
    username: 'rileybrownai', // Will auto-fetch channel ID
  },
  {
    name: 'UI Collective Design',
    username: 'UICollectiveDesign', // Will auto-fetch channel ID
  },
  {
    name: 'Self Made Web Designer',
    username: 'SelfMadeWebDesigner', // Will auto-fetch channel ID
  },
  {
    name: 'Figma',
    channelId: 'UCQsVmhSa4X-G3lHlUEmjvfQ', // @Figma
  },
  {
    name: 'Designer Tom',
    username: 'designertom', // Will auto-fetch channel ID
  },
  {
    name: 'Malewicz Hype',
    username: 'MalewiczHype', // Will auto-fetch channel ID
  },
  {
    name: 'It\'s Nice That',
    username: 'itsnicethat', // Will auto-fetch channel ID
  },
  {
    name: 'Lyssna',
    username: 'wearelyssna', // Will auto-fetch channel ID
  },
  {
    name: 'Moon Learning',
    username: 'moonlearning', // Will auto-fetch channel ID
  },
];

// Helper to get RSS URL for a channel
// Note: Modern @username channels need channelId, but we can try username first
export function getChannelRSSUrl(channel: YouTubeChannel): string {
  if (channel.channelId) {
    return `https://www.youtube.com/feeds/videos.xml?channel_id=${channel.channelId}`;
  }
  if (channel.username) {
    // Try both formats - modern @username and old username format
    // First try the @username format (may need channel ID lookup)
    // Fallback to old username format
    return `https://www.youtube.com/feeds/videos.xml?user=${channel.username}`;
  }
  throw new Error(`Channel ${channel.name} must have either channelId or username`);
}

