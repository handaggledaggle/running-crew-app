'use server';

import { db } from '@/db';
import { moim, participant } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createMoim(data: {
  title: string;
  date: string;
  time: string;
  location: string;
  pace: string;
  distance: number;
  capacity: number;
  leaderName: string;
}) {
  try {
    await db.insert(moim).values({ ...data, joined: 0 });
    revalidatePath('/jiyeok-peiseubyeol-moim-tamsaek-mich-pilteo');
    return { success: true };
  } catch {
    return { error: 'DB 오류가 발생했습니다.' };
  }
}

export async function joinMoim(moimId: number, userName: string) {
  try {
    const [m] = await db.select().from(moim).where(eq(moim.id, moimId));
    if (!m || m.joined >= m.capacity) return { error: '정원이 가득 찼습니다.' };
    await db.insert(participant).values({ moimId, userName, attended: false });
    await db.update(moim).set({ joined: m.joined + 1 }).where(eq(moim.id, moimId));
    revalidatePath('/jiyeok-peiseubyeol-moim-tamsaek-mich-pilteo');
    return { success: true };
  } catch {
    return { error: 'DB 오류가 발생했습니다.' };
  }
}

export async function cancelMoim(moimId: number, userName: string) {
  try {
    await db
      .delete(participant)
      .where(and(eq(participant.moimId, moimId), eq(participant.userName, userName)));
    const [m] = await db.select().from(moim).where(eq(moim.id, moimId));
    if (m && m.joined > 0) {
      await db.update(moim).set({ joined: m.joined - 1 }).where(eq(moim.id, moimId));
    }
    revalidatePath('/jiyeok-peiseubyeol-moim-tamsaek-mich-pilteo');
    return { success: true };
  } catch {
    return { error: 'DB 오류가 발생했습니다.' };
  }
}
