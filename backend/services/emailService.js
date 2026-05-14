import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendOTP = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'ServAI - Email Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to ServAI!</h2>
          <p>Your verification code is:</p>
          <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0;">
            ${otp}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

export const sendNotification = async (email, subject, message) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html: message
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email sending error:', error);
  }
};