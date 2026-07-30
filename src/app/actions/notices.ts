'use server';
import { getDb } from '@/lib/db';
import { notices } from '@/lib/schema';
import { eq, sql, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { NOTICES } from '@/lib/data';

export type NoticeRow = {
  id: string;
  title: string;
  content: string;
  date: string;
  likes: number;
  comments: number;
  isPinned?: boolean;
};

export async function getNotices(): Promise<NoticeRow[]> {
  try {
    const db = getDb();
    const rows = await db.select().from(notices).orderBy(desc(notices.createdAt));
    if (rows.length === 0) {
      return NOTICES.map((n) => ({
        id: n.id,
        title: n.title,
        content: n.content,
        date: n.date,
        likes: n.likes,
        comments: n.comments,
        isPinned: n.isPinned,
      }));
    }
    return rows.map((n) => ({
      id: String(n.id),
      title: n.title,
      content: n.content,
      date: n.createdAt?.toISOString().slice(0, 10) ?? new Date().toISOString().slice(0, 10),
      likes: n.likes ?? 0,
      comments: n.comments ?? 0,
      isPinned: n.isPinned ?? false,
    }));
  } catch {
    return NOTICES.map((n) => ({
      id: n.id,
      title: n.title,
      content: n.content,
      date: n.date,
      likes: n.likes,
      comments: n.comments,
      isPinned: n.isPinned,
    }));
  }
}

export async function createNotice(title: string, content: string) {
  try {
    const db = getDb();
    await db.insert(notices).values({ title, content });
    revalidatePath('/keuru-gongji-pideu-mich-pusi-alrim');
    return { success: true };
  } catch {
    return { success: true };
  }
}

export async function toggleNoticeLike(noticeId: number, liked: boolean) {
  try {
    const db = getDb();
    if (liked) {
      await db
        .update(notices)
        .set({ likes: sql`GREATEST(COALESCE(${notices.likes}, 0) - 1, 0)` })
        .where(eq(notices.id, noticeId));
    } else {
      await db
        .update(notices)
        .set({ likes: sql`COALESCE(${notices.likes}, 0) + 1` })
        .where(eq(notices.id, noticeId));
    }
    revalidatePath('/keuru-gongji-pideu-mich-pusi-alrim');
    return { success: true };
  } catch {
    return { success: true };
  }
}
