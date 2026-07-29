'use client'
import { useState, useTransition } from 'react'
import Link from 'next/link'
import { toggleAttendance } from '@/lib/actions/participants'

export type AttendeeDisplay = {
  id: string
  name: string
  avatar: string
  attended: boolean
}

export default function AttendancePanel({
  meetingTitle,
  meetingDate,
  initialAttendees,
}: {
  meetingTitle: string
  meetingDate: string
  initialAttendees: AttendeeDisplay[]
}) {
  const [list, setList] = useState(initialAttendees)
  const [isPending, startTransition] = useTransition()
  const checkedCount = list.filter(a => a.attended).length

  function handleToggle(id: string, current: boolean) {
    setList(l => l.map(a => a.id === id ? { ...a, attended: !a.attended } : a))
    startTransition(async () => {
      await toggleAttendance(id, !current)
    })
  }

  return (
    <div>
      <div style={{ background: '#FF6B35', padding: '20px 16px 24px', color: '#fff' }}>
        <Link href="/page-2" style={{ color: '#fff', textDecoration: 'none', fontSize: 14 }}>← 모임으로</Link>
        <h1 style={{ margin: '8px 0 0', fontSize: 20, fontWeight: 700 }}>출석 체크</h1>
        <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>{meetingTitle} · {meetingDate}</div>
      </div>

      <div style={{ padding: 16 }}>
        <div style={{ background: '#fff', borderRadius: 14, padding: 16, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#FF6B35' }}>{list.length}</div>
            <div style={{ fontSize: 12, color: '#888' }}>총 신청</div>
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#22C55E' }}>{checkedCount}</div>
            <div style={{ fontSize: 12, color: '#888' }}>출석</div>
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#EF4444' }}>{list.length - checkedCount}</div>
            <div style={{ fontSize: 12, color: '#888' }}>미확인</div>
          </div>
        </div>

        {list.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 16px', color: '#aaa', fontSize: 14 }}>
            참가 신청자가 없습니다.
          </div>
        )}

        {list.map(a => (
          <div key={a.id}
            onClick={() => !isPending && handleToggle(a.id, a.attended)}
            style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', marginBottom: 10, boxShadow: '0 2px 6px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', opacity: isPending ? 0.7 : 1 }}>
            <span style={{ fontSize: 28 }}>{a.avatar}</span>
            <div style={{ flex: 1, fontWeight: 600, fontSize: 15 }}>{a.name}</div>
            <div style={{ width: 28, height: 28, borderRadius: '50%', border: `2px solid ${a.attended ? '#22C55E' : '#ddd'}`, background: a.attended ? '#22C55E' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, fontWeight: 700 }}>
              {a.attended ? '✓' : ''}
            </div>
          </div>
        ))}

        <Link href="/page-4">
          <button style={{ width: '100%', marginTop: 8, padding: '16px', borderRadius: 12, border: 'none', background: '#FF6B35', color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
            출석 완료 · 기록 저장하러 가기 →
          </button>
        </Link>
      </div>
    </div>
  )
}
