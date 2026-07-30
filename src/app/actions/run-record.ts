'use server';

import { db } from '@/db';
import { runRecord } from '@/db/schema';
import { revalidatePath } from 'next/cache';

export async function saveRunRecord(data: {
  date: string;
  distance: number;
  duration: number;
  userId?: string;
}) {
  try {
    await db.insert(runRecord).values({
      date: data.date,
      distance: data.distance,
      duration: data.duration,
      userId: data.userId ?? 'default-user',
    });
    revalidatePath('/reoning-hu-girok-ipryeokgwa-nujeok-geori-pyosi');
    return { success: true };
  } catch {
    return { error: 'DB 오류가 발생했습니다.' };
  }
}
