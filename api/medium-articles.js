import { DOMParser } from '@xmldom/xmldom';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request for CORS
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

    // Parse XML using DOMParser
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    // Check for parsing errors
    const parseError = xmlDoc.getElementsByTagName('parsererror')[0];
    if (parseError) {
      throw new Error('XML parsing failed');
    }

    const items = xmlDoc.getElementsByTagName('item');
    console.log(`Found ${items.length} articles in RSS feed`);

    const articles = Array.from(items).slice(0, 6).map(item => {
      const getTextContent = (tagName) => {
        const element = item.getElementsByTagName(tagName)[0];
        return element?.textContent || element?.firstChild?.nodeValue || '';
      };

      const title = getTextContent('title').replace(/^\s*\[CDATA\[|\]\]\s*$/g, '').trim();
      const link = getTextContent('link');
      const description = getTextContent('description');
      const content = getTextContent('content:encoded') || description;
      const pubDate = getTextContent('pubDate');
      
      // Extract categories
      const categoryElements = item.getElementsByTagName('category');
      const categories = Array.from(categoryElements).map(cat => 
        (cat.textContent || cat.firstChild?.nodeValue || '').replace(/^\s*\[CDATA\[|\]\]\s*$/g, '').trim()
      ).filter(Boolean);

      // Clean description by removing HTML and truncating
      const cleanDescription = content
        .replace(/<[^>]*>/g, '')
        .replace(/&[^;]+;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 200) + '...';

      // Extract thumbnail from content
      const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
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
    
    // Set cache headers
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