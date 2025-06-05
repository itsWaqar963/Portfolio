export default async function handler(req, res) {
  // Set CORS headers
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
    console.log("Fetching Medium RSS feed...");
    
    const response = await fetch("https://medium.com/feed/@waqar.ah963", {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Portfolio-RSS-Reader/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml'
      }
    });

    if (!response.ok) {
      throw new Error(`RSS fetch failed: ${response.status} ${response.statusText}`);
    }

    const xmlText = await response.text();
    console.log("RSS XML fetched successfully, parsing...");

    // Simple regex-based XML parsing for Vercel compatibility
    const itemMatches = xmlText.match(/<item>(.*?)<\/item>/gs) || [];
    console.log(`Found ${itemMatches.length} articles in RSS feed`);

    const articles = itemMatches.slice(0, 6).map(itemXml => {
      const getTagContent = (tag) => {
        const match = itemXml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[(.*?)\\]\\]><\\/${tag}>`, 's')) ||
                     itemXml.match(new RegExp(`<${tag}[^>]*>(.*?)<\\/${tag}>`, 's'));
        return match ? match[1].trim() : '';
      };

      const title = getTagContent('title');
      const link = getTagContent('link');
      const description = getTagContent('description');
      const pubDate = getTagContent('pubDate');
      
      // Extract categories
      const categoryMatches = itemXml.match(/<category[^>]*><!\\[CDATA\\[(.*?)\\]\\]><\\/category>/g) || 
                             itemXml.match(/<category[^>]*>(.*?)<\\/category>/g) || [];
      const categories = categoryMatches.map(cat => {
        const match = cat.match(/>(.*?)</);
        return match ? match[1].replace(/<!\\[CDATA\\[|\\]\\]>/g, '').trim() : '';
      }).filter(Boolean);

      // Clean description by removing HTML and truncating
      const cleanDescription = description
        .replace(/<[^>]*>/g, '')
        .replace(/&[^;]+;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 200) + '...';

      // Extract thumbnail from content
      const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
      const thumbnail = imgMatch ? imgMatch[1] : undefined;

      return {
        title,
        link,
        description: cleanDescription,
        pubDate,
        categories,
        thumbnail
      };
    });

    console.log(`Successfully parsed ${articles.length} articles`);
    
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    return res.status(200).json({ 
      success: true, 
      articles,
      lastFetched: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error fetching Medium articles:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch Medium articles",
      error: error.message || 'Unknown error'
    });
  }
}