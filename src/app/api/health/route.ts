import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ensurePortfolioSeeded } from '@/lib/seed';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
};

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
      {
        status: 200,
        headers: NO_CACHE_HEADERS,
      }
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
      {
        status: 503,
        headers: NO_CACHE_HEADERS,
      }
    );
  }
}
