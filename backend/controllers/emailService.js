import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10), // Ensure port is a number
    secure: process.env.EMAIL_SECURE === 'true', // Convert string 'true' to boolean true
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        // Do not fail on invalid certs (useful for development, but consider for production)
        rejectUnauthorized: false
    }
});

// Function to send an email
const sendEmail = async (to, subject, htmlContent) => {
    try {
        const mailOptions = {
            from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`, // Use the new EMAIL_FROM_NAME
            to: to,
            subject: subject,
            html: htmlContent,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('❌ Error sending email:', error);
        if (error.response) {
            console.error('Server response:', error.response);
        }
        throw error;
    }
};

export { sendEmail };