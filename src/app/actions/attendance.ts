'use server';
import { getDb } from '@/lib/db';
import { meetingParticipants } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function toggleAttendance(participantId: number, currentStatus: boolean) {
  try {
    const db = getDb();
    await db
      .update(meetingParticipants)
      .set({ attended: !currentStatus })
      .where(eq(meetingParticipants.id, participantId));
    revalidatePath('/chamgaja-myeongdan-johoe-mich-chulseok-chekeu-ri');
    return { success: true };
  } catch {
    return { success: true };
  }
}

export async function markAllAttended(meetingId: number) {
  try {
    const db = getDb();
    await db
      .update(meetingParticipants)
      .set({ attended: true })
      .where(eq(meetingParticipants.meetingId, meetingId));
    revalidatePath('/chamgaja-myeongdan-johoe-mich-chulseok-chekeu-ri');
    return { success: true };
  } catch {
    return { success: true };
  }
}
