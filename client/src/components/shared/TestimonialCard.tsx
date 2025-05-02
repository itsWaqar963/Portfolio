import { motion } from "framer-motion";

interface TestimonialCardProps {
  testimonial: {
    quote: string;
    name: string;
    title: string;
    image: string;
  };
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  const { quote, name, title, image } = testimonial;
  
  return (
    <motion.div 
      className="bg-card rounded-xl p-6 hover:glow-purple transition-all duration-300 relative h-full"
      whileHover={{ y: -5 }}
    >
      <div className="text-primary/20 text-5xl absolute top-4 right-4">
        <i className="fas fa-quote-right"></i>
      </div>
      
      <p className="text-muted-foreground mb-4 relative z-10">{quote}</p>
      
      <div className="flex items-center mt-6">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
          <img 
            src={image} 
            alt={`${name} portrait`} 
            className="w-full h-full object-cover" 
          />
        </div>
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-muted-foreground text-sm">{title}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
