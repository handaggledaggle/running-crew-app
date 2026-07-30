'use server';

import { getDb } from './db';
import {
  meetings,
  participants,
  runningRecords,
  notices,
  noticeLikes,
  noticeComments,
} from './schema';
import { eq, desc, and, count } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { MEETINGS, MEMBERS, RUNNING_RECORDS, NOTICES } from './data';
import type { MeetingItem, ParticipantItem, RunningRecordItem, NoticeItem } from './types';

const DEMO_USER = '나';

// ─── Meetings ──────────────────────────────────────────────────────────────

export async function getMeetings(
  district = '전체',
  pace = '전체',
): Promise<MeetingItem[]> {
  const db = getDb();
  if (!db) {
    return MEETINGS.filter(
      (m) =>
        (district === '전체' || m.district === district) &&
        (pace === '전체' || m.pace === pace),
    ).map((m) => ({
      id: parseInt(m.id),
      title: m.title,
      date: m.date,
      time: m.time,
      location: m.location,
      district: m.district,
      pace: m.pace,
      capacity: m.capacity,
      leader: m.leader,
      memo: m.memo ?? null,
      joined: m.joined,
    }));
  }

  const rows = await db.select().from(meetings).orderBy(desc(meetings.createdAt));

  const enriched = await Promise.all(
    rows.map(async (m) => {
      const [{ count: joined }] = await db
        .select({ count: count() })
        .from(participants)
        .where(eq(participants.meetingId, m.id));
      return {
        id: m.id,
        title: m.title,
        date: m.date,
        time: m.time,
        location: m.location,
        district: m.district,
        pace: m.pace,
        capacity: m.capacity,
        leader: m.leader,
        memo: m.memo,
        joined: Number(joined),
      } as MeetingItem;
    }),
  );

  return enriched.filter(
    (m) =>
      (district === '전체' || m.district === district) &&
      (pace === '전체' || m.pace === pace),
  );
}

export async function createMeeting(form: {
  title: string;
  date: string;
  time: string;
  location: string;
  district: string;
  pace: string;
  capacity: string;
  memo: string;
}): Promise<{ ok: boolean }> {
  const db = getDb();
  if (!db) return { ok: true };

  await db.insert(meetings).values({
    title: form.title,
    date: form.date,
    time: form.time,
    location: form.location,
    district: form.district || '미정',
    pace: form.pace,
    capacity: parseInt(form.capacity) || 10,
    leader: DEMO_USER,
    memo: form.memo || null,
  });

  revalidatePath('/jiyeok-peiseubyeol-moim-tamsaek-mich-pilteo');
  return { ok: true };
}

export async function getMeetingDetail(meetingId: number): Promise<MeetingItem | null> {
  const db = getDb();
  if (!db) {
    const m = MEETINGS[0];
    return {
      id: 1,
      title: m.title,
      date: m.date,
      time: m.time,
      location: m.location,
      district: m.district,
      pace: m.pace,
      capacity: m.capacity,
      leader: m.leader,
      memo: m.memo ?? null,
      joined: m.joined,
    };
  }

  const [meeting] = await db
    .select()
    .from(meetings)
    .where(eq(meetings.id, meetingId));
  if (!meeting) return null;

  const [{ count: joined }] = await db
    .select({ count: count() })
    .from(participants)
    .where(eq(participants.meetingId, meetingId));

  return {
    id: meeting.id,
    title: meeting.title,
    date: meeting.date,
    time: meeting.time,
    location: meeting.location,
    district: meeting.district,
    pace: meeting.pace,
    capacity: meeting.capacity,
    leader: meeting.leader,
    memo: meeting.memo,
    joined: Number(joined),
  };
}

