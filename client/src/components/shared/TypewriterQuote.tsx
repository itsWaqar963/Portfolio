import { useState, useEffect } from "react";
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
    text: "Java is to JavaScript what car is to Carpet.",
    author: "Chris Heilmann"
  },
  {
    text: "The function of good software is to make the complex appear simple.",
    author: "Grady Booch"
  },
  {
    text: "It's not a bug – it's an undocumented feature.",
    author: "Anonymous"
  },
  {
    text: "Programming today is a race between software engineers and the Universe.",
    author: "Rick Cook"
  },
  {
    text: "If debugging removes bugs, then programming must put them in.",
    author: "Edsger Dijkstra"
  },
  {
    text: "Measuring programming progress by lines of code is like measuring aircraft by weight.",
    author: "Bill Gates"
  },
  {
    text: "Before software can be reusable it first has to be usable.",
    author: "Ralph Johnson"
  }
];

const TypewriterQuote = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);

  const currentQuote = techQuotes[currentQuoteIndex];
  const fullText = `"${currentQuote.text}" — ${currentQuote.author}`;

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isTyping && displayedText.length < fullText.length) {
      // Typing effect
      timeoutId = setTimeout(() => {
        setDisplayedText(fullText.slice(0, displayedText.length + 1));
      }, 50 + Math.random() * 50); // Variable typing speed for realism
    } else if (isTyping && displayedText.length === fullText.length) {
      // Finished typing, wait before starting to delete
      timeoutId = setTimeout(() => {
        setIsTyping(false);
        // Track quote completion
        trackEvent('typewriter_quote', 'completed', currentQuote.author);
      }, 3000);
    } else if (!isTyping && displayedText.length > 0) {
      // Deleting effect
      timeoutId = setTimeout(() => {
        setDisplayedText(displayedText.slice(0, -1));
      }, 30);
    } else if (!isTyping && displayedText.length === 0) {
      // Move to next quote
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % techQuotes.length);
      setIsTyping(true);
    }

    return () => clearTimeout(timeoutId);
  }, [displayedText, isTyping, fullText, currentQuote.author]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <motion.div 
      className="hidden lg:flex items-center min-h-[2rem] px-4 py-2 bg-card/30 backdrop-blur-sm border border-primary/20 rounded-lg"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center space-x-2">
        <i className="fas fa-terminal text-primary/70 text-sm"></i>
        <span className="text-xs text-muted-foreground font-mono">~$</span>
      </div>
      
      <div className="ml-3 font-mono text-sm text-foreground min-w-0 flex-1">
        <span className="inline-block">
          {displayedText}
          <span 
            className={`inline-block w-2 h-4 bg-primary ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}
          >
          </span>
        </span>
      </div>
    </motion.div>
  );
};

export default TypewriterQuote;