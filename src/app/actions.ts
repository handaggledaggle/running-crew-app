'use server';

import { eq, desc, asc, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getDb } from '@/lib/db';
import {
  meetups as meetupsTable,
  participants as participantsTable,
  runRecords as runRecordsTable,
  notices as noticesTable,
} from '@/lib/schema';

// ── Row types (serializable) ─────────────────────────────────

export type MeetupRow = {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  pace: string;
  capacity: number;
  registered: number;
  description: string;
  leader: string;
};

export type ParticipantRow = {
  id: number;
  meetupId: number;
  name: string;
  appliedAt: string;
  attended: boolean;
};

export type RunRecordRow = {
  id: number;
  date: string;
  distance: number;
  duration: string;
  avgPace: string;
};

export type NoticeRow = {
  id: number;
  author: string;
  date: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
};

// ── Mock data (fallback when DATABASE_URL is not set) ────────

const MOCK_MEETUPS: MeetupRow[] = [
  { id: 1, title: '마포 한강 저녁 러닝', date: '2026-07-30', time: '19:30', location: '마포 한강공원 주차장', pace: '중급', capacity: 12, registered: 8, description: '한강변을 따라 6km 코스로 달립니다.', leader: '김민준' },
  { id: 2, title: '성수 공장길 아침 달리기', date: '2026-07-31', time: '06:30', location: '성수역 2번 출구', pace: '초보', capacity: 10, registered: 3, description: '성수동 골목길 5km 가볍게 달려요.', leader: '이서연' },
  { id: 3, title: '송파 올림픽공원 스피드런', date: '2026-08-01', time: '07:00', location: '올림픽공원 평화의문', pace: '고급', capacity: 8, registered: 7, description: '5분 페이스 이하 멤버 환영.', leader: '박지훈' },
  { id: 4, title: '홍대 저녁 달리기 크루', date: '2026-08-02', time: '20:00', location: '홍대입구역 9번 출구', pace: '초보', capacity: 15, registered: 5, description: '홍대~합정 6km 야경 러닝.', leader: '최예진' },
];

const MOCK_PARTICIPANTS: Omit<ParticipantRow, 'meetupId'>[] = [
  { id: 1, name: '김민준', appliedAt: '2026-07-28', attended: true },
  { id: 2, name: '이서연', appliedAt: '2026-07-28', attended: true },
  { id: 3, name: '박지훈', appliedAt: '2026-07-29', attended: false },
  { id: 4, name: '최예진', appliedAt: '2026-07-29', attended: false },
  { id: 5, name: '정현우', appliedAt: '2026-07-29', attended: false },
  { id: 6, name: '한소희', appliedAt: '2026-07-30', attended: false },
  { id: 7, name: '오태양', appliedAt: '2026-07-30', attended: false },
  { id: 8, name: '윤아름', appliedAt: '2026-07-30', attended: false },
];

const MOCK_RUN_RECORDS: RunRecordRow[] = [
  { id: 1, date: '2026-07-28', distance: 6.2, duration: '37:12', avgPace: '6:00' },
  { id: 2, date: '2026-07-25', distance: 5.0, duration: '28:30', avgPace: '5:42' },
  { id: 3, date: '2026-07-22', distance: 8.0, duration: '50:24', avgPace: '6:18' },
  { id: 4, date: '2026-07-19', distance: 4.5, duration: '26:45', avgPace: '5:57' },
];

const MOCK_NOTICES: NoticeRow[] = [
  { id: 1, author: '김민준 (리더)', date: '2026-07-29', title: '이번 주 마포 러닝 코스 변경 안내', content: '한강 수위 상승으로 코스를 월드컵공원 방향으로 변경합니다. 집결 장소는 동일합니다.', likes: 12, comments: 5 },
  { id: 2, author: '김민준 (리더)', date: '2026-07-27', title: '7월 월간 기록 정산 완료!', content: '이번 달 총 23명이 참여했고 합산 거리는 287km입니다. 모두 수고하셨습니다.', likes: 31, comments: 8 },
  { id: 3, author: '이서연', date: '2026-07-25', title: '러닝 후 치맥 번개 (희망자 모집)', content: '성수 달리기 후 근처 치킨집 번개 어때요? 댓글로 참여 의사 남겨주세요.', likes: 18, comments: 14 },
];

