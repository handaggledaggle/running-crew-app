import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { runRecord } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

const FALLBACK = [
  { id: '1', date: '2026-07-28', distance: 7.2, duration: 42 },
  { id: '2', date: '2026-07-25', distance: 5.0, duration: 30 },
  { id: '3', date: '2026-07-22', distance: 10.5, duration: 65 },
  { id: '4', date: '2026-07-19', distance: 6.0, duration: 36 },
];

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId') ?? 'default-user';
  try {
    const list = await db
      .select()
      .from(runRecord)
      .where(eq(runRecord.userId, userId))
      .orderBy(desc(runRecord.createdAt));
    if (list.length === 0) return NextResponse.json(FALLBACK);
    return NextResponse.json(
      list.map((r) => ({
        id: String(r.id),
        date: r.date,
        distance: r.distance,
        duration: r.duration,
      }))
    );
  } catch {
    return NextResponse.json(FALLBACK);
  }
}
