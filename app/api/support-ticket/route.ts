import { NextResponse } from 'next/server';

const SUPPORT_EMAIL = 'ie@whitman.edu';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, category, subject, description, priority } = body;

    if (!name || !email || !subject || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const payload = {
      to: SUPPORT_EMAIL,
      submittedAt: new Date().toISOString(),
      name: String(name).slice(0, 200),
      email: String(email).slice(0, 200),
      category: String(category || 'Other').slice(0, 100),
      subject: String(subject).slice(0, 300),
      description: String(description).slice(0, 8000),
      priority: String(priority || 'medium').slice(0, 20),
    };

    if (process.env.NODE_ENV === 'development') {
      console.info('[support-ticket]', payload);
    }

    return NextResponse.json({
      ok: true,
      message: `Ticket recorded. In production, connect this endpoint to email (${SUPPORT_EMAIL}) or your ticketing system.`,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
