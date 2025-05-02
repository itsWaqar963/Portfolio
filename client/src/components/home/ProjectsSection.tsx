import { motion } from "framer-motion";
import ProjectCard from "@/components/shared/ProjectCard";

const projects = [
  {
    title: "Intelligent Search GPT-4 Mini",
    description: "A semantic search engine powered by GPT-4 that understands context and intent behind user queries.",
    icon: "fas fa-brain",
    stars: 32,
    githubUrl: "https://github.com",
    tags: ["Java", "GPT-4", "Spring Boot"]
  },
  {
    title: "Intelliflix",
    description: "An AI-powered recommendation engine for streaming platforms that learns user preferences over time.",
    icon: "fas fa-film",
    stars: 24,
    githubUrl: "https://github.com",
    tags: ["Java", "Machine Learning", "REST API"]
  },
  {
    title: "Student Enrollment System",
    description: "A comprehensive management system for educational institutions with Odoo integration.",
    icon: "fas fa-graduation-cap",
    stars: 18,
    githubUrl: "https://github.com",
    tags: ["Odoo", "Python", "PostgreSQL"]
  }
];

const ProjectsSection = () => {
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
    <section id="projects" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-center">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            A selection of my recent work showcasing my expertise in backend development and AI integration.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {projects.map((project, index) => (
            <motion.div key={index} variants={itemVariants}>
              <ProjectCard project={project} />
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
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center py-3 px-6 bg-card hover:bg-card/80 rounded-lg transition-all font-medium"
          >
            <i className="fab fa-github mr-2"></i> View more on GitHub
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
