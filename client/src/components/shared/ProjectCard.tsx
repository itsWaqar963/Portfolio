import { motion } from "framer-motion";

interface ProjectProps {
  project: {
    title: string;
    description: string;
    icon: string;
    stars: number;
    githubUrl: string;
    tags: string[];
  };
}

const ProjectCard = ({ project }: ProjectProps) => {
  const { title, description, icon, stars, githubUrl, tags } = project;

  return (
    <motion.div 
      className="bg-card rounded-xl overflow-hidden hover:glow-purple transition-all duration-300 h-full flex flex-col"
      whileHover={{ y: -5 }}
    >
      <div className="h-48 bg-gradient-to-r from-primary/20 to-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.i 
            className={`${icon} text-6xl text-primary/30`}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium">
          <i className="fas fa-star text-yellow-400 mr-1"></i> {stars} stars
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-bold text-xl">{title}</h3>
          <a 
            href={githubUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-secondary hover:text-primary transition-colors"
          >
            <i className="fab fa-github text-xl"></i>
          </a>
        </div>
        
        <p className="text-muted-foreground mb-4">{description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4 mt-auto">
          {tags.map((tag, index) => (
            <span 
              key={index} 
              className={`${
                index % 3 === 0 
                  ? "bg-primary/20 text-primary" 
                  : index % 3 === 1 
                    ? "bg-secondary/20 text-secondary" 
                    : "bg-accent/20 text-accent"
              } px-2 py-1 rounded text-xs`}
            >
              {tag}
            </span>
          ))}
        </div>
        
        <a 
          href="#" 
          className="text-primary hover:text-secondary transition-colors text-sm font-medium flex items-center"
        >
          View project <i className="fas fa-arrow-right ml-1"></i>
        </a>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
