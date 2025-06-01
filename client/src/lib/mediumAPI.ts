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
    // Use a CORS proxy to fetch the RSS feed
    const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(MEDIUM_RSS_URL)}`;
    
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch Medium articles');
    }
    
    const data = await response.json();
    
    if (data.status !== 'ok') {
      throw new Error('Invalid RSS feed response');
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
    
    return articles.slice(0, 6); // Return only the latest 6 articles
  } catch (error) {
    console.error('Error fetching Medium articles:', error);
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