import { motion } from "framer-motion";

interface BlogCardProps {
  post: {
    title: string;
    description: string;
    date: string;
    url: string;
  };
}

const BlogCard = ({ post }: BlogCardProps) => {
  const { title, description, date, url } = post;
  
  return (
    <motion.div 
      className="bg-card rounded-xl overflow-hidden hover:glow-purple transition-all duration-300 h-full"
      whileHover={{ y: -5 }}
    >
      <div className="p-6">
        <div className="text-muted-foreground text-sm mb-2">{date}</div>
        <h3 className="font-heading font-bold text-xl mb-3">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        <a 
          href={url} 
          className="text-primary hover:text-secondary transition-colors text-sm font-medium flex items-center"
        >
          Read article <i className="fas fa-arrow-right ml-1"></i>
        </a>
      </div>
    </motion.div>
  );
};

export default BlogCard;
