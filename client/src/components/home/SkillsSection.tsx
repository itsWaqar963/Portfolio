import { motion } from "framer-motion";
import SkillRing from "@/components/shared/SkillRing";

const skills = [
  {
    name: "Java",
    percentage: 90,
    icon: "fab fa-java",
    description: "Enterprise & Application Development"
  },
  {
    name: "Spring Boot",
    percentage: 85,
    icon: "fas fa-leaf",
    description: "APIs & Microservices"
  },
  {
    name: "AI Integration",
    percentage: 80,
    icon: "fas fa-brain",
    description: "LLMs & ML Systems"
  },
  {
    name: "Odoo",
    percentage: 75,
    icon: "fas fa-database",
    description: "ERP Development"
  },
  {
    name: "Backend APIs",
    percentage: 70,
    icon: "fas fa-server",
    description: "REST & GraphQL"
  }
];

const SkillsSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
    <section id="skills" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="font-heading text-3xl md:text-4xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          My <span className="gradient-text">Skills</span>
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {skills.map((skill, index) => (
            <motion.div 
              key={index}
              className="bg-card rounded-xl p-6 text-center hover:glow-purple transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <SkillRing 
                percentage={skill.percentage} 
                icon={skill.icon} 
              />
              <h3 className="font-heading font-bold text-xl mb-2">{skill.name}</h3>
              <p className="text-muted-foreground text-sm">{skill.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
