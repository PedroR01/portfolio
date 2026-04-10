import nodemailer from "nodemailer";

export function escapeHtml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: true, // False para probar en desarrollo.
    },
});

export type SendEmailOptions = {
    to: string;
    subject: string;
    html: string;
    text?: string;
};

export async function testEmail() {
    try {
        await transporter.verify();
        console.log("Server is ready to take our messages");
    } catch (err) {
        console.error("Verification failed", err);
    }
}

export async function sendEmail(options: SendEmailOptions) {
    const { to, subject, html, text } = options;

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            text,
            html,
        });

        return {
            success: true,
            messageId: info.messageId,
        };
    } catch (err) {
        const error = err as NodeJS.ErrnoException;
        switch (error.code) {
            case "ECONNECTION":
            case "ETIMEDOUT":
                console.error("Network error - retry later:", error.message);
                break;
            case "EAUTH":
                console.error("Authentication failed:", error.message);
                break;
            case "EENVELOPE":
                console.error("Invalid recipients:", error.syscall, error.code, error.message);
                break;
            default:
                console.error("Send failed:", error.message);
        }

        return {
            success: false,
            error: error.message,
        };
    }
}