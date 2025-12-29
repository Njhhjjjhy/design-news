// Helper script to get YouTube Channel IDs from @username URLs
// Run with: node scripts/get-youtube-channel-ids.js

const channels = [
  'ZeroToMastery',
  'UXDX',
  'rileybrownai',
  'UICollectiveDesign',
  'SelfMadeWebDesigner',
  'Figma',
  'designertom',
  'MalewiczHype',
  'itsnicethat',
  'wearelyssna',
  'moonlearning',
];

async function getChannelId(username) {
  try {
    const response = await fetch(`https://www.youtube.com/@${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    const html = await response.text();
    const channelIdMatch = html.match(/"channelId":"([^"]+)"/);
    return channelIdMatch ? channelIdMatch[1] : null;
  } catch (error) {
    console.error(`Error fetching channel ID for @${username}:`, error.message);
    return null;
  }
}

async function getAllChannelIds() {
  console.log('Fetching channel IDs...\n');
  
  for (const username of channels) {
    const channelId = await getChannelId(username);
    if (channelId) {
      console.log(`  { name: '${username}', channelId: '${channelId}' },`);
    } else {
      console.log(`  { name: '${username}', channelId: 'NOT_FOUND' },`);
    }
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

getAllChannelIds();

