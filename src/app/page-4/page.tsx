import RunRecordPanel, { type RunRecord } from '@/components/RunRecordPanel'
import { getRunningRecords } from '@/lib/actions/records'
import { runHistory as mockHistory } from '@/lib/data'

export default async function Page4() {
  let displayRecords: RunRecord[]
  let totalKm: number
  let thisMonthKm: number

  try {
    const dbRecords = await getRunningRecords()
    if (dbRecords.length > 0) {
      displayRecords = dbRecords.map(r => ({
        id: r.id,
        date: r.recordedAt,
        distance: r.distanceKm,
        duration: `${Math.floor(r.durationMinutes / 60)}:${String(r.durationMinutes % 60).padStart(2, '0')}`,
        memo: r.memo ?? '',
      }))
      totalKm = dbRecords.reduce((s, r) => s + r.distanceKm, 0)
      const thisMonth = new Date().getMonth() + 1
      thisMonthKm = dbRecords
        .filter(r => r.recordedAt.startsWith(`${thisMonth}/`) || r.createdAt.getMonth() + 1 === thisMonth)
        .reduce((s, r) => s + r.distanceKm, 0)
    } else {
      displayRecords = mockHistory.map(r => ({ id: r.id, date: r.date, distance: r.distance, duration: r.duration, memo: r.memo }))
      totalKm = mockHistory.reduce((s, r) => s + r.distance, 0)
      thisMonthKm = 23.7
    }
  } catch {
    displayRecords = mockHistory.map(r => ({ id: r.id, date: r.date, distance: r.distance, duration: r.duration, memo: r.memo }))
    totalKm = mockHistory.reduce((s, r) => s + r.distance, 0)
    thisMonthKm = 23.7
  }

  return (
    <RunRecordPanel
      initialRecords={displayRecords}
      totalKm={totalKm}
      thisMonthKm={thisMonthKm}
    />
  )
}
