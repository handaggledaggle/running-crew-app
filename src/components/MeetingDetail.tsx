'use client'
import { useState, useTransition } from 'react'
import Link from 'next/link'
import { joinMeeting, cancelParticipation } from '@/lib/actions/participants'

export type MeetingDisplayData = {
  id: string
  title: string
  date: string
  location: string
  pace: string
  distance: string
  slots: number
  joined: number
  description: string
}

export default function MeetingDetail({ meeting }: { meeting: MeetingDisplayData }) {
  const [joined, setJoined] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState('')

  function handleJoin() {
    startTransition(async () => {
      const result = await joinMeeting(meeting.id)
      if ('ok' in result) {
        setJoined(true)
        setMessage('참가 신청이 완료되었습니다!')
      } else if ('already' in result) {
        setJoined(true)
        setMessage('이미 참가 신청한 모임입니다.')
      } else {
        setMessage('오류가 발생했습니다. 다시 시도해주세요.')
      }
    })
  }

  function handleCancel() {
    startTransition(async () => {
      const result = await cancelParticipation(meeting.id)
      if ('ok' in result) {
        setJoined(false)
        setMessage('참가가 취소되었습니다.')
      }
    })
  }

  return (
    <div>
      <div style={{ background: '#FF6B35', padding: '20px 16px 24px', color: '#fff', position: 'relative' }}>
        <Link href="/page-1" style={{ color: '#fff', textDecoration: 'none', fontSize: 14 }}>← 목록으로</Link>
        <h1 style={{ margin: '8px 0 0', fontSize: 20, fontWeight: 700 }}>{meeting.title}</h1>
        <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>{meeting.date} · {meeting.location}</div>
      </div>

      <div style={{ padding: 16 }}>
        <div style={{ background: '#fff', borderRadius: 14, padding: 16, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              ['📍 장소', meeting.location],
              ['⚡ 페이스', meeting.pace],
              ['📏 거리', meeting.distance],
              ['👥 정원', `${meeting.joined}/${meeting.slots}명`],
            ].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 2 }}>{k}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{v}</div>
              </div>
            ))}
          </div>
          {meeting.description && (
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #eee', fontSize: 13, color: '#555' }}>
              {meeting.description}
            </div>
          )}
        </div>

        {message && (
          <div style={{ marginBottom: 12, padding: '12px 14px', background: '#FFF3EE', borderRadius: 10, color: '#FF6B35', fontSize: 14, fontWeight: 600 }}>
            {message}
          </div>
        )}

        <button
          onClick={joined ? handleCancel : handleJoin}
          disabled={isPending}
          style={{ width: '100%', padding: '16px', borderRadius: 12, border: 'none', background: joined ? '#eee' : '#FF6B35', color: joined ? '#555' : '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', marginBottom: 12, opacity: isPending ? 0.6 : 1 }}>
          {isPending ? '처리 중...' : joined ? '✓ 참가 취소하기' : '참가 신청하기'}
        </button>

        {joined && (
          <Link href="/page-3">
            <button style={{ width: '100%', padding: '14px', borderRadius: 12, border: '2px solid #FF6B35', background: '#fff', color: '#FF6B35', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 12 }}>
              참가자 명단 보기 →
            </button>
          </Link>
        )}
      </div>
    </div>
  )
}