// ── Meetup actions ───────────────────────────────────────────

export async function fetchMeetups(): Promise<MeetupRow[]> {
  const db = getDb();
  if (!db) return MOCK_MEETUPS;
  try {
    const rows = await db.select().from(meetupsTable).orderBy(asc(meetupsTable.date));
    if (rows.length === 0) {
      await db.insert(meetupsTable).values(
        MOCK_MEETUPS.map(m => ({
          title: m.title, date: m.date, time: m.time, location: m.location,
          pace: m.pace, capacity: m.capacity, registered: m.registered,
          description: m.description, leader: m.leader,
        }))
      );
      return (await db.select().from(meetupsTable).orderBy(asc(meetupsTable.date))) as MeetupRow[];
    }
    return rows as MeetupRow[];
  } catch {
    return MOCK_MEETUPS;
  }
}

const PACE_LABEL_TO_DB: Record<string, string> = {
  '초보(6분+)': '초보',
  '중급(5~6분)': '중급',
  '고급(5분 미만)': '고급',
};

export async function createMeetupAction(formData: FormData): Promise<{ error?: string }> {
  const db = getDb();
  const paceRaw = formData.get('pace') as string;
  const values = {
    title: formData.get('title') as string,
    date: formData.get('date') as string,
    time: formData.get('time') as string,
    location: formData.get('location') as string,
    pace: PACE_LABEL_TO_DB[paceRaw] ?? paceRaw,
    capacity: Number(formData.get('capacity')),
    description: (formData.get('description') as string) ?? '',
    leader: '나',
  };
  if (!db) return {};
  try {
    await db.insert(meetupsTable).values(values);
    revalidatePath('/jiyeok-peiseubyeol-moim-tamsaek-mich-pilteo');
    return {};
  } catch {
    return { error: '모임 개설에 실패했습니다.' };
  }
}

// ── Participant actions ──────────────────────────────────────

export async function fetchParticipants(meetupId: number): Promise<ParticipantRow[]> {
  const db = getDb();
  if (!db) return MOCK_PARTICIPANTS.map(p => ({ ...p, meetupId: 1 }));
  try {
    const rows = await db.select().from(participantsTable)
      .where(eq(participantsTable.meetupId, meetupId));
    if (rows.length === 0) {
      await db.insert(participantsTable).values(
        MOCK_PARTICIPANTS.map(p => ({
          meetupId,
          name: p.name,
          appliedAt: p.appliedAt,
          attended: p.attended,
        }))
      );
      return (await db.select().from(participantsTable)
        .where(eq(participantsTable.meetupId, meetupId))) as ParticipantRow[];
    }
    return rows as ParticipantRow[];
  } catch {
    return MOCK_PARTICIPANTS.map(p => ({ ...p, meetupId }));
  }
}

export async function applyToMeetupAction(
  meetupId: number,
  name: string
): Promise<{ error?: string; participantId?: number }> {
  const db = getDb();
  if (!db) return { participantId: -1 };
  try {
    const today = new Date().toISOString().slice(0, 10);
    const [row] = await db
      .insert(participantsTable)
      .values({ meetupId, name, appliedAt: today })
      .returning();
    await db
      .update(meetupsTable)
      .set({ registered: sql`${meetupsTable.registered} + 1` })
      .where(eq(meetupsTable.id, meetupId));
    revalidatePath('/chamga-sincheong-mich-chwiso');
    return { participantId: row.id };
  } catch {
    return { error: '신청에 실패했습니다.' };
  }
}

