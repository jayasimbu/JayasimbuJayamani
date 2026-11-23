import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

interface ContactPayload {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_SUBJECT_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 2000;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ContactPayload;
    const name = body.name?.trim().slice(0, MAX_NAME_LENGTH) || '';
    const email = body.email?.trim().slice(0, MAX_EMAIL_LENGTH) || '';
    const subject = body.subject?.trim().slice(0, MAX_SUBJECT_LENGTH) || 'General Inquiry';
    const message = body.message?.trim().slice(0, MAX_MESSAGE_LENGTH) || '';

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const doc = {
      name,
      email,
      subject,
      message,
      status: 'new' as const,
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection('inquiries').insertOne(doc);

    return NextResponse.json(
      {
        ok: true,
        id: result.insertedId.toString(),
        message: 'Inquiry saved successfully. Jayasimbu will review your message soon.',
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save inquiry';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
