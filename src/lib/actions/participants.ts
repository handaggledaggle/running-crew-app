'use server'
import { db } from '@/lib/db'
import { meetingParticipants } from '@/lib/schema'
import { eq, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

const DEMO_USER_ID = 'demo-user'

export async function joinMeeting(meetingId: string) {
  const existing = await db
    .select()
    .from(meetingParticipants)
    .where(and(
      eq(meetingParticipants.meetingId, meetingId),
      eq(meetingParticipants.userId, DEMO_USER_ID),
    ))
  if (existing.length > 0) return { already: true }

  await db.insert(meetingParticipants).values({
    id: crypto.randomUUID(),
    meetingId,
    userId: DEMO_USER_ID,
    attended: false,
  })
  revalidatePath('/page-2')
  revalidatePath('/page-3')
  return { ok: true }
}

export async function cancelParticipation(meetingId: string) {
  await db
    .delete(meetingParticipants)
    .where(and(
      eq(meetingParticipants.meetingId, meetingId),
      eq(meetingParticipants.userId, DEMO_USER_ID),
    ))
  revalidatePath('/page-2')
  revalidatePath('/page-3')
  return { ok: true }
}

export async function getAttendees(meetingId: string) {
  return db
    .select()
    .from(meetingParticipants)
    .where(eq(meetingParticipants.meetingId, meetingId))
}

export async function toggleAttendance(participantId: string, attended: boolean) {
  await db
    .update(meetingParticipants)
    .set({ attended })
    .where(eq(meetingParticipants.id, participantId))
  revalidatePath('/page-3')
  return { ok: true }
}
