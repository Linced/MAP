const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const config = require('../../shared/config');
const logger = require('../utils/logger');

// Create a test account for development
const createTestAccount = async () => {
  const testAccount = await nodemailer.createTestAccount();
  return {
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  };
};

// Configure email transport
const transportConfig = config.env === 'production' 
  ? {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    }
  : createTestAccount();

// Create reusable transporter object
const transporter = nodemailer.createTransport(transportConfig);

// Verify connection configuration
transporter.verify((error) => {
  if (error) {
    logger.error('Error with email configuration:', error);
  } else {
    logger.info('Email server is ready to take our messages');
  }
});

// Render email template
const renderTemplate = async (templateName, data) => {
  try {
    const templatePath = path.join(__dirname, `../../templates/emails/${templateName}.ejs`);
    return await ejs.renderFile(templatePath, data);
  } catch (error) {
    logger.error('Error rendering email template:', error);
    throw error;
  }
};

// Send email
const sendEmail = async (to, subject, html, text) => {
  try {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Market Assistant'}" <${process.env.EMAIL_FROM || 'noreply@marketassistant.com'}>`,
      to,
      subject,
      text: text || subject, // Plain text fallback
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    
    // Log email info in development
    if (config.env !== 'production') {
      logger.info('Message sent: %s', info.messageId);
      logger.info('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    
    return info;
  } catch (error) {
    logger.error('Error sending email:', error);
    throw error;
  }
};

// Send welcome email
const sendWelcomeEmail = async (email, name) => {
  try {
    const subject = 'Welcome to Market Assistant Platform';
    const html = await renderTemplate('welcome', { name });
    await sendEmail(email, subject, html);
    logger.info(`Welcome email sent to ${email}`);
  } catch (error) {
    logger.error('Error sending welcome email:', error);
    throw error;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, name, resetUrl) => {
  try {
    const subject = 'Reset Your Password';
    const html = await renderTemplate('reset-password', { name, resetUrl });
    await sendEmail(email, subject, html);
    logger.info(`Password reset email sent to ${email}`);
  } catch (error) {
    logger.error('Error sending password reset email:', error);
    throw error;
  }
};

// Send password changed email
const sendPasswordChangedEmail = async (email, name) => {
  try {
    const subject = 'Your Password Has Been Changed';
    const html = await renderTemplate('password-changed', { name });
    await sendEmail(email, subject, html);
    logger.info(`Password changed email sent to ${email}`);
  } catch (error) {
    logger.error('Error sending password changed email:', error);
    throw error;
  }
};

// Send email verification email
const sendVerificationEmail = async (email, name, verificationUrl) => {
  try {
    const subject = 'Verify Your Email Address';
    const html = await renderTemplate('verify-email', { name, verificationUrl });
    await sendEmail(email, subject, html);
    logger.info(`Verification email sent to ${email}`);
  } catch (error) {
    logger.error('Error sending verification email:', error);
    throw error;
  }
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  sendVerificationEmail,
};
