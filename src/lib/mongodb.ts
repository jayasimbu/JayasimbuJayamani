import { MongoClient, Db } from 'mongodb';
import { timingSafeEqual } from 'crypto';
import dns from 'dns';

// Fix Node.js DNS SRV resolution on Windows for mongodb+srv:// URIs
if (process.platform === 'win32') {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch {
    // fallback gracefully to default resolver
  }
}

const MONGODB_DB = process.env.MONGODB_DB || 'jayasimbu_portfolio';

interface GlobalWithMongo {
  _mongoClientPromise?: Promise<MongoClient>;
}

const globalWithMongo = globalThis as typeof globalThis & GlobalWithMongo;

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not defined.');
  }

  if (!globalWithMongo._mongoClientPromise) {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
    });
    globalWithMongo._mongoClientPromise = client.connect().catch((err) => {
      delete globalWithMongo._mongoClientPromise;
      throw err;
    });
  }
  return globalWithMongo._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(MONGODB_DB);
}

export function isAuthorizedAdmin(req: Request): boolean {
  const expectedKey = process.env.ADMIN_KEY;
  if (!expectedKey) return false;
  const providedKey = req.headers.get('x-admin-key') || '';
  if (providedKey.length !== expectedKey.length) return false;
  try {
    return timingSafeEqual(
      Buffer.from(providedKey, 'utf-8'),
      Buffer.from(expectedKey, 'utf-8')
    );
  } catch {
    return false;
  }
}
