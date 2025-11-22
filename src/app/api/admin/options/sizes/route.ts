import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sizes } from '@/lib/db/schema';
import { getCurrentUser } from '@/lib/auth/actions';

export async function GET(req: Request) {
  const user = await getCurrentUser();
  const ADMIN_UUID = 'c8b063c3-b812-4db3-a318-7389a4ef62a6';
  const secret = req.headers.get('x-admin-secret') ?? '';
  const okByUser = !!(user && user.id === ADMIN_UUID);
  const okBySecret = process.env.ADMIN_SECRET && secret === process.env.ADMIN_SECRET;
  if (!okByUser && !okBySecret) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const rows = await db.select({ label: sizes.name, value: sizes.slug }).from(sizes).orderBy(sizes.sortOrder);
  return NextResponse.json(rows);
}
