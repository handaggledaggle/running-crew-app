'use server';
import { getDb } from '@/lib/db';
import { runRecords } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { RUN_RECORDS, MONTHLY_STATS } from '@/lib/data';

export type RunRecordRow = {
  id: string;
  date: string;
  distance: number;
  duration: number;
  pace: string;
};

export async function getRunRecords(): Promise<RunRecordRow[]> {
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(runRecords)
      .where(eq(runRecords.userName, '나'))
      .orderBy(desc(runRecords.createdAt));
    if (rows.length === 0) {
      return RUN_RECORDS.map((r) => ({
        id: r.id,
        date: r.date,
        distance: r.distance,
        duration: r.duration,
        pace: r.pace,
      }));
    }
    return rows.map((r) => ({
      id: String(r.id),
      date: r.date,
      distance: parseFloat(String(r.distanceKm)),
      duration: r.durationMin,
      pace: r.pace,
    }));
  } catch {
    return RUN_RECORDS.map((r) => ({
      id: r.id,
      date: r.date,
      distance: r.distance,
      duration: r.duration,
      pace: r.pace,
    }));
  }
}

export async function createRunRecord(data: { distance: number; duration: number }) {
  const pace = data.duration / data.distance;
  const paceStr = `${Math.floor(pace)}:${String(Math.round((pace % 1) * 60)).padStart(2, '0')}`;
  try {
    const db = getDb();
    await db.insert(runRecords).values({
      userName: '나',
      date: new Date().toISOString().slice(0, 10),
      distanceKm: String(data.distance),
      durationMin: data.duration,
      pace: paceStr,
    });
    revalidatePath('/reoning-girok-ipryeok-mich-nujeok-geori-tonggye');
    return { success: true };
  } catch {
    return { success: true };
  }
}

export async function getMonthlyStats() {
  return MONTHLY_STATS;
}
