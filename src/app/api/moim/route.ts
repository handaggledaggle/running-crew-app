import { NextResponse } from 'next/server';
import { db } from '@/db';
import { moim } from '@/db/schema';
import { desc } from 'drizzle-orm';

const FALLBACK = [
  { id: '1', title: '홍대 저녁 러닝 크루', date: '2026-07-31', time: '19:30', location: '홍대 놀이터', pace: '입문', distance: 5, capacity: 10, joined: 7, leader: '김민준' },
  { id: '2', title: '한강 아침 달리기', date: '2026-08-01', time: '06:00', location: '여의도 한강공원', pace: '중급', distance: 10, capacity: 15, joined: 11, leader: '이서연' },
  { id: '3', title: '올림픽공원 주말 런', date: '2026-08-02', time: '08:00', location: '올림픽공원 정문', pace: '상급', distance: 15, capacity: 8, joined: 6, leader: '박지훈' },
];

export async function GET() {
  try {
    const list = await db.select().from(moim).orderBy(desc(moim.createdAt));
    if (list.length === 0) return NextResponse.json(FALLBACK);
    return NextResponse.json(
      list.map((m) => ({
        id: String(m.id),
        title: m.title,
        date: m.date,
        time: m.time,
        location: m.location,
        pace: m.pace,
        distance: m.distance,
        capacity: m.capacity,
        joined: m.joined,
        leader: m.leaderName,
      }))
    );
  } catch {
    return NextResponse.json(FALLBACK);
  }
}
