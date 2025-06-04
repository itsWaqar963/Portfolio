// Medium RSS Feed API utilities
export interface MediumArticle {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  categories: string[];
  thumbnail?: string;
}

const MEDIUM_RSS_URL = 'https://medium.com/feed/@waqar.ah963';

// Function to parse Medium RSS feed
export const fetchMediumArticles = async (): Promise<MediumArticle[]> => {
  try {
    // Add cache-busting parameter to ensure fresh data
    const timestamp = Date.now();
    const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(MEDIUM_RSS_URL)}&api_key=&count=10&_=${timestamp}`;
    
    console.log('Fetching Medium articles from:', proxyUrl);
    
    const response = await fetch(proxyUrl, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    if (!response.ok) {
      console.error('Failed to fetch Medium articles:', response.status, response.statusText);
      throw new Error(`Failed to fetch Medium articles: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Medium RSS response:', data);
    
    if (data.status !== 'ok') {
      console.error('Invalid RSS feed response:', data);
      throw new Error(`Invalid RSS feed response: ${data.message || 'Unknown error'}`);
    }
    
    // Transform the RSS data to our interface
    const articles: MediumArticle[] = data.items.map((item: any) => {
      // Clean up the description by removing HTML tags and truncating
      const cleanDescription = item.description 
        ? item.description.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, '').substring(0, 150).trim() + '...'
        : item.content?.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, '').substring(0, 150).trim() + '...' || 'Read more...';
      
      return {
        title: item.title,
        link: item.link,
        description: cleanDescription,
        pubDate: item.pubDate,
        categories: item.categories || [],
        thumbnail: item.thumbnail || extractImageFromContent(item.content || item.description)
      };
    });
    
    console.log(`Successfully fetched ${articles.length} Medium articles`);
    return articles.slice(0, 6); // Return only the latest 6 articles
  } catch (error) {
    console.error('Error fetching Medium articles:', error);
    
    // Try alternative RSS proxy as fallback
    try {
      console.log('Trying alternative RSS proxy...');
      const fallbackUrl = `https://cors-anywhere.herokuapp.com/${MEDIUM_RSS_URL}`;
      const fallbackResponse = await fetch(fallbackUrl);
      
      if (fallbackResponse.ok) {
        const xmlText = await fallbackResponse.text();
        console.log('Fallback RSS XML fetched successfully');
        return parseRSSXML(xmlText);
      }
    } catch (fallbackError) {
      console.error('Fallback RSS fetch also failed:', fallbackError);
    }
    
    return [];
  }
};

// Alternative XML parser for direct RSS parsing
const parseRSSXML = (xmlText: string): MediumArticle[] => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const items = xmlDoc.querySelectorAll('item');
    
    const articles: MediumArticle[] = Array.from(items).map(item => {
      const title = item.querySelector('title')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      const description = item.querySelector('description')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      const categories = Array.from(item.querySelectorAll('category')).map(cat => cat.textContent || '');
      
      // Clean description
      const cleanDescription = description
        .replace(/<[^>]*>/g, '')
        .replace(/&[^;]+;/g, '')
        .substring(0, 150)
        .trim() + '...';
      
      return {
        title: title.replace(/^\s*\[CDATA\[|\]\]\s*$/g, '').trim(),
        link,
        description: cleanDescription,
        pubDate,
        categories
      };
    });
    
    console.log(`Parsed ${articles.length} articles from XML`);
    return articles.slice(0, 6);
  } catch (error) {
    console.error('Error parsing RSS XML:', error);
    return [];
  }
};

// Helper function to extract image from HTML content
const extractImageFromContent = (content: string): string | undefined => {
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch ? imgMatch[1] : undefined;
};

// Format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};