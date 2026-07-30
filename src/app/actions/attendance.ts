'use server';

import { db } from '@/db';
import { participant } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function markAttendance(participantId: number, attended: boolean) {
  try {
    await db
      .update(participant)
      .set({ attended })
      .where(eq(participant.id, participantId));
    revalidatePath('/chamgaja-myeongdan-johoe-mich-chulseok-chekeu');
    return { success: true };
  } catch {
    return { error: 'DB 오류가 발생했습니다.' };
  }
}
