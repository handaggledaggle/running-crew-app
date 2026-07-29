'use server'
import { db } from '@/lib/db'
import { runningRecords } from '@/lib/schema'
import { eq, desc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

const DEMO_USER_ID = 'demo-user'

export async function getRunningRecords() {
  return db
    .select()
    .from(runningRecords)
    .where(eq(runningRecords.userId, DEMO_USER_ID))
    .orderBy(desc(runningRecords.createdAt))
}

export async function saveRunningRecord(formData: FormData) {
  const distanceStr = (formData.get('distance') as string) || ''
  const durationStr = (formData.get('duration') as string) || '0:0'
  const memo = (formData.get('memo') as string) || ''
  const recordedAt = (formData.get('date') as string) ||
    new Date().toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })

  const distanceKm = parseFloat(distanceStr)
  const parts = durationStr.split(':').map(Number)
  const durationMinutes = (parts[0] || 0) * 60 + (parts[1] || 0)

  if (!distanceKm) return { error: '거리를 입력해주세요' }
  if (!durationMinutes) return { error: '시간을 입력해주세요 (예: 32:10)' }

  await db.insert(runningRecords).values({
    id: crypto.randomUUID(),
    userId: DEMO_USER_ID,
    distanceKm,
    durationMinutes,
    memo,
    recordedAt,
  })
  revalidatePath('/page-4')
  return { ok: true }
}
