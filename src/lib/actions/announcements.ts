'use server'
import { db } from '@/lib/db'
import { announcements } from '@/lib/schema'
import { desc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function getAnnouncements() {
  return db.select().from(announcements).orderBy(desc(announcements.createdAt))
}

export async function postAnnouncement(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string

  if (!title || !content) return { error: '제목과 내용을 입력해주세요' }

  await db.insert(announcements).values({
    id: crypto.randomUUID(),
    creatorId: 'demo-user',
    authorName: '크루장 김민준',
    title,
    content,
  })
  revalidatePath('/page-5')
  return { ok: true }
}
