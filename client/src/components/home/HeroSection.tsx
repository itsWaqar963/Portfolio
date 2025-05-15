import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";

const HeroSection = () => {
  const scrollToProjects = () => {
    // Track navigation event
    trackEvent('navigation', 'projects_button', 'Clicked Projects Button');
    
    const projectsSection = document.getElementById("projects");
    if (projectsSection) {
      window.scrollTo({
        top: projectsSection.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  const scrollToContact = () => {
    // Track navigation event
    trackEvent('navigation', 'contact_button', 'Clicked Contact Button');
    
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      window.scrollTo({
        top: contactSection.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  const scrollToAbout = () => {
    // Track navigation event
    trackEvent('navigation', 'about_button', 'Clicked About Button');
    
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      window.scrollTo({
        top: aboutSection.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center pt-10 relative">
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div 
            className="lg:w-7/12 mb-10 lg:mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8 relative">
              <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                Hi, I'm <span className="gradient-text">Waqar</span> — a smart backend dev with a vision.
              </h1>
              <div className="relative overflow-hidden md:w-full">
                <h2 className="md:text-xl lg:text-2xl text-muted-foreground font-medium mt-4 typing-effect">
                  Building intelligent systems using Java, Spring Boot & AI with Odoo.
                </h2>
              </div>
            </div>
            
            <motion.div 
              className="flex flex-wrap gap-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <button 
                onClick={scrollToProjects}
                className="py-3 px-6 bg-primary hover:bg-primary/90 rounded-lg shadow-lg shadow-primary/20 transition-all font-medium"
              >
                View Projects
              </button>
              <button 
                onClick={scrollToContact}
                className="py-3 px-6 bg-transparent border border-secondary text-secondary hover:bg-secondary/10 rounded-lg transition-all font-medium"
              >
                Connect with Me
              </button>
            </motion.div>
            
            <motion.div 
              className="flex space-x-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <a 
                href="https://github.com/itsWaqar963" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-secondary transition-colors"
                onClick={() => trackEvent('social', 'github', 'GitHub Profile Link')}
              >
                <i className="fab fa-github text-2xl"></i>
              </a>
              <a 
                href="https://www.linkedin.com/in/waqar963" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-secondary transition-colors"
                onClick={() => trackEvent('social', 'linkedin', 'LinkedIn Profile Link')}
              >
                <i className="fab fa-linkedin text-2xl"></i>
              </a>
              <a 
                href="mailto:waqar.ah963@gmail.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-secondary transition-colors"
                onClick={() => trackEvent('social', 'email', 'Email Contact Link')}
              >
                <i className="fas fa-envelope text-2xl"></i>
              </a>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="lg:w-5/12 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary/30 glow-purple">
              <svg 
                className="absolute inset-0 w-full h-full" 
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="48" fill="url(#circleGradient)" />
              </svg>
              
              <div className="relative w-full h-full">
                {/* Loading placeholder/skeleton */}
                <div className="absolute inset-0 rounded-full bg-card animate-pulse"></div>
                <img 
                  src="/assets/profile.jpg" 
                  alt="Waqar Ahmed portrait" 
                  className="w-full h-full object-cover rounded-full relative z-10" 
                  loading="lazy"
                  onLoad={(e) => {
                    // Add a fade-in effect when image loads
                    const img = e.target as HTMLImageElement;
                    img.style.animation = "fadeIn 0.5s forwards";
                    img.style.opacity = "1";
                  }}
                  style={{
                    opacity: 0,
                  }}
                />
              </div>
              
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-primary/0 via-background/0 to-background/70"></div>
              
              {/* Tech particle animation indicators */}
              <motion.div 
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-secondary glow-blue"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div 
                className="absolute bottom-4 -left-4 w-4 h-4 rounded-full bg-primary glow-purple"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <button 
            onClick={scrollToAbout}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <i className="fas fa-chevron-down text-xl"></i>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
