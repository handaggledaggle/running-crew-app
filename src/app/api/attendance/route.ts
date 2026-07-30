import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { participant } from '@/db/schema';
import { eq } from 'drizzle-orm';

const FALLBACK = [
  { id: 1, moimId: 1, userName: '이수진', attended: true },
  { id: 2, moimId: 1, userName: '최동현', attended: true },
  { id: 3, moimId: 1, userName: '김예은', attended: false },
  { id: 4, moimId: 1, userName: '박성우', attended: false },
  { id: 5, moimId: 1, userName: '정다영', attended: true },
];

export async function GET(req: NextRequest) {
  const moimId = Number(req.nextUrl.searchParams.get('moimId') ?? '1');
  try {
    const list = await db
      .select()
      .from(participant)
      .where(eq(participant.moimId, moimId));
    if (list.length === 0) return NextResponse.json(FALLBACK);
    return NextResponse.json(
      list.map((p) => ({
        id: p.id,
        moimId: p.moimId,
        userName: p.userName,
        attended: p.attended,
      }))
    );
  } catch {
    return NextResponse.json(FALLBACK);
  }
}
