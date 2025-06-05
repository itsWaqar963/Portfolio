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
    const response = await fetch('https://medium.com/feed/@waqar.ah963', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Portfolio-RSS-Reader/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml'
      }
    });

    if (!response.ok) {
      throw new Error(`RSS fetch failed: ${response.status}`);
    }

    const xmlText = await response.text();
    
    // Simple XML parsing using string operations for Vercel compatibility
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    
    while ((match = itemRegex.exec(xmlText)) !== null && items.length < 6) {
      const itemXml = match[1];
      
      const getContent = (tag) => {
        const cdataRegex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[(.*?)\\]\\]><\\/${tag}>`, 's');
        const normalRegex = new RegExp(`<${tag}[^>]*>(.*?)<\\/${tag}>`, 's');
        
        const cdataMatch = itemXml.match(cdataRegex);
        if (cdataMatch) return cdataMatch[1];
        
        const normalMatch = itemXml.match(normalRegex);
        return normalMatch ? normalMatch[1] : '';
      };

      const title = getContent('title');
      const link = getContent('link');
      const description = getContent('description');
      const pubDate = getContent('pubDate');
      
      // Extract categories
      const categoryRegex = /<category[^>]*>([^<]*)<\/category>/g;
      const categories = [];
      let categoryMatch;
      while ((categoryMatch = categoryRegex.exec(itemXml)) !== null) {
        categories.push(categoryMatch[1].trim());
      }

      // Clean description
      const cleanDescription = description
        .replace(/<[^>]*>/g, '')
        .replace(/&[^;]+;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 200) + '...';

      // Extract thumbnail
      const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
      const thumbnail = imgMatch ? imgMatch[1] : undefined;

      items.push({
        title,
        link,
        description: cleanDescription,
        pubDate,
        categories,
        thumbnail
      });
    }

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    return res.status(200).json({ 
      success: true, 
      articles: items,
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