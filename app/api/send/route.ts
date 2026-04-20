import { NextRequest, NextResponse } from "next/server";
import { sendEmail, escapeHtml } from "@/lib/email";
import { isRateLimited } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
    try {

        // 1) Resolver IP
        const forwardedFor = req.headers.get("x-forwarded-for");
        const ip =
            forwardedFor?.split(",")[0]?.trim() ||
            req.headers.get("x-real-ip") ||
            "unknown";
        // 2) Aplicar rate limit (3 intentos por minuto por IP)
        const limited = isRateLimited(ip, { limit: 3, windowMs: 60_000 });
        if (limited) {
            return NextResponse.json(
                { error: "Too many requests. Please wait before trying again." },
                {
                    status: 429,
                    headers: { "Retry-After": "60" },
                }

            );
        }

        const contentType = req.headers.get("content-type");

        if (!contentType?.includes("application/json")) {
            return NextResponse.json({ error: "Content-Type must be application/json" }, { status: 415 });
        }

        const body = await req.json();
        const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const MAX_LENGTHS = { name: 50, email: 70, message: 1500 };

        const { name, email, message } = body;

        /// Validaciones
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        if (
            name.length > MAX_LENGTHS.name ||
            email.length > MAX_LENGTHS.email ||
            message.length > MAX_LENGTHS.message
        ) {
            return NextResponse.json({ error: "Field too long" }, { status: 400 });
        }

        if (!EMAIL_REGEX.test(email)) {
            return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
        }
        ///

        const result = await sendEmail({
            to: process.env.EMAIL_TO ?? "probinet01@gmail.com",
            subject: `Mensaje Portfolio - ${escapeHtml(name)}`,
            text: `
            Nuevo mensaje de ${escapeHtml(name)} - ${escapeHtml(email)}
            ${escapeHtml(message)}
            `,
            html: `
   <h2>Nuevo mensaje</h2>
    <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
     <p>${escapeHtml(message)}</p>
   `,
        });

        if (!result.success) {
            return NextResponse.json(
                { error: "Failed to send email" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: "Email sent successfully",
            messageId: result.messageId,
        });
    } catch (err: unknown) {
        return NextResponse.json(
            { error: "Invalid request" },
            { status: 400 }
        );
    }
}