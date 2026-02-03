import nodemailer from 'nodemailer';
import config from '../config/index.js';

// Create transporter
const createTransporter = () => {
  console.log('📧 SMTP Config:', {
    host: config.smtp.host,
    port: config.smtp.port,
    user: config.smtp.user,
    fromEmail: config.smtp.fromEmail,
    fromName: config.smtp.fromName,
  });

  return nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });
};

// Send email
export const sendEmail = async (options) => {
  console.log('📧 Attempting to send email to:', options.email);
  console.log('📧 Subject:', options.subject);

  const transporter = createTransporter();

  const mailOptions = {
    from: `${config.smtp.fromName} <${config.smtp.fromEmail}>`,
    to: options.email,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📧 Response:', info.response);
    return info;
  } catch (error) {
    console.error('❌ Email send failed!');
    console.error('❌ Error:', error.message);
    console.error('❌ Full error:', error);
    throw error;
  }
};

// Send OTP email
export const sendOTPEmail = async (email, otp, name) => {
  console.log('🔐 Sending OTP email...');
  console.log('🔐 To:', email);
  console.log('🔐 Name:', name);
  console.log('🔐 OTP:', otp);
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-box { background: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
        .otp-code { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #6366f1; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Fit-Bees</h1>
          <p>Password Reset Request</p>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>We received a request to reset your password. Use the OTP below to proceed:</p>
          <div class="otp-box">
            <p class="otp-code">${otp}</p>
          </div>
          <p>This OTP is valid for <strong>10 minutes</strong>.</p>
          <p>If you didn't request this, please ignore this email or contact support if you have concerns.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Fit-Bees. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    email,
    subject: 'Password Reset OTP - Fit-Bees',
    html,
    text: `Your OTP for password reset is: ${otp}. This OTP is valid for 10 minutes.`,
  });
};

// Send welcome email
export const sendWelcomeEmail = async (email, name) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Fit-Bees!</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>Welcome to Fit-Bees! Your account has been successfully created.</p>
          <p>You can now log in and start managing your fitness journey.</p>
          <p>If you have any questions, feel free to reach out to our support team.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Fit-Bees. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    email,
    subject: 'Welcome to Fit-Bees!',
    html,
    text: `Welcome to Fit-Bees, ${name}! Your account has been successfully created.`,
  });
};

// Send payment receipt email
export const sendPaymentReceiptEmail = async (email, paymentDetails) => {
  const { clientName, invoiceNumber, amount, paymentType, paymentMethod, date } = paymentDetails;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .receipt-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .receipt-table td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
        .receipt-table td:first-child { font-weight: bold; color: #666; }
        .total { font-size: 24px; font-weight: bold; color: #6366f1; text-align: center; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Payment Receipt</h1>
          <p>Invoice: ${invoiceNumber}</p>
        </div>
        <div class="content">
          <p>Hi ${clientName},</p>
          <p>Thank you for your payment! Here are the details:</p>
          <table class="receipt-table">
            <tr><td>Invoice Number</td><td>${invoiceNumber}</td></tr>
            <tr><td>Payment Type</td><td>${paymentType}</td></tr>
            <tr><td>Payment Method</td><td>${paymentMethod}</td></tr>
            <tr><td>Date</td><td>${new Date(date).toLocaleDateString()}</td></tr>
          </table>
          <div class="total">Total: $${amount.toFixed(2)}</div>
          <p>If you have any questions about this payment, please contact us.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Fit-Bees. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    email,
    subject: `Payment Receipt - ${invoiceNumber}`,
    html,
    text: `Payment Receipt for ${invoiceNumber}. Amount: $${amount.toFixed(2)}`,
  });
};

export default {
  sendEmail,
  sendOTPEmail,
  sendWelcomeEmail,
  sendPaymentReceiptEmail,
};
