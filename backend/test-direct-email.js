const nodemailer = require('nodemailer');

async function testDirectEmail() {
  console.log('========================================');
  console.log('Direct Email Transport Test');
  console.log('========================================\n');

  console.log('Using sendmail direct transport...');
  console.log('From: info@allinbangla.com');
  console.log('To: ntrmt6@gmail.com\n');

  const transporter = nodemailer.createTransport({
    sendmail: true,
    newline: 'unix',
    path: '/usr/sbin/sendmail',
  });

  const timestamp = new Date().toLocaleString();
  
  const mailOptions = {
    from: 'info@allinbangla.com',
    to: 'ntrmt6@gmail.com',
    subject: '[TEST] Direct Email from Your Server - ' + timestamp,
    text: `This is a test email sent directly from your server using sendmail.

Sent at: ${timestamp}
Server: server1.cartandget.com (159.198.47.126)
From: info@allinbangla.com
To: ntrmt6@gmail.com

If you receive this email, your direct email transport is working!

Note: This email may arrive in spam folder initially. To improve deliverability, add SPF and DKIM DNS records.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">✅ Direct Email Transport Test</h2>
        <p>This is a test email sent directly from your server using sendmail.</p>
        <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; font-weight: bold;">Sent at:</td>
            <td style="padding: 8px;">${timestamp}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Server:</td>
            <td style="padding: 8px;">server1.cartandget.com (159.198.47.126)</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">From:</td>
            <td style="padding: 8px;">info@allinbangla.com</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">To:</td>
            <td style="padding: 8px;">ntrmt6@gmail.com</td>
          </tr>
        </table>
        <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #16a34a; font-weight: bold;">
          ✅ If you receive this email, your direct email transport is working!
        </p>
        <p style="color: #ea580c; font-size: 14px;">
          <strong>Note:</strong> This email may arrive in spam folder initially. 
          To improve deliverability, add SPF and DKIM DNS records.
        </p>
      </div>
    `,
  };

  try {
    console.log('Sending test email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    console.log('Response:', info.response);
    console.log('\n========================================');
    console.log('Success! Check ntrmt6@gmail.com');
    console.log('(May be in spam folder)');
    console.log('========================================');
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    console.log('\nError details:', error);
    process.exit(1);
  }
}

testDirectEmail();
