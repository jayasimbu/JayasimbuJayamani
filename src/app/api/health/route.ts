import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ensurePortfolioSeeded } from '@/lib/seed';

function getSafeEnvInfo() {
  const uri = process.env.MONGODB_URI || '';
  let protocol = '';
  let host = '';
  if (uri) {
    try {
      const parsed = new URL(uri);
      protocol = parsed.protocol;
      host = parsed.hostname;
    } catch {
      protocol = 'unparseable';
    }
  }
  return {
    hasMongoUri: Boolean(process.env.MONGODB_URI),
    hasMongoDb: Boolean(process.env.MONGODB_DB),
    hasAdminKey: Boolean(process.env.ADMIN_KEY),
    protocol: protocol || undefined,
    host: host || undefined,
  };
}

export async function GET() {
  const env = getSafeEnvInfo();
  try {
    const db = await getDb();
    await db.command({ ping: 1 });
    await ensurePortfolioSeeded(db);

    const [projects, skillCategories, experiences, inquiries] = await Promise.all([
      db.collection('projects').countDocuments(),
      db.collection('skill_categories').countDocuments(),
      db.collection('experiences').countDocuments(),
      db.collection('inquiries').countDocuments(),
    ]);

    return NextResponse.json({
      ok: true,
      env,
      database: db.databaseName,
      counts: { projects, skillCategories, experiences, inquiries },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Database connection error';
    return NextResponse.json({ ok: false, error: message, env }, { status: 500 });
  }
}
