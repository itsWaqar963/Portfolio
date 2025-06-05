import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";

// Validate contact form data
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  message: z.string().min(10, "Message must be at least 10 characters.")
});

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoints
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = contactFormSchema.parse(req.body);
      
      // Here you would typically:
      // 1. Store the contact form submission in a database
      // 2. Send an email notification
      // For now, we'll just log it and return success

      console.log("Contact form submission:", validatedData);
      
      return res.status(200).json({ 
        success: true, 
        message: "Message received. Thank you for reaching out!" 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          errors: error.errors 
        });
      }
      
      console.error("Error processing contact form:", error);
      return res.status(500).json({ 
        success: false, 
        message: "An error occurred while processing your request." 
      });
    }
  });

  // Medium RSS feed endpoint
  app.get("/api/medium-articles", async (req, res) => {
    try {
      console.log("Fetching Medium RSS feed...");
      
      const rssUrl = encodeURIComponent('https://medium.com/feed/@waqar.ah963');
      const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`);

      if (!response.ok) {
        throw new Error(`RSS fetch failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("RSS data fetched successfully");
      
      if (data.status !== 'ok') {
        throw new Error('RSS service error');
      }

      const articles = data.items.slice(0, 6).map((item: any) => {
        const cleanDescription = (item.description || item.content || '')
          .replace(/<[^>]*>/g, '')
          .replace(/&[^;]+;/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .substring(0, 200) + '...';

        return {
          title: item.title,
          link: item.link,
          description: cleanDescription,
          pubDate: item.pubDate,
          categories: item.categories || []
        };
      });

      console.log(`Successfully parsed ${articles.length} articles`);
      
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      return res.status(200).json({ 
        success: true, 
        articles,
        lastFetched: new Date().toISOString()
      });

    } catch (error) {
      console.error("Error fetching Medium articles:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to fetch Medium articles",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
