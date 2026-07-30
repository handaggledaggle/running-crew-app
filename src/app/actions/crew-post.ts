'use server';

import { db } from '@/db';
import { crewPost } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createCrewPost(data: {
  author: string;
  avatar: string;
  content: string;
}) {
  try {
    await db.insert(crewPost).values({
      author: data.author,
      avatar: data.avatar,
      content: data.content,
      likes: 0,
      comments: 0,
    });
    revalidatePath('/keuru-gongji-pideu');
    return { success: true };
  } catch {
    return { error: 'DB 오류가 발생했습니다.' };
  }
}

export async function likePost(postId: number) {
  try {
    const [post] = await db.select().from(crewPost).where(eq(crewPost.id, postId));
    if (post) {
      await db
        .update(crewPost)
        .set({ likes: post.likes + 1 })
        .where(eq(crewPost.id, postId));
    }
    revalidatePath('/keuru-gongji-pideu');
    return { success: true };
  } catch {
    return { error: 'DB 오류가 발생했습니다.' };
  }
}
