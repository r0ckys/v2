const nodemailer = require('nodemailer');

async function testBrevo() {
  console.log('Testing Brevo SMTP...\n');
  
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: 'ntrmt6@gmail.com',
      pass: 'xsmtpsib-cd9c8963000f995647a73d88fb2cc32c65cfb074aac279e9729ab83900052a07-ENoziGvR7ydJLWYX',
    },
  });

  try {
    console.log('Verifying connection...');
    await transporter.verify();
    console.log('✅ Connection verified!\n');
    
    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: '"SystemNext IT" <ntrmt6@gmail.com>',
      to: 'ntrmt6@gmail.com',
      subject: 'Test from Brevo SMTP',
      text: 'This is a test email from Brevo SMTP service.',
      html: '<h2>Success!</h2><p>Your Brevo SMTP is working!</p>',
    });
    
    console.log('✅ Email sent!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nFull error:', error);
  }
}

testBrevo();
