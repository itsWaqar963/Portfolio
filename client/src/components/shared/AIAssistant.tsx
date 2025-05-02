import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAIResponse } from "@/lib/aiResponses";

type Message = {
  content: string;
  isUser: boolean;
};

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { content: "Hi there! I'm Waqar's AI assistant. How can I help you learn more about his work?", isUser: false }
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = { content: inputValue, isUser: true };
    setMessages([...messages, userMessage]);
    setInputValue("");

    // Simulate AI response with typing delay
    setTimeout(() => {
      const aiResponse = { content: getAIResponse(inputValue), isUser: false };
      setMessages(prev => [...prev, aiResponse]);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="bg-card rounded-2xl p-6 shadow-glow-purple max-w-sm mb-4"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-heading font-bold text-lg flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
                AI Assistant
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleChat} 
                className="h-8 w-8 p-0 rounded-full"
              >
                <i className="fas fa-times"></i>
              </Button>
            </div>
            
            <div className="h-60 overflow-y-auto mb-4 space-y-4 pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
              {messages.map((message, index) => (
                <div key={index} className="flex items-start">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 flex-shrink-0 ${
                    message.isUser ? 'bg-secondary/20' : 'bg-primary/20'
                  }`}>
                    <i className={`${message.isUser ? 'fas fa-user text-secondary' : 'fas fa-robot text-primary'} text-xs`}></i>
                  </div>
                  <div className={`${message.isUser ? 'bg-secondary/10' : 'bg-background'} rounded-lg p-3 max-w-[80%]`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="flex items-center">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                className="flex-1 bg-background border-muted-foreground/20 rounded-lg px-4 py-2 mr-2 focus:border-primary focus:outline-none transition-colors"
              />
              <Button
                onClick={handleSend}
                className="p-2 rounded-lg bg-primary hover:bg-primary/90 text-white transition-colors"
              >
                <i className="fas fa-paper-plane"></i>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-primary shadow-glow-purple flex items-center justify-center hover:bg-primary/90 transition-all"
        onClick={toggleChat}
      >
        <i className="fas fa-robot text-white text-xl"></i>
      </motion.button>
    </div>
  );
};

export default AIAssistant;
