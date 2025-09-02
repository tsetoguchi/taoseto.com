// lambda-contact.js - Main contact form handler
const { Resend } = require('resend');

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Replace with your domain for security
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

exports.handler = async (event, context) => {
  console.log('💡 RESEND_API_KEY is:', process.env.RESEND_API_KEY ? 'loaded ✅' : 'undefined ⚠️');

  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: 'Method not allowed' }),
    };
  }

  try {
    const { name, email, service, message } = JSON.parse(event.body);

    // Validation
    if (!name || !email || !service || !message) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ 
          success: false, 
          error: 'All fields are required' 
        }),
      };
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ 
          success: false, 
          error: 'Please provide a valid email address' 
        }),
      };
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Commission Form <noreply@taoseto.com>', 
      to: ['commissions@taoseto.com'],
      subject: `New Commission Request: ${service} - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            New Commission Request
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Service:</strong> <span style="background-color: #007bff; color: white; padding: 2px 8px; border-radius: 4px;">${service}</span></p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #333;">Project Details:</h3>
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
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ 
          success: false, 
          error: 'Failed to send email' 
        }),
      };
    }

    console.log('Email sent successfully:', data);
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        emailId: data.id 
      }),
    };

  } catch (error) {
    console.error('Lambda error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
    };
  }
};

// ============================================
// lambda-health.js - Health check handler
// ============================================

const healthCorsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

exports.healthHandler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: healthCorsHeaders,
      body: '',
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: healthCorsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  return {
    statusCode: 200,
    headers: healthCorsHeaders,
    body: JSON.stringify({ 
      status: 'Server is running',
      resend: process.env.RESEND_API_KEY ? 'configured' : 'not configured'
    }),
  };
};

// ============================================
// lambda-test-email.js - Test email handler
// ============================================

const { Resend: TestResend } = require('resend');

const testResend = new TestResend(process.env.RESEND_API_KEY);

const testCorsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

exports.testEmailHandler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: testCorsHeaders,
      body: '',
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: testCorsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { data, error } = await testResend.emails.send({
      from: 'Test <noreply@taoseto.com>',
      to: ['commissions@taoseto.com'],
      subject: 'Resend Test Email',
      html: '<p>This is a test email to verify Resend is working!</p>',
    });

    if (error) {
      return {
        statusCode: 500,
        headers: testCorsHeaders,
        body: JSON.stringify({ success: false, error }),
      };
    }

    return {
      statusCode: 200,
      headers: testCorsHeaders,
      body: JSON.stringify({ success: true, data }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: testCorsHeaders,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};