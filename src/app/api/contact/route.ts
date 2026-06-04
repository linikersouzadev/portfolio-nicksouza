import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limiting simples em memória (por IP)
const WINDOW_MS = 5 * 60 * 1000; // 5 minutos
const MAX_REQUESTS = 5;

type Entry = { count: number; windowStart: number };
const ipStore = new Map<string, Entry>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipStore.get(ip);

  if (!entry) {
    ipStore.set(ip, { count: 1, windowStart: now });
    return false;
  }

  if (now - entry.windowStart > WINDOW_MS) {
    ipStore.set(ip, { count: 1, windowStart: now });
    return false;
  }

  entry.count += 1;
  ipStore.set(ip, entry);

  return entry.count > MAX_REQUESTS;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, subject, message, website } = body as {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
    website?: string; // honeypot
  };

  // Honeypot: bots costumam preencher campos escondidos
  if (website && website.trim().length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (message.trim().length < 20) {
    return NextResponse.json(
      { error: "Message too short. Please add more details." },
      { status: 400 },
    );
  }

  const { error } = await resend.emails.send({
    from: "Portfolio <onboarding@resend.dev>",
    to: process.env.CONTACT_EMAIL!,
    subject: `[Portfolio] ${subject}`,
    text: `Nome: ${name}\nE-mail: ${email}\n\n${message}`,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json(
      { error: "Erro ao enviar mensagem." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}