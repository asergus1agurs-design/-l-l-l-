// Twitch API real-time data fetcher
const TWITCH_CLIENT_ID = 'YOUR_CLIENT_ID'; // Register at dev.twitch.tv
const CHANNEL_NAME = 'iborovi';

async function fetchTwitchData() {
  try {
    // 1. Get channel status
    const statusRes = await fetch(`https://api.twitch.tv/helix/streams?user_login=${CHANNEL_NAME}`, {
      headers: {
        'Client-ID': TWITCH_CLIENT_ID,
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
      }
    });
    
    // 2. Get channel info (followers, views)
    const channelRes = await fetch(`https://api.twitch.tv/helix/users?login=${CHANNEL_NAME}`, {
      headers: {
        'Client-ID': TWITCH_CLIENT_ID,
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
      }
    });
    
    const [statusData, channelData] = await Promise.all([
      statusRes.json(),
      channelRes.json()
    ]);
    
    return {
      isLive: statusData.data?.length > 0,
      viewers: statusData.data?.[0]?.viewer_count || 0,
      followers: channelData.data?.[0]?.followers || 0,
      totalViews: channelData.data?.[0]?.view_count || 0
    };
  } catch (err) {
    console.error('Twitch API error:', err);
    return null;
  }
}

function updateUI(data) {
  // Update status pill
  const statusPill = document.querySelector('.status-pill');
  if (statusPill) {
    statusPill.textContent = data.isLive ? 
      `LIVE: ${data.viewers} viewers` : 
      'в эфире: iborovi is offline';
    statusPill.className = data.isLive ? 'status-pill online' : 'status-pill offline';
  }
  
  // Update stats
  document.querySelector('.stat-value:nth-child(1)').textContent = data.viewers;
  document.querySelector('.stat-value:nth-child(2)').textContent = data.followers;
  document.querySelector('.stat-value:nth-child(3)').textContent = data.totalViews;
  
  // Update stream card
  const streamCard = document.querySelector('.stream-card');
  if (streamCard) {
    streamCard.className = data.isLive ? 'stream-card online' : 'stream-card offline';
  }
}

// Check every 30 seconds
async function checkTwitch() {
  const data = await fetchTwitchData();
  if (data) updateUI(data);
}

// Initial check
checkTwitch();
setInterval(checkTwitch, 30000);
