const express = require('express');
const { Resend } = require('resend');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

console.log('💡 RESEND_API_KEY is:', process.env.RESEND_API_KEY ? 'loaded ✅' : 'undefined ⚠️');

// Middleware
app.use(cors());
app.use(express.json());

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, service, message } = req.body;

    // Validation
    if (!name || !email || !service || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'All fields are required' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide a valid email address' 
      });
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Commission Form <noreply@taoseto.com>', 
      to: ['commissions@taoseto.com'],
      subject: `Commission Request: ${service} - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            Commission Request
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Service:</strong> <span style="background-color: #007bff; color: white; padding: 2px 8px; border-radius: 4px;">${service}</span></p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #333;">Message:</h3>
            <div style="background-color: #fff; border-left: 4px solid #007bff; padding: 15px; margin: 10px 0; border-radius: 0 4px 4px 0;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          
          <div style="text-align: center; color: #666; font-size: 12px;">
            <p>This email was sent from your commission form</p>
            <p>Reply directly to this email to contact ${name}</p>
          </div>
        </div>
      `,
      text: `
New Commission Request

Name: ${name}
Email: ${email}
Service: ${service}

Project Details:
${message}

---
This email was sent from your commission form.
Reply directly to this email to contact ${name}.
      `,
      replyTo: email, // Allows you to reply directly to the client
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to send email' 
      });
    }

    console.log('Email sent successfully:', data);
    res.json({ 
      success: true, 
      message: 'Email sent successfully',
      emailId: data.id 
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running',
    resend: process.env.RESEND_API_KEY ? 'configured' : 'not configured'
  });
});

// Test endpoint to verify Resend setup
app.get('/api/test-email', async (req, res) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Test <noreply@taoseto.com>',
      to: ['commissions@taoseto.com'],
      subject: 'Resend Test Email',
      html: '<p>This is a test email to verify Resend is working!</p>',
    });

    if (error) {
      return res.status(500).json({ success: false, error });
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Resend API key: ${process.env.RESEND_API_KEY ? 'Set' : 'Not set'}`);
});