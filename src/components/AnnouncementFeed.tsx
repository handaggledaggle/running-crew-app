'use client'
import { useState, useTransition } from 'react'
import { postAnnouncement } from '@/lib/actions/announcements'

export type NoticeDisplay = {
  id: string
  title: string
  content: string
  date: string
  author: string
}

export default function AnnouncementFeed({
  initialNotices,
  crewName,
  memberCount,
  totalKm,
}: {
  initialNotices: NoticeDisplay[]
  crewName: string
  memberCount: number
  totalKm: number
}) {
  const [notices, setNotices] = useState(initialNotices)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [showWrite, setShowWrite] = useState(false)
  const [posted, setPosted] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function handlePost(formData: FormData) {
    setError('')
    startTransition(async () => {
      const result = await postAnnouncement(formData)
      if ('ok' in result) {
        const title = formData.get('title') as string
        const content = formData.get('content') as string
        const now = new Date()
        setNotices(prev => [{
          id: Date.now().toString(),
          title,
          content,
          date: `${now.getMonth() + 1}/${now.getDate()}`,
          author: '크루장 김민준',
        }, ...prev])
        setPosted(true)
        setShowWrite(false)
      } else if ('error' in result) {
        setError(result.error)
      }
    })
  }

  return (
    <div>
      <div style={{ background: '#FF6B35', padding: '20px 16px 24px', color: '#fff' }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{crewName} 📣</h1>
        <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>멤버 {memberCount}명 · 누적 {totalKm}km</div>
      </div>

      <div style={{ padding: 16 }}>
        {posted && (
          <div style={{ marginBottom: 12, padding: '12px 14px', background: '#FFF3EE', borderRadius: 10, color: '#FF6B35', fontSize: 14, fontWeight: 600 }}>
            ✅ 공지가 게시되었습니다!
          </div>
        )}

        {!showWrite && (
          <button onClick={() => setShowWrite(true)}
            style={{ width: '100%', padding: '14px', borderRadius: 12, border: '2px dashed #FF6B35', background: '#FFF3EE', color: '#FF6B35', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginBottom: 16 }}>
            + 새 공지 작성하기 (리더 전용)
          </button>
        )}

        {showWrite && (
          <div style={{ background: '#fff', borderRadius: 14, padding: 16, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>공지 작성</div>
            <form action={handlePost}>
              <input name="title" placeholder="공지 제목"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box', marginBottom: 10 }} />
              <textarea name="content" placeholder="공지 내용을 입력하세요"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box', resize: 'none', minHeight: 100, marginBottom: 12 }} />
              {error && <div style={{ color: '#EF4444', fontSize: 13, marginBottom: 8 }}>{error}</div>}
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={() => setShowWrite(false)}
                  style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1px solid #ddd', background: '#fff', color: '#555', fontSize: 14, cursor: 'pointer' }}>
                  취소
                </button>
                <button type="submit" disabled={isPending}
                  style={{ flex: 2, padding: '12px', borderRadius: 12, border: 'none', background: '#FF6B35', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', opacity: isPending ? 0.6 : 1 }}>
                  {isPending ? '게시 중...' : '공지 게시'}
                </button>
              </div>
            </form>
          </div>
        )}

        {notices.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px', color: '#aaa', fontSize: 14 }}>
            아직 공지사항이 없습니다.
          </div>
        )}

        {notices.map(n => (
          <div key={n.id}
            onClick={() => setExpanded(expanded === n.id ? null : n.id)}
            style={{ background: '#fff', borderRadius: 14, padding: '16px', marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a', marginBottom: 4 }}>{n.title}</div>
                <div style={{ fontSize: 12, color: '#888' }}>{n.author} · {n.date}</div>
              </div>
              <span style={{ fontSize: 14, color: '#ccc', marginLeft: 8 }}>{expanded === n.id ? '▲' : '▼'}</span>
            </div>
            {expanded === n.id && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #eee', fontSize: 14, color: '#444', lineHeight: 1.6 }}>
                {n.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
