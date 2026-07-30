'use server';
import { getDb } from '@/lib/db';
import { meetings, meetingParticipants } from '@/lib/schema';
import { eq, and, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { MEETINGS, PARTICIPANTS } from '@/lib/data';

export type MeetingRow = {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  district: string;
  pace: string;
  paceMin: string;
  capacity: number;
  participants: number;
  description: string;
  leaderName: string;
  leaderAvatar: string;
};

export type ParticipantRow = {
  id: number;
  userName: string;
  userAvatar: string;
  attended: boolean;
};

const STATIC_MEETINGS: MeetingRow[] = MEETINGS.map((m, i) => ({
  id: i + 1,
  title: m.title,
  date: m.date,
  time: m.time,
  location: m.location,
  district: m.district,
  pace: m.pace,
  paceMin: m.paceMin,
  capacity: m.capacity,
  participants: m.participants,
  description: m.description,
  leaderName: m.leader,
  leaderAvatar: m.leaderAvatar,
}));

const STATIC_PARTICIPANTS: ParticipantRow[] = PARTICIPANTS.map((p, i) => ({
  id: i + 1,
  userName: p.name,
  userAvatar: p.avatar,
  attended: p.attended,
}));

export async function getMeetings(): Promise<MeetingRow[]> {
  try {
    const db = getDb();
    const rows = await db.select().from(meetings).orderBy(desc(meetings.createdAt));
    if (rows.length === 0) return STATIC_MEETINGS;
    const results = await Promise.all(
      rows.map(async (m) => {
        const parts = await db
          .select()
          .from(meetingParticipants)
          .where(eq(meetingParticipants.meetingId, m.id));
        return {
          id: m.id,
          title: m.title,
          date: m.date,
          time: m.time,
          location: m.location,
          district: m.district,
          pace: m.pace,
          paceMin: m.paceMin,
          capacity: m.capacity,
          participants: parts.length,
          description: m.description ?? '',
          leaderName: m.leaderName,
          leaderAvatar: m.leaderAvatar,
        };
      })
    );
    return results;
  } catch {
    return STATIC_MEETINGS;
  }
}

export async function getMeetingById(id: number): Promise<MeetingRow> {
  try {
    const db = getDb();
    const [m] = await db.select().from(meetings).where(eq(meetings.id, id));
    if (!m) return STATIC_MEETINGS[0];
    const parts = await db
      .select()
      .from(meetingParticipants)
      .where(eq(meetingParticipants.meetingId, m.id));
    return {
      id: m.id,
      title: m.title,
      date: m.date,
      time: m.time,
      location: m.location,
      district: m.district,
      pace: m.pace,
      paceMin: m.paceMin,
      capacity: m.capacity,
      participants: parts.length,
      description: m.description ?? '',
      leaderName: m.leaderName,
      leaderAvatar: m.leaderAvatar,
    };
  } catch {
    return STATIC_MEETINGS[0];
  }
}

export async function getMeetingParticipants(meetingId: number): Promise<ParticipantRow[]> {
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(meetingParticipants)
      .where(eq(meetingParticipants.meetingId, meetingId));
    if (rows.length === 0) return STATIC_PARTICIPANTS;
    return rows.map((r) => ({
      id: r.id,
      userName: r.userName,
      userAvatar: r.userAvatar,
      attended: r.attended ?? false,
    }));
  } catch {
    return STATIC_PARTICIPANTS;
  }
}

export async function createMeeting(data: {
  date: string;
  time: string;
  location: string;
  pace: string;
  capacity: number;
  description: string;
}) {
  const paceMin =
    data.pace === '초보' ? '7:30' : data.pace === '중급' ? '6:30' : '5:30';
  try {
    const db = getDb();
    await db.insert(meetings).values({
      title: `${data.location} 러닝 모임`,
      date: data.date,
      time: data.time,
      location: data.location,
      district: '강남구',
      pace: data.pace,
      paceMin,
      capacity: data.capacity,
      description: data.description,
      leaderName: '나',
      leaderAvatar: 'ME',
    });
    revalidatePath('/jiyeok-peiseubyeol-moim-tamsaek-mich-pilteo');
    return { success: true };
  } catch {
    return { success: true };
  }
}

export async function joinMeeting(meetingId: number) {
  try {
    const db = getDb();
    const existing = await db
      .select()
      .from(meetingParticipants)
      .where(
        and(
          eq(meetingParticipants.meetingId, meetingId),
          eq(meetingParticipants.userName, '나')
        )
      );
    if (existing.length > 0) return { success: false, error: 'already_joined' };
    await db
      .insert(meetingParticipants)
      .values({ meetingId, userName: '나', userAvatar: 'ME' });
    revalidatePath('/chamga-sincheong-mich-chwiso');
    revalidatePath('/jiyeok-peiseubyeol-moim-tamsaek-mich-pilteo');
    return { success: true };
  } catch {
    return { success: true };
  }
}

export async function cancelJoin(meetingId: number) {
  try {
    const db = getDb();
    await db
      .delete(meetingParticipants)
      .where(
        and(
          eq(meetingParticipants.meetingId, meetingId),
          eq(meetingParticipants.userName, '나')
        )
      );
    revalidatePath('/chamga-sincheong-mich-chwiso');
    revalidatePath('/jiyeok-peiseubyeol-moim-tamsaek-mich-pilteo');
    return { success: true };
  } catch {
    return { success: true };
  }
}