export async function joinMeeting(meetingId: number): Promise<{ ok: boolean }> {
  const db = getDb();
  if (!db) return { ok: true };

  const existing = await db
    .select()
    .from(participants)
    .where(
      and(eq(participants.meetingId, meetingId), eq(participants.userName, DEMO_USER)),
    );
  if (existing.length > 0) return { ok: true };

  await db.insert(participants).values({
    meetingId,
    userName: DEMO_USER,
    userAvatar: 'user',
  });

  revalidatePath('/chamga-sincheong-mich-chwiso');
  revalidatePath('/jiyeok-peiseubyeol-moim-tamsaek-mich-pilteo');
  return { ok: true };
}

export async function cancelMeeting(meetingId: number): Promise<{ ok: boolean }> {
  const db = getDb();
  if (!db) return { ok: true };

  await db
    .delete(participants)
    .where(
      and(eq(participants.meetingId, meetingId), eq(participants.userName, DEMO_USER)),
    );

  revalidatePath('/chamga-sincheong-mich-chwiso');
  revalidatePath('/jiyeok-peiseubyeol-moim-tamsaek-mich-pilteo');
  return { ok: true };
}

export async function checkIsJoined(meetingId: number): Promise<boolean> {
  const db = getDb();
  if (!db) return false;

  const rows = await db
    .select()
    .from(participants)
    .where(
      and(eq(participants.meetingId, meetingId), eq(participants.userName, DEMO_USER)),
    );
  return rows.length > 0;
}

// ─── Attendance ────────────────────────────────────────────────────────────

export async function getLatestMeeting(): Promise<MeetingItem | null> {
  const db = getDb();
  if (!db) {
    const m = MEETINGS[0];
    return {
      id: 1,
      title: m.title,
      date: m.date,
      time: m.time,
      location: m.location,
      district: m.district,
      pace: m.pace,
      capacity: m.capacity,
      leader: m.leader,
      memo: m.memo ?? null,
      joined: m.joined,
    };
  }

  const [m] = await db.select().from(meetings).orderBy(desc(meetings.createdAt));
  if (!m) return null;

  const [{ count: joined }] = await db
    .select({ count: count() })
    .from(participants)
    .where(eq(participants.meetingId, m.id));

  return {
    id: m.id,
    title: m.title,
    date: m.date,
    time: m.time,
    location: m.location,
    district: m.district,
    pace: m.pace,
    capacity: m.capacity,
    leader: m.leader,
    memo: m.memo,
    joined: Number(joined),
  };
}

export async function getParticipants(meetingId: number): Promise<ParticipantItem[]> {
  const db = getDb();
  if (!db) {
    return MEMBERS.map((m) => ({
      id: parseInt(m.id.replace('m', '')),
      userName: m.name,
      userAvatar: m.avatar,
      attended: m.attended === undefined ? null : m.attended,
    }));
  }

  const rows = await db
    .select()
    .from(participants)
    .where(eq(participants.meetingId, meetingId))
    .orderBy(participants.joinedAt);

  return rows.map((p) => ({
    id: p.id,
    userName: p.userName,
    userAvatar: p.userAvatar,
    attended: p.attended ?? null,
  }));
}

export async function toggleAttendance(
  participantId: number,
): Promise<{ ok: boolean; attended: boolean }> {
  const db = getDb();
  if (!db) return { ok: true, attended: true };

  const [p] = await db
    .select()
    .from(participants)
    .where(eq(participants.id, participantId));
  if (!p) return { ok: false, attended: false };

  const newAttended = p.attended !== true;
  await db
    .update(participants)
    .set({ attended: newAttended })
    .where(eq(participants.id, participantId));

  return { ok: true, attended: newAttended };
}

// ─── Running Records ───────────────────────────────────────────────────────

export async function getRunningRecords(): Promise<RunningRecordItem[]> {
  const db = getDb();
  if (!db) {
    return RUNNING_RECORDS.map((r, i) => ({
      id: i + 1,
      date: r.date,
      distanceKm: r.distance,
      durationMin: r.duration,
      memo: r.memo || null,
    }));
  }

  const rows = await db
    .select()
    .from(runningRecords)
    .where(eq(runningRecords.userName, DEMO_USER))
    .orderBy(desc(runningRecords.createdAt));

  return rows.map((r) => ({
    id: r.id,
    date: r.date,
    distanceKm: r.distanceKm,
    durationMin: r.durationMin,
    memo: r.memo,
  }));
}

