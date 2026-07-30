'use client';
import { useState, useTransition, useRef } from 'react';
import BottomNav from '@/components/BottomNav';
import { createNoticeAction, likeNoticeAction } from '@/app/actions';
import type { NoticeRow } from '@/app/actions';

export default function FeedClient({ initialNotices }: { initialNotices: NoticeRow[] }) {
  const [notices, setNotices] = useState(initialNotices);
  const [showModal, setShowModal] = useState(false);
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const [isPending, startTransition] = useTransition();
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  function toggleLike(id: number) {
    const wasLiked = likedIds.has(id);
    setLikedIds(prev => {
      const s = new Set(prev);
      wasLiked ? s.delete(id) : s.add(id);
      return s;
    });
    if (!wasLiked) {
      startTransition(async () => {
        await likeNoticeAction(id);
      });
    }
  }

  function handlePost() {
    const title = titleRef.current?.value.trim() ?? '';
    const content = contentRef.current?.value.trim() ?? '';
    if (!title || !content) return;

    const today = new Date().toISOString().slice(0, 10);
    const optimistic: NoticeRow = {
      id: Date.now(),
      author: '나',
      date: today,
      title,
      content,
      likes: 0,
      comments: 0,
    };
    setNotices(prev => [optimistic, ...prev]);
    setShowModal(false);

    const formData = new FormData();
    formData.set('title', title);
    formData.set('content', content);
    startTransition(async () => {
      await createNoticeAction(formData);
    });
  }

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ background: '#FF6B35', padding: '20px 16px 16px', color: '#fff' }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>📣 마포 러닝크루</div>
        <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>멤버 23명 · 서울 마포구 활동</div>
      </div>

      <div style={{ padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {notices.map(n => (
          <div key={n.id} style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#FF6B35', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13 }}>
                {n.author[0]}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{n.author}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>{n.date}</div>
              </div>
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{n.title}</div>
            <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>{n.content}</div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12, paddingTop: 10, borderTop: '1px solid #F3F4F6' }}>
              <button
                onClick={() => toggleLike(n.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: likedIds.has(n.id) ? '#EF4444' : '#9CA3AF', display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}
              >
                {likedIds.has(n.id) ? '❤️' : '🤍'} {n.likes + (likedIds.has(n.id) ? 1 : 0)}
              </button>
              <span style={{ fontSize: 13, color: '#9CA3AF' }}>💬 {n.comments}</span>
            </div>
          </div>
        ))}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowModal(true)}
        style={{ position: 'fixed', right: 20, bottom: 80, width: 52, height: 52, borderRadius: '50%', background: '#FF6B35', color: '#fff', border: 'none', fontSize: 24, cursor: 'pointer', boxShadow: '0 4px 12px rgba(255,107,53,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        +
      </button>

      {/* Post modal */}
      {showModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 200 }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{ background: '#fff', borderRadius: '16px 16px 0 0', padding: 20, width: '100%', boxSizing: 'border-box' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>공지 작성</div>
            <input
              ref={titleRef}
              placeholder="제목"
              style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 14, marginBottom: 10, outline: 'none' }}
            />
            <textarea
              ref={contentRef}
              placeholder="내용을 입력하세요"
              rows={4}
              style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 14, resize: 'none', outline: 'none', marginBottom: 12 }}
            />
            <button
              onClick={handlePost}
              disabled={isPending}
              style={{ width: '100%', background: isPending ? '#9CA3AF' : '#FF6B35', color: '#fff', border: 'none', borderRadius: 10, padding: '13px', fontSize: 15, fontWeight: 700, cursor: isPending ? 'default' : 'pointer' }}
            >
              게시하기
            </button>
          </div>
        </div>
      )}
      <BottomNav />
    </div>
  );
}
