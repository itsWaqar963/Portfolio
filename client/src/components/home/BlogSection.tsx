import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import BlogCard from "@/components/shared/BlogCard";
import { fetchMediumArticles, MediumArticle } from "@/lib/mediumAPI";
import { trackEvent } from "@/lib/analytics";

const BlogSection = () => {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { data: articles, isLoading, error, refetch } = useQuery({
    queryKey: ['medium-articles'],
    queryFn: fetchMediumArticles,
    staleTime: 1000 * 60 * 5, // 5 minutes (reduced from 30)
    gcTime: 1000 * 60 * 10, // 10 minutes cache (renamed from cacheTime in v5)
    retry: 3,
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnMount: true
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    trackEvent('blog', 'refresh_articles', 'Manual Refresh Medium Articles');
    
    // Clear cache and refetch
    await queryClient.invalidateQueries({ queryKey: ['medium-articles'] });
    await refetch();
    
    setTimeout(() => setIsRefreshing(false), 1000);
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 } 
    }
  };

  return (
    <section id="blog" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center mb-4">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-center">
              Tech <span className="gradient-text">Insights</span>
            </h2>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading}
              className="ml-4 p-2 rounded-lg bg-card text-foreground hover:bg-primary/10 border border-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh latest articles"
            >
              <i className={`fas fa-sync-alt text-sm ${isRefreshing ? 'animate-spin' : ''}`}></i>
            </button>
          </div>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Occasional thoughts on technology, AI, and software development.
            {articles && articles.length > 0 && (
              <span className="block text-xs mt-2 opacity-70">
                Last updated: {new Date().toLocaleTimeString()}
              </span>
            )}
          </p>
        </motion.div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-muted-foreground">
            <p>Unable to load articles at this time.</p>
            <a 
              href="https://medium.com/@waqar.ah963" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center mt-4 py-2 px-4 border border-secondary text-secondary hover:bg-secondary/10 rounded-lg transition-all font-medium"
              onClick={() => trackEvent('social', 'medium_fallback', 'Medium Profile from Articles Error')}
            >
              Visit My Medium Profile <i className="fas fa-external-link-alt ml-2 text-sm"></i>
            </a>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {articles?.map((article, index) => (
              <motion.div key={article.link} variants={itemVariants}>
                <BlogCard post={{
                  title: article.title,
                  description: article.description,
                  date: new Date(article.pubDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }),
                  url: article.link
                }} />
              </motion.div>
            ))}
          </motion.div>
        )}
        
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <a 
            href="https://medium.com/@waqar.ah963" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center py-2 px-4 border border-secondary text-secondary hover:bg-secondary/10 rounded-lg transition-all font-medium"
            onClick={() => trackEvent('social', 'medium_all_articles', 'View All Articles on Medium')}
          >
            Read More on Medium <i className="fas fa-external-link-alt ml-2 text-sm"></i>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;
