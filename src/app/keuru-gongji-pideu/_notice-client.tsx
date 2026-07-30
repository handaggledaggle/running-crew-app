'use client';
import { useState } from 'react';
import BottomNav from '@/components/BottomNav';
import { toggleNoticeLike, addNoticeComment } from '@/lib/actions';
import type { NoticeItem } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function NoticeClient({ initialNotices }: { initialNotices: NoticeItem[] }) {
  const [notices, setNotices] = useState<NoticeItem[]>(initialNotices);
  const [comments, setComments] = useState<Record<number, string>>({});
  const [expandedComments, setExpandedComments] = useState<number[]>([]);
  const [sending, setSending] = useState<number | null>(null);

  const handleLike = async (id: number) => {
    // Optimistic update
    setNotices((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, liked: !n.liked, likes: n.liked ? n.likes - 1 : n.likes + 1 }
          : n,
      ),
    );
    await toggleNoticeLike(id);
  };

  const toggleComments = (id: number) => {
    setExpandedComments((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const handleSendComment = async (id: number) => {
    const content = comments[id]?.trim();
    if (!content) return;
    setSending(id);
    // Optimistic: increment comment count
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, comments: n.comments + 1 } : n)),
    );
    setComments((prev) => ({ ...prev, [id]: '' }));
    await addNoticeComment(id, content);
    setSending(null);
  };

  return (
    <div className="bg-page-bg min-h-screen font-sans" style={{ maxWidth: 430, margin: '0 auto' }}>
      <div
        className="bg-brand flex justify-between items-center"
        style={{ padding: '16px 20px' }}
      >
        <div className="text-white font-bold" style={{ fontSize: 18 }}>크루 공지 피드</div>
        <div className="rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 12px' }}>
          <span className="text-white font-semibold" style={{ fontSize: 12 }}>한강 러닝 크루</span>
        </div>
      </div>

      <div style={{ padding: '16px', paddingBottom: 80 }}>
        {notices.length === 0 && (
          <div className="text-muted-foreground text-center" style={{ padding: '60px 0' }}>
            <div style={{ fontSize: 40 }}>[ ]</div>
            <div style={{ marginTop: 12 }}>공지가 없어요</div>
          </div>
        )}
        {notices.map((n) => (
          <div
            key={n.id}
            className="bg-white rounded-xl overflow-hidden"
            style={{
              marginBottom: 14,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ padding: '16px 16px 12px' }}>
              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 34 }}>{n.avatar}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="font-bold" style={{ fontSize: 14 }}>{n.author}</span>
                    <span
                      className="bg-brand-tint text-brand font-semibold"
                      style={{ fontSize: 10, padding: '1px 6px', borderRadius: 6 }}
                    >
                      {n.role}
                    </span>
                  </div>
                  <div className="text-muted-foreground" style={{ fontSize: 12, marginTop: 1 }}>{n.time}</div>
                </div>
              </div>
              {/* Content */}
              <div className="text-ink" style={{ fontSize: 15, lineHeight: 1.6 }}>{n.content}</div>
            </div>

            {/* Actions */}
            <div
              className="border-t border-border flex gap-4"
              style={{ padding: '10px 16px' }}
            >
              <button
                onClick={() => handleLike(n.id)}
                className={cn(
                  'bg-transparent border-none cursor-pointer flex items-center gap-1',
                  n.liked ? 'text-brand font-bold' : 'text-muted-foreground font-normal',
                )}
                style={{ fontSize: 13 }}
              >
                <span style={{ fontSize: 18, color: n.liked ? '#ef4444' : undefined }}>{n.liked ? 'v' : 'o'}</span> {n.likes}
              </button>
              <button
                onClick={() => toggleComments(n.id)}
                className="bg-transparent border-none cursor-pointer flex items-center gap-1 text-muted-foreground"
                style={{ fontSize: 13 }}
              >
                <span style={{ fontSize: 18 }}>댓</span> {n.comments}
              </button>
            </div>

            {/* Comment Input */}
            {expandedComments.includes(n.id) && (
              <div
                className="border-t border-border flex gap-2"
                style={{ padding: '10px 16px' }}
              >
                <input
                  value={comments[n.id] || ''}
                  onChange={(e) => setComments((prev) => ({ ...prev, [n.id]: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendComment(n.id)}
                  placeholder="댓글 달기..."
                  className="flex-1 border border-border rounded-full outline-none"
                  style={{ padding: '8px 12px', fontSize: 13 }}
                />
                <button
                  onClick={() => handleSendComment(n.id)}
                  disabled={sending === n.id}
                  className="bg-brand text-white border-none rounded-full font-bold cursor-pointer"
                  style={{ padding: '8px 14px', fontSize: 13 }}
                >
                  전송
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <BottomNav />
    </div>
  );
}
