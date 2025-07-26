export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const rssUrl = encodeURIComponent('https://medium.com/feed/@waqar.ah963');
    const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`);

    if (!response.ok) {
      throw new Error(`RSS fetch failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status !== 'ok') {
      throw new Error('RSS service error');
    }

    const articles = data.items.slice(0, 6).map(item => {
      const cleanDescription = (item.description || item.content || '')
        .replace(/<[^>]*>/g, '')
        .replace(/&[^;]+;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 200) + '...';

      return {
        title: item.title,
        link: item.link,
        description: cleanDescription,
        pubDate: item.pubDate,
        categories: item.categories || []
      };
    });

    return res.status(200).json({ 
      success: true, 
      articles,
      lastFetched: new Date().toISOString()
    });

  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch Medium articles",
      error: error.message || 'Unknown error'
    });
  }
}