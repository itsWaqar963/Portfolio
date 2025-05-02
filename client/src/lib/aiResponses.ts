export const aiResponses: Record<string, string> = {
  'skills': "Waqar is proficient in Java, Spring Boot, AI Integration, Odoo, and Backend API development. He specializes in building intelligent systems that leverage AI capabilities.",
  'projects': "Waqar has worked on several notable projects, including Intelligent Search GPT-4 Mini, Intelliflix, and a Student Enrollment System. Check out the Projects section for more details!",
  'contact': "You can contact Waqar via email at hello@waqar.dev or connect with him on LinkedIn or GitHub.",
  'experience': "Waqar has extensive experience in backend development, focusing on intelligent systems and AI integration.",
  'background': "Waqar is a backend developer with a passion for AI and creating intelligent systems. He's known for his honest, calm, and supportive approach to development.",
  'java': "Java is one of Waqar's core skills. He uses it for building robust, enterprise-grade applications and backend systems.",
  'spring': "Waqar has strong expertise in Spring Boot, which he uses to develop APIs and microservices efficiently.",
  'ai': "AI integration is a passion for Waqar. He specializes in connecting large language models like GPT-4 to traditional software systems.",
  'odoo': "Waqar has experience with Odoo ERP development, creating custom modules and integrations for business management systems.",
  'api': "Waqar designs and implements RESTful and GraphQL APIs that are secure, scalable, and easy to use."
};

export function getAIResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Check for direct keyword matches
  for (const [keyword, response] of Object.entries(aiResponses)) {
    if (lowerMessage.includes(keyword)) {
      return response;
    }
  }
  
  // Check for question patterns
  if (lowerMessage.includes("who") && lowerMessage.includes("waqar")) {
    return aiResponses['background'];
  }
  
  if (lowerMessage.includes("how") && lowerMessage.includes("contact")) {
    return aiResponses['contact'];
  }
  
  if (lowerMessage.match(/what.+(do|does|skill|good at)/i)) {
    return aiResponses['skills'];
  }
  
  // Default response
  return "I'm Waqar's AI assistant. I can tell you about his skills, projects, or how to contact him. What would you like to know?";
}
