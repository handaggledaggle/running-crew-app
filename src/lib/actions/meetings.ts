'use server'
import { db } from '@/lib/db'
import { meetings } from '@/lib/schema'
import { revalidatePath } from 'next/cache'
import { desc } from 'drizzle-orm'

export async function getMeetings() {
  return db.select().from(meetings).orderBy(desc(meetings.createdAt))
}

export async function createMeeting(formData: FormData) {
  const title = formData.get('title') as string
  const location = formData.get('location') as string
  const pace = formData.get('pace') as string
  const dateTime = formData.get('dateTime') as string
  const maxParticipants = parseInt((formData.get('slots') as string) || '10')
  const description = (formData.get('description') as string) || ''
  const level = (formData.get('level') as string) || '초급'
  const area = (formData.get('area') as string) || '서울'
  const distanceKm = parseFloat((formData.get('distance') as string) || '5')

  if (!title || !location || !pace || !dateTime) {
    return { error: '필수 항목을 입력해주세요' }
  }

  await db.insert(meetings).values({
    id: crypto.randomUUID(),
    creatorId: 'demo-user',
    title,
    location,
    pace,
    distanceKm,
    dateTime,
    maxParticipants,
    description,
    level,
    area,
  })
  revalidatePath('/page-1')
  revalidatePath('/page-2')
  return { ok: true }
}
