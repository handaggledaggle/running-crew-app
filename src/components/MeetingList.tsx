'use client'
import { useState, useTransition } from 'react'
import Link from 'next/link'
import { createMeeting } from '@/lib/actions/meetings'

export type MeetingDisplay = {
  id: string
  title: string
  date: string
  location: string
  pace: string
  slots: number
  joined: number
  distance: string
  tags: string[]
}

const paceFilters = ['전체', '초급', '중급', '중상급']
const areaFilters = ['전체', '서울 마포', '서울 영등포', '서울 강북']

export default function MeetingList({ initialMeetings }: { initialMeetings: MeetingDisplay[] }) {
  const [pace, setPace] = useState('전체')
  const [area, setArea] = useState('전체')
  const [showCreate, setShowCreate] = useState(false)
  const [created, setCreated] = useState(false)
  const [isPending, startTransition] = useTransition()

  const filtered = initialMeetings.filter(m =>
    (pace === '전체' || m.tags.includes(pace)) &&
    (area === '전체' || m.tags.includes(area))
  )

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      const result = await createMeeting(formData)
      if ('ok' in result) {
        setCreated(true)
        setShowCreate(false)
      }
    })
  }

  return (
    <div>
      <div style={{ background: '#FF6B35', padding: '20px 16px 16px', color: '#fff' }}>
        <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 4 }}>내 동네 · 서울 마포</div>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>오늘 함께 달릴까요? 🏃</h1>
        <div style={{ marginTop: 12, background: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>🔍</span>
          <input placeholder="지역명이나 크루명 검색" style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 14, flex: 1 }} />
        </div>
      </div>

      <div style={{ padding: '12px 16px 4px' }}>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {paceFilters.map(p => (
            <button key={p} onClick={() => setPace(p)}
              style={{ whiteSpace: 'nowrap', padding: '6px 14px', borderRadius: 20, border: 'none', background: pace === p ? '#FF6B35' : '#eee', color: pace === p ? '#fff' : '#555', fontSize: 13, cursor: 'pointer', fontWeight: pace === p ? 700 : 400 }}>
              {p}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginTop: 6, paddingBottom: 4 }}>
          {areaFilters.map(a => (
            <button key={a} onClick={() => setArea(a)}
              style={{ whiteSpace: 'nowrap', padding: '6px 14px', borderRadius: 20, border: 'none', background: area === a ? '#333' : '#eee', color: area === a ? '#fff' : '#555', fontSize: 13, cursor: 'pointer' }}>
              {a}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '8px 16px' }}>
        {created && (
          <div style={{ marginBottom: 12, padding: '12px 14px', background: '#FFF3EE', borderRadius: 10, color: '#FF6B35', fontSize: 14, fontWeight: 600 }}>
            ✅ 모임이 개설되었습니다!
          </div>
        )}
        {filtered.map(m => (
          <Link key={m.id} href="/page-2" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', borderRadius: 14, padding: '16px', marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: '#1a1a1a', marginBottom: 4 }}>{m.title}</div>
                  <div style={{ fontSize: 13, color: '#888' }}>{m.date} · {m.location}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#FF6B35' }}>{m.pace}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>{m.distance}</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {m.tags.map(t => (
                    <span key={t} style={{ background: '#FFF3EE', color: '#FF6B35', fontSize: 11, padding: '3px 8px', borderRadius: 10, fontWeight: 600 }}>{t}</span>
                  ))}
                </div>
                <div style={{ fontSize: 12, color: '#888' }}>참가 {m.joined}/{m.slots}명</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {showCreate && (
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>새 모임 개설</div>
            <form action={handleCreate}>
              {[
                { label: '제목 *', name: 'title', ph: '예: 홍대 저녁 러닝' },
                { label: '날짜·시간 *', name: 'dateTime', ph: '예: 오늘 19:30' },
                { label: '장소 *', name: 'location', ph: '예: 홍대 걷고싶은거리' },
                { label: '목표 페이스 *', name: 'pace', ph: '예: 6:00/km' },
                { label: '거리 (km)', name: 'distance', ph: '예: 5' },
                { label: '정원', name: 'slots', ph: '예: 10' },
              ].map(({ label, name, ph }) => (
                <div key={name} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{label}</div>
                  <input name={name} placeholder={ph}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box' }} />
                </div>
              ))}
              <textarea name="description" placeholder="모임 소개 (선택)"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box', resize: 'none', minHeight: 72, marginBottom: 12 }} />
              <button type="submit" disabled={isPending}
                style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: '#FF6B35', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', opacity: isPending ? 0.6 : 1 }}>
                {isPending ? '개설 중...' : '모임 개설 완료'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div style={{ position: 'fixed', bottom: 80, right: 20 }}>
        <button onClick={() => setShowCreate(!showCreate)}
          style={{ width: 56, height: 56, borderRadius: '50%', background: '#FF6B35', border: 'none', color: '#fff', fontSize: 28, cursor: 'pointer', boxShadow: '0 4px 16px rgba(255,107,53,0.4)' }}>
          {showCreate ? '×' : '+'}
        </button>
      </div>
    </div>
  )
}
