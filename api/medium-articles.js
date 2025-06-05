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
    const response = await fetch('https://medium.com/feed/@waqar.ah963');

    if (!response.ok) {
      throw new Error(`RSS fetch failed: ${response.status}`);
    }

    const xmlText = await response.text();
    const items = [];
    
    // Extract items using basic string splitting
    const itemStart = '<item>';
    const itemEnd = '</item>';
    let startIndex = 0;
    
    while (items.length < 6) {
      startIndex = xmlText.indexOf(itemStart, startIndex);
      if (startIndex === -1) break;
      
      const endIndex = xmlText.indexOf(itemEnd, startIndex);
      if (endIndex === -1) break;
      
      const itemXml = xmlText.substring(startIndex + itemStart.length, endIndex);
      
      // Extract title
      const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
      const title = titleMatch ? titleMatch[1].trim() : '';
      
      // Extract link
      const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
      const link = linkMatch ? linkMatch[1].trim() : '';
      
      // Extract publication date
      const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/);
      const pubDate = pubDateMatch ? pubDateMatch[1].trim() : '';
      
      // Extract categories
      const categoryMatches = itemXml.match(/<category><!\[CDATA\[(.*?)\]\]><\/category>/g) || [];
      const categories = categoryMatches.map(cat => {
        const match = cat.match(/<category><!\[CDATA\[(.*?)\]\]><\/category>/);
        return match ? match[1] : '';
      });
      
      // Extract content for description and thumbnail
      const contentMatch = itemXml.match(/<content:encoded><!\[CDATA\[(.*?)\]\]><\/content:encoded>/s);
      const content = contentMatch ? contentMatch[1] : '';
      
      // Clean description
      const cleanDescription = content
        .replace(/<[^>]*>/g, '')
        .replace(/&[^;]+;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 200) + '...';
      
      // Extract thumbnail
      const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
      const thumbnail = imgMatch ? imgMatch[1] : undefined;

      if (title && link) {
        items.push({
          title,
          link,
          description: cleanDescription,
          pubDate,
          categories,
          thumbnail
        });
      }
      
      startIndex = endIndex + itemEnd.length;
    }

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