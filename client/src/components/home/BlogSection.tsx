import { motion } from "framer-motion";
import BlogCard from "@/components/shared/BlogCard";

const blogPosts = [
  {
    title: "Integrating GPT-4 with Java Spring Applications",
    description: "Exploring best practices for incorporating large language models into enterprise Java applications.",
    date: "May 15, 2023",
    url: "#"
  },
  {
    title: "Building Smart Backends: Beyond CRUD Operations",
    description: "How intelligence and automation can transform traditional backend services into smart, adaptive systems.",
    date: "March 28, 2023",
    url: "#"
  }
];

const BlogSection = () => {
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
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-center">
            Tech <span className="gradient-text">Insights</span>
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Occasional thoughts on technology, AI, and software development.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {blogPosts.map((post, index) => (
            <motion.div key={index} variants={itemVariants}>
              <BlogCard post={post} />
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <a 
            href="#" 
            className="inline-flex items-center py-2 px-4 border border-secondary text-secondary hover:bg-secondary/10 rounded-lg transition-all font-medium"
          >
            All Articles <i className="fas fa-external-link-alt ml-2 text-sm"></i>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;
