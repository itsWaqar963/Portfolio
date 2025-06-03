import { useState } from "react";
import { motion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";

interface Quote {
  text: string;
  author: string;
}

const techQuotes: Quote[] = [
  {
    text: "The best way to predict the future is to invent it.",
    author: "Alan Kay"
  },
  {
    text: "Code is like humor. When you have to explain it, it's bad.",
    author: "Cory House"
  },
  {
    text: "First, solve the problem. Then, write the code.",
    author: "John Johnson"
  },
  {
    text: "Experience is the name everyone gives to their mistakes.",
    author: "Oscar Wilde"
  },
  {
    text: "In order to be irreplaceable, one must always be different.",
    author: "Coco Chanel"
  },
  {
    text: "Java is to JavaScript what car is to Carpet.",
    author: "Chris Heilmann"
  },
  {
    text: "The function of good software is to make the complex appear to be simple.",
    author: "Grady Booch"
  },
  {
    text: "Walk on water? I know most people out there will be saying that instead of walking on water, I should have taken a boat. But the problem is that there was no boat.",
    author: "Linus Torvalds"
  },
  {
    text: "It's not a bug – it's an undocumented feature.",
    author: "Anonymous"
  },
  {
    text: "The most disastrous thing that you can ever learn is your first programming language.",
    author: "Alan Kay"
  },
  {
    text: "Programming today is a race between software engineers striving to build bigger and better idiot-proof programs, and the Universe trying to produce bigger and better idiots.",
    author: "Rick Cook"
  },
  {
    text: "If debugging is the process of removing software bugs, then programming must be the process of putting them in.",
    author: "Edsger Dijkstra"
  },
  {
    text: "Measuring programming progress by lines of code is like measuring aircraft building progress by weight.",
    author: "Bill Gates"
  },
  {
    text: "Before software can be reusable it first has to be usable.",
    author: "Ralph Johnson"
  },
  {
    text: "Simplicity is the ultimate sophistication.",
    author: "Leonardo da Vinci"
  }
];

const TechQuoteGenerator = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote>(
    techQuotes[Math.floor(Math.random() * techQuotes.length)]
  );
  const [isAnimating, setIsAnimating] = useState(false);

  const generateNewQuote = () => {
    setIsAnimating(true);
    
    // Track quote generation
    trackEvent('interaction', 'tech_quote', 'Generated new tech quote');
    
    setTimeout(() => {
      let newQuote;
      do {
        newQuote = techQuotes[Math.floor(Math.random() * techQuotes.length)];
      } while (newQuote.text === currentQuote.text && techQuotes.length > 1);
      
      setCurrentQuote(newQuote);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <motion.div 
      className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 max-w-2xl mx-auto mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <div className="text-center">
        <div className="mb-4">
          <i className="fas fa-quote-left text-primary/60 text-2xl mb-4 block"></i>
        </div>
        
        <motion.div
          key={currentQuote.text}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: isAnimating ? 0 : 1, scale: isAnimating ? 0.9 : 1 }}
          transition={{ duration: 0.3 }}
          className="mb-4"
        >
          <blockquote className="text-lg md:text-xl font-medium text-foreground leading-relaxed mb-3">
            "{currentQuote.text}"
          </blockquote>
          <cite className="text-muted-foreground text-sm font-medium not-italic">
            — {currentQuote.author}
          </cite>
        </motion.div>

        <motion.button
          onClick={generateNewQuote}
          disabled={isAnimating}
          className={`
            py-2 px-4 rounded-lg transition-all duration-300 text-sm font-medium
            ${isAnimating 
              ? 'bg-muted text-muted-foreground cursor-not-allowed' 
              : 'bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 hover:border-primary/50'
            }
          `}
          whileHover={!isAnimating ? { scale: 1.05 } : {}}
          whileTap={!isAnimating ? { scale: 0.95 } : {}}
        >
          {isAnimating ? (
            <>
              <i className="fas fa-circle-notch fa-spin mr-2"></i>
              Loading...
            </>
          ) : (
            <>
              <i className="fas fa-refresh mr-2"></i>
              Show Another
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TechQuoteGenerator;