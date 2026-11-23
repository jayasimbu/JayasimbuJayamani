import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ensurePortfolioSeeded } from '@/lib/seed';

export async function GET() {
  try {
    const db = await getDb();
    await db.command({ ping: 1 });
    await ensurePortfolioSeeded(db);

    return NextResponse.json(
      {
        ok: true,
        database: 'connected',
      },
      { status: 200 }
    );
  } catch (error) {
    // Keep internal diagnostics exclusively in server-side logs
    console.error(
      '[Health Check]: Database connectivity check failed:',
      error instanceof Error ? error.message : 'Unknown error'
    );

    return NextResponse.json(
      {
        ok: false,
        database: 'unavailable',
      },
      { status: 503 }
    );
  }
}
