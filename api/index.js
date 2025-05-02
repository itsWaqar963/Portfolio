// Serverless API handler for Vercel
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    console.log('Contact form submission:', { name, email, subject, message });
    
    // You can add email sending logic here (using services like SendGrid, Mailgun, etc.)
    
    return res.status(200).json({ 
      success: true, 
      message: "Message received. Thank you for getting in touch!"
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ 
      success: false, 
      message: "There was a problem sending your message."
    });
  }
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

// Export the express API
module.exports = app;