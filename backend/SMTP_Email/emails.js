import dotenv from "dotenv";
import nodemailer from "nodemailer"

import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from "./emailTemplates.js";

dotenv.config();

// Configure the transporter with SMTP settings
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // or 587, 465
  auth: {
    user: process.env.SENDER_MAIL, 
    pass: process.env.GMAIL_SMTP_PASS, 
  },
});

// General-purpose function to send emails
const sendEmail = async (toEmail, subject, htmlContent) => {
  
    const mailOptions = {
      from: process.env.SENDER_MAIL, // Sender email
      to: toEmail, // Receiver email
      subject: subject, // Email subject
      html: htmlContent, // Email content in HTML format
    };
    try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};


export const sendVerificationEmail = async (email, verificationToken) => {
  console.log("inside:", email);
  const subject = "Verify your email";
  const htmlContent = VERIFICATION_EMAIL_TEMPLATE.replace(
    "{verificationCode}",
    verificationToken
  );

  try {
    await sendEmail(email, subject, htmlContent);
    //console.log("Verification email sent");
  } catch (error) {
    console.error("Error sending verification email", error);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const subject = "Welcome to Z-Auth";
  const htmlContent = WELCOME_EMAIL_TEMPLATE.replace("{name}", name);

  try {
    await sendEmail(email, subject, htmlContent);
    console.log("Welcome email sent");
  } catch (error) {
    console.error("Error sending welcome email", error);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  const subject = "Reset your password";
  const htmlContent = PASSWORD_RESET_REQUEST_TEMPLATE.replace(
    "{resetURL}",
    resetURL
  );

  try {
    await sendEmail(email, subject, htmlContent);
    console.log("Password reset email sent");
  } catch (error) {
    console.error("Error sending password reset email", error);
  }
};

export const sendResetSuccessfulEmail = async (email) => {
  const subject = "Password reset successful";
  const htmlContent = PASSWORD_RESET_SUCCESS_TEMPLATE;

  try {
    await sendEmail(email, subject, htmlContent);
    console.log("Password reset successful email sent");
  } catch (error) {
    console.error("Error sending password reset successful email", error);
  }
};