export async function saveRunningRecord(form: {
  date: string;
  distanceKm: string;
  durationMin: string;
  memo: string;
}): Promise<{ ok: boolean }> {
  const db = getDb();
  if (!db) return { ok: true };

  const dist = parseFloat(form.distanceKm);
  const dur = parseInt(form.durationMin);
  if (isNaN(dist) || isNaN(dur) || dist <= 0 || dur <= 0) return { ok: false };

  await db.insert(runningRecords).values({
    userName: DEMO_USER,
    date: form.date || new Date().toISOString().slice(0, 10),
    distanceKm: dist,
    durationMin: dur,
    memo: form.memo || null,
  });

  revalidatePath('/reoning-girok-ipryeokgwa-nujeok-geori-tonggye');
  return { ok: true };
}

// ─── Notices ──────────────────────────────────────────────────────────────

function relativeTime(date: Date): string {
  const ms = Date.now() - date.getTime();
  const h = Math.floor(ms / 3_600_000);
  if (h < 24) return `${h || 1}시간 전`;
  return `${Math.floor(h / 24)}일 전`;
}

export async function getNotices(): Promise<NoticeItem[]> {
  const db = getDb();
  if (!db) {
    return NOTICES.map((n) => ({
      ...n,
      id: parseInt(n.id.replace('n', '')),
    }));
  }

  const rows = await db.select().from(notices).orderBy(desc(notices.createdAt));

  const results: NoticeItem[] = [];
  for (const n of rows) {
    const [{ count: likeCount }] = await db
      .select({ count: count() })
      .from(noticeLikes)
      .where(eq(noticeLikes.noticeId, n.id));
    const [{ count: commentCount }] = await db
      .select({ count: count() })
      .from(noticeComments)
      .where(eq(noticeComments.noticeId, n.id));
    const likedRows = await db
      .select()
      .from(noticeLikes)
      .where(and(eq(noticeLikes.noticeId, n.id), eq(noticeLikes.userName, DEMO_USER)));

    results.push({
      id: n.id,
      author: n.author,
      role: n.role,
      avatar: n.avatar,
      content: n.content,
      time: relativeTime(n.createdAt),
      likes: Number(likeCount),
      comments: Number(commentCount),
      liked: likedRows.length > 0,
    });
  }

  return results;
}

export async function toggleNoticeLike(
  noticeId: number,
): Promise<{ ok: boolean; liked: boolean; likes: number }> {
  const db = getDb();
  if (!db) return { ok: true, liked: true, likes: 1 };

  const existing = await db
    .select()
    .from(noticeLikes)
    .where(
      and(eq(noticeLikes.noticeId, noticeId), eq(noticeLikes.userName, DEMO_USER)),
    );

  if (existing.length > 0) {
    await db.delete(noticeLikes).where(eq(noticeLikes.id, existing[0].id));
  } else {
    await db.insert(noticeLikes).values({ noticeId, userName: DEMO_USER });
  }

  const [{ count: likeCount }] = await db
    .select({ count: count() })
    .from(noticeLikes)
    .where(eq(noticeLikes.noticeId, noticeId));

  revalidatePath('/keuru-gongji-pideu');
  return { ok: true, liked: existing.length === 0, likes: Number(likeCount) };
}

export async function addNoticeComment(
  noticeId: number,
  content: string,
): Promise<{ ok: boolean }> {
  const db = getDb();
  if (!db) return { ok: true };

  if (!content.trim()) return { ok: false };

  await db.insert(noticeComments).values({
    noticeId,
    userName: DEMO_USER,
    content: content.trim(),
  });

  revalidatePath('/keuru-gongji-pideu');
  return { ok: true };
}
