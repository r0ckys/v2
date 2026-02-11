#!/usr/bin/env node

/**
 * SMTP Email Test Script
 * 
 * This script tests the email functionality by sending a test email.
 * Run with: node test-email.js
 */

require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('========================================');
  console.log('SMTP Email Configuration Test');
  console.log('========================================\n');

  // Check environment variables
  console.log('Checking environment variables...');
  const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD', 'EMAIL_FROM', 'EMAIL_TO'];
  const missing = requiredVars.filter(v => !process.env[v]);
  
  if (missing.length > 0) {
    console.error('❌ Missing environment variables:', missing.join(', '));
    console.log('\nPlease update your .env file with:');
    console.log('SMTP_HOST=smtp.gmail.com');
    console.log('SMTP_PORT=587');
    console.log('SMTP_SECURE=false');
    console.log('SMTP_USER=info@allinbangla.com');
    console.log('SMTP_PASSWORD=your_app_password');
    console.log('EMAIL_FROM=info@allinbangla.com');
    console.log('EMAIL_TO=ntrmt6@gmail.com');
    process.exit(1);
  }

  console.log('✅ All environment variables present\n');

  // Display configuration (masked password)
  console.log('Configuration:');
  console.log(`  SMTP Host: ${process.env.SMTP_HOST}`);
  console.log(`  SMTP Port: ${process.env.SMTP_PORT}`);
  console.log(`  SMTP Secure: ${process.env.SMTP_SECURE}`);
  console.log(`  SMTP User: ${process.env.SMTP_USER}`);
  console.log(`  SMTP Password: ${'*'.repeat(process.env.SMTP_PASSWORD.length)}`);
  console.log(`  From: ${process.env.EMAIL_FROM}`);
  console.log(`  To: ${process.env.EMAIL_TO}\n`);

  // Create transporter
  console.log('Creating SMTP transporter...');
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // Verify connection
  try {
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified\n');
  } catch (error) {
    console.error('❌ SMTP connection failed:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Check your SMTP credentials');
    console.log('2. Ensure 2-factor authentication is enabled and use App Password');
    console.log('3. Check if port 587 is not blocked by firewall');
    console.log('4. Verify your email provider allows SMTP access');
    process.exit(1);
  }

  // Send test email
  console.log('Sending test email...');
  const timestamp = new Date().toLocaleString();
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: '[TEST] SMTP Configuration Test - ' + timestamp,
    text: `This is a test email sent from the SMTP configuration test script.

Sent at: ${timestamp}
From: ${process.env.EMAIL_FROM}
To: ${process.env.EMAIL_TO}

If you receive this email, your SMTP configuration is working correctly!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">SMTP Configuration Test</h2>
        <p>This is a test email sent from the SMTP configuration test script.</p>
        <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; font-weight: bold;">Sent at:</td>
            <td style="padding: 8px;">${timestamp}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">From:</td>
            <td style="padding: 8px;">${process.env.EMAIL_FROM}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">To:</td>
            <td style="padding: 8px;">${process.env.EMAIL_TO}</td>
          </tr>
        </table>
        <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #16a34a; font-weight: bold;">
          ✅ If you receive this email, your SMTP configuration is working correctly!
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('\nCheck your inbox at:', process.env.EMAIL_TO);
    console.log('\n========================================');
    console.log('Test completed successfully! 🎉');
    console.log('========================================');
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    console.log('\nError details:', error);
    process.exit(1);
  }
}

// Run the test
testEmail().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
