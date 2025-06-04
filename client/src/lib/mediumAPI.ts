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

// Function to fetch Medium articles from our backend API
export const fetchMediumArticles = async (): Promise<MediumArticle[]> => {
  try {
    console.log('Fetching Medium articles from backend API...');
    
    const response = await fetch('/api/medium-articles', {
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
    console.log('Backend API response:', data);
    
    if (!data.success) {
      console.error('Backend API error:', data.message);
      throw new Error(data.message || 'Failed to fetch articles');
    }
    
    const articles: MediumArticle[] = data.articles.map((article: any) => ({
      title: article.title,
      link: article.link,
      description: article.description,
      pubDate: article.pubDate,
      categories: article.categories || [],
      thumbnail: article.thumbnail
    }));
    
    console.log(`Successfully fetched ${articles.length} Medium articles`);
    return articles;
  } catch (error) {
    console.error('Error fetching Medium articles:', error);
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