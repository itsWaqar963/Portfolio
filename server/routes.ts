import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { DOMParser } from '@xmldom/xmldom';

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
      
      const response = await fetch("https://medium.com/feed/@waqar.ah963", {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Portfolio-RSS-Reader/1.0)',
          'Accept': 'application/rss+xml, application/xml, text/xml'
        }
      });

      if (!response.ok) {
        throw new Error(`RSS fetch failed: ${response.status} ${response.statusText}`);
      }

      const xmlText = await response.text();
      console.log("RSS XML fetched successfully, parsing...");

      // Parse XML using DOMParser
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      // Check for parsing errors
      const parseError = xmlDoc.getElementsByTagName('parsererror')[0];
      if (parseError) {
        throw new Error('XML parsing failed');
      }

      const items = xmlDoc.getElementsByTagName('item');
      console.log(`Found ${items.length} articles in RSS feed`);

      const articles = Array.from(items).slice(0, 6).map(item => {
        const getTextContent = (tagName: string) => {
          const element = item.getElementsByTagName(tagName)[0];
          return element?.textContent || element?.firstChild?.nodeValue || '';
        };

        const title = getTextContent('title').replace(/^\s*\[CDATA\[|\]\]\s*$/g, '').trim();
        const link = getTextContent('link');
        const description = getTextContent('description');
        const content = getTextContent('content:encoded') || description;
        const pubDate = getTextContent('pubDate');
        
        // Extract categories
        const categoryElements = item.getElementsByTagName('category');
        const categories = Array.from(categoryElements).map(cat => 
          (cat.textContent || cat.firstChild?.nodeValue || '').replace(/^\s*\[CDATA\[|\]\]\s*$/g, '').trim()
        ).filter(Boolean);

        // Clean description by removing HTML and truncating
        const cleanDescription = content
          .replace(/<[^>]*>/g, '')
          .replace(/&[^;]+;/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .substring(0, 200) + '...';

        // Extract thumbnail from content
        const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
        const thumbnail = imgMatch ? imgMatch[1] : undefined;

        return {
          title,
          link,
          description: cleanDescription,
          pubDate,
          categories,
          thumbnail
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