export async function cancelApplicationAction(
  participantId: number,
  meetupId: number
): Promise<{ error?: string }> {
  const db = getDb();
  if (!db) return {};
  try {
    await db.delete(participantsTable).where(eq(participantsTable.id, participantId));
    await db
      .update(meetupsTable)
      .set({ registered: sql`GREATEST(${meetupsTable.registered} - 1, 0)` })
      .where(eq(meetupsTable.id, meetupId));
    revalidatePath('/chamga-sincheong-mich-chwiso');
    return {};
  } catch {
    return { error: '취소에 실패했습니다.' };
  }
}

export async function toggleAttendanceAction(
  participantId: number,
  currentAttended: boolean
): Promise<{ error?: string }> {
  const db = getDb();
  if (!db) return {};
  try {
    await db
      .update(participantsTable)
      .set({ attended: !currentAttended })
      .where(eq(participantsTable.id, participantId));
    revalidatePath('/chamgaja-myeongdan-johoe-mich-chulseok-chekeu-ri');
    return {};
  } catch {
    return { error: '출석 업데이트에 실패했습니다.' };
  }
}

// ── Run record actions ───────────────────────────────────────

export async function fetchRunRecords(): Promise<RunRecordRow[]> {
  const db = getDb();
  if (!db) return MOCK_RUN_RECORDS;
  try {
    const rows = await db.select().from(runRecordsTable).orderBy(desc(runRecordsTable.createdAt));
    if (rows.length === 0) {
      await db.insert(runRecordsTable).values(
        MOCK_RUN_RECORDS.map(r => ({
          date: r.date, distance: r.distance, duration: r.duration, avgPace: r.avgPace,
        }))
      );
      return (await db.select().from(runRecordsTable).orderBy(desc(runRecordsTable.createdAt))) as RunRecordRow[];
    }
    return rows as RunRecordRow[];
  } catch {
    return MOCK_RUN_RECORDS;
  }
}

export async function saveRunRecordAction(formData: FormData): Promise<{ error?: string }> {
  const db = getDb();
  const values = {
    date: formData.get('date') as string,
    distance: Number(formData.get('distance')),
    duration: formData.get('duration') as string,
    avgPace: formData.get('avgPace') as string,
  };
  if (!db) return {};
  try {
    await db.insert(runRecordsTable).values(values);
    revalidatePath('/reoning-girok-ipryeokgwa-nujeok-geori-pyosi');
    return {};
  } catch {
    return { error: '기록 저장에 실패했습니다.' };
  }
}

// ── Notice actions ───────────────────────────────────────────

export async function fetchNotices(): Promise<NoticeRow[]> {
  const db = getDb();
  if (!db) return MOCK_NOTICES;
  try {
    const rows = await db.select().from(noticesTable).orderBy(desc(noticesTable.createdAt));
    if (rows.length === 0) {
      await db.insert(noticesTable).values(
        MOCK_NOTICES.map(n => ({
          author: n.author, date: n.date, title: n.title,
          content: n.content, likes: n.likes, comments: n.comments,
        }))
      );
      return (await db.select().from(noticesTable).orderBy(desc(noticesTable.createdAt))) as NoticeRow[];
    }
    return rows as NoticeRow[];
  } catch {
    return MOCK_NOTICES;
  }
}

export async function createNoticeAction(formData: FormData): Promise<{ error?: string }> {
  const db = getDb();
  const today = new Date().toISOString().slice(0, 10);
  const values = {
    author: '나',
    date: today,
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    likes: 0,
    comments: 0,
  };
  if (!db) return {};
  try {
    await db.insert(noticesTable).values(values);
    revalidatePath('/keuru-gongji-pideu');
    return {};
  } catch {
    return { error: '공지 작성에 실패했습니다.' };
  }
}

export async function likeNoticeAction(noticeId: number): Promise<{ error?: string }> {
  const db = getDb();
  if (!db) return {};
  try {
    await db
      .update(noticesTable)
      .set({ likes: sql`${noticesTable.likes} + 1` })
      .where(eq(noticesTable.id, noticeId));
    return {};
  } catch {
    return { error: '좋아요 처리에 실패했습니다.' };
  }
}
