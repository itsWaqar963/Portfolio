import { motion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";

interface BlogCardProps {
  post: {
    title: string;
    description: string;
    date: string;
    url: string;
    thumbnail?: string;
  };
}

const BlogCard = ({ post }: BlogCardProps) => {
  const { title, description, date, url, thumbnail } = post;
  
  const handleArticleClick = () => {
    trackEvent('article_click', 'medium', title);
  };
  
  return (
    <motion.div 
      className="bg-card rounded-xl overflow-hidden hover:glow-purple transition-all duration-300 h-full flex flex-col"
      whileHover={{ y: -5 }}
    >
      {/* Article Thumbnail */}
      {thumbnail && (
        <div className="relative h-48 w-full overflow-hidden">
          <img 
            src={thumbnail} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      )}
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="text-muted-foreground text-sm mb-2">{date}</div>
        <h3 className="font-heading font-bold text-xl mb-3 line-clamp-2">{title}</h3>
        <p className="text-muted-foreground mb-4 flex-1 line-clamp-3">{description}</p>
        <a 
          href={url} 
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-secondary transition-colors text-sm font-medium flex items-center mt-auto"
          onClick={handleArticleClick}
        >
          Read article <i className="fas fa-arrow-right ml-1"></i>
        </a>
      </div>
    </motion.div>
  );
};

export default BlogCard;
