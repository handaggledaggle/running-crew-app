'use client'
import { useState, useTransition } from 'react'
import { saveRunningRecord } from '@/lib/actions/records'

export type RunRecord = {
  id: string
  date: string
  distance: number
  duration: string
  memo: string
}

export default function RunRecordPanel({
  initialRecords,
  totalKm,
  thisMonthKm,
}: {
  initialRecords: RunRecord[]
  totalKm: number
  thisMonthKm: number
}) {
  const [records, setRecords] = useState(initialRecords)
  const [total, setTotal] = useState(totalKm)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSave(formData: FormData) {
    setError('')
    startTransition(async () => {
      const result = await saveRunningRecord(formData)
      if ('ok' in result) {
        const dist = parseFloat((formData.get('distance') as string) || '0')
        const dur = (formData.get('duration') as string) || ''
        const memo = (formData.get('memo') as string) || ''
        const date = (formData.get('date') as string) || ''
        setRecords(prev => [{ id: Date.now().toString(), date, distance: dist, duration: dur, memo }, ...prev])
        setTotal(prev => prev + dist)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else if ('error' in result) {
        setError(result.error)
      }
    })
  }

  return (
    <div>
      <div style={{ background: '#FF6B35', padding: '20px 16px 24px', color: '#fff' }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>내 러닝 기록 📊</h1>
        <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>누적 거리와 달리기 기록을 확인하세요</div>
      </div>

      <div style={{ padding: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
          {[
            ['🏃 누적 거리', `${total.toFixed(1)}km`],
            ['📅 총 횟수', `${records.length}회`],
            ['🔥 이번 달', `${thisMonthKm.toFixed(1)}km`],
          ].map(([label, val]) => (
            <div key={label} style={{ background: '#fff', borderRadius: 12, padding: '14px 12px', textAlign: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#FF6B35' }}>{val}</div>
              <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: 14, padding: 16, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>기록 추가</div>
          <form action={handleSave}>
            {[
              { label: '날짜', name: 'date', ph: '예: 7/29' },
              { label: '거리 (km)', name: 'distance', ph: '예: 5.2' },
              { label: '시간 (분:초)', name: 'duration', ph: '예: 32:10' },
            ].map(({ label, name, ph }) => (
              <div key={name} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{label}</div>
                <input name={name} placeholder={ph}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box' }} />
              </div>
            ))}
            <input name="memo" placeholder="메모 (선택)"
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box', marginBottom: 12 }} />
            {error && <div style={{ color: '#EF4444', fontSize: 13, marginBottom: 8 }}>{error}</div>}
            <button type="submit" disabled={isPending}
              style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: saved ? '#22C55E' : '#FF6B35', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', opacity: isPending ? 0.6 : 1 }}>
              {isPending ? '저장 중...' : saved ? '✅ 저장 완료!' : '기록 저장'}
            </button>
          </form>
        </div>

        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>최근 기록</div>
        {records.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px', color: '#aaa', fontSize: 14 }}>
            아직 저장된 기록이 없습니다.
          </div>
        )}
        {records.map(r => (
          <div key={r.id} style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', marginBottom: 10, boxShadow: '0 2px 6px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{r.memo || '러닝 기록'}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{r.date}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#FF6B35' }}>{r.distance}km</div>
              <div style={{ fontSize: 12, color: '#888' }}>{r.duration}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
