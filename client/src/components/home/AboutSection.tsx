import { motion } from "framer-motion";

const AboutSection = () => {
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
        >
          <motion.h2 
            className="font-heading text-3xl md:text-4xl font-bold mb-12 text-center"
            variants={itemVariants}
          >
            About <span className="gradient-text">Me</span>
          </motion.h2>
          
          <motion.div 
            className="bg-card rounded-2xl p-6 md:p-8 shadow-lg mb-12"
            variants={itemVariants}
          >
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <div className="flex items-center gap-4 mb-6">
                  <i className="fas fa-code text-primary text-3xl"></i>
                  <h3 className="font-heading text-xl font-medium">Developer</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Dedicated backend developer with a focus on building robust, scalable systems that solve real-world problems.
                </p>
              </div>
              
              <div className="md:w-1/3">
                <div className="flex items-center gap-4 mb-6">
                  <i className="fas fa-robot text-secondary text-3xl"></i>
                  <h3 className="font-heading text-xl font-medium">AI Enthusiast</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Passionately exploring the integration of artificial intelligence to create smarter, more intuitive software solutions.
                </p>
              </div>
              
              <div className="md:w-1/3">
                <div className="flex items-center gap-4 mb-6">
                  <i className="fas fa-handshake text-accent text-3xl"></i>
                  <h3 className="font-heading text-xl font-medium">Team Player</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Honest, calm, and supportive collaborator with an adaptive mindset and commitment to team success.
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 shadow-lg relative overflow-hidden"
            variants={itemVariants}
          >
            <div className="absolute -top-6 -left-6 text-7xl text-primary/20">
              <i className="fas fa-quote-left"></i>
            </div>
            
            <blockquote className="text-2xl md:text-3xl font-heading font-medium text-center py-6 px-4 relative z-10">
              I don't just build software — <span className="gradient-text">I build trust</span>.
            </blockquote>
            
            <div className="absolute -bottom-6 -right-6 text-7xl text-secondary/20">
              <i className="fas fa-quote-right"></i>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
