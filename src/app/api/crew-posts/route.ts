import { NextResponse } from 'next/server';
import { db } from '@/db';
import { crewPost } from '@/db/schema';
import { desc } from 'drizzle-orm';

const FALLBACK = [
  { id: '1', author: '리더 박지훈', avatar: '박', content: '이번 주 토요일 런 코스 변경됩니다! 올림픽공원 동문 → 서문 방향으로 달립니다. 참고해주세요.', time: '2시간 전', likes: 12, comments: 3 },
  { id: '2', author: '리더 박지훈', avatar: '박', content: '8월 정기 일정 공지: 매주 토요일 오전 8시, 올림픽공원 정문 집결. 늦지 않게 와주세요!', time: '어제', likes: 20, comments: 7 },
  { id: '3', author: '리더 박지훈', avatar: '박', content: '지난 주 런 완주 축하해요! 다들 수고 많으셨어요.', time: '3일 전', likes: 35, comments: 10 },
];

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}분 전`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}시간 전`;
  const days = Math.floor(hrs / 24);
  return `${days}일 전`;
}

export async function GET() {
  try {
    const list = await db.select().from(crewPost).orderBy(desc(crewPost.createdAt));
    if (list.length === 0) return NextResponse.json(FALLBACK);
    return NextResponse.json(
      list.map((p) => ({
        id: String(p.id),
        author: p.author,
        avatar: p.avatar,
        content: p.content,
        time: timeAgo(new Date(p.createdAt)),
        likes: p.likes,
        comments: p.comments,
      }))
    );
  } catch {
    return NextResponse.json(FALLBACK);
  }
}
