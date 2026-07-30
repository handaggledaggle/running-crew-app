'use client';
import { useState, useTransition } from 'react';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Pin, Heart, MessageCircle, X } from 'lucide-react';
import { type NoticeRow, createNotice, toggleNoticeLike } from '@/app/actions/notices';

type Props = { initialNotices: NoticeRow[] };

export default function NoticeClient({ initialNotices }: Props) {
  const [notices, setNotices] = useState(initialNotices);
  const [showCompose, setShowCompose] = useState(false);
  const [composeTitle, setComposeTitle] = useState('');
  const [composeContent, setComposeContent] = useState('');
  const [toast, setToast] = useState('');
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  function handlePost() {
    if (!composeTitle.trim()) return;
    const newNotice: NoticeRow = {
      id: `n${Date.now()}`,
      title: composeTitle,
      content: composeContent,
      date: new Date().toISOString().slice(0, 10),
      likes: 0,
      comments: 0,
    };
    setNotices([newNotice, ...notices]);
    setComposeTitle('');
    setComposeContent('');
    setShowCompose(false);
    showToast('공지가 크루원에게 전송되었습니다!');
    startTransition(async () => {
      await createNotice(newNotice.title, newNotice.content);
    });
  }

  function handleToggleLike(n: NoticeRow) {
    const wasLiked = likes[n.id] ?? false;
    setLikes((prev) => ({ ...prev, [n.id]: !wasLiked }));
    setNotices((prev) =>
      prev.map((item) =>
        item.id === n.id ? { ...item, likes: item.likes + (wasLiked ? -1 : 1) } : item
      )
    );
    startTransition(async () => {
      const noticeIdNum = parseInt(n.id);
      if (!isNaN(noticeIdNum)) {
        await toggleNoticeLike(noticeIdNum, wasLiked);
      }
    });
  }

  return (
    <div className="min-h-screen bg-muted pb-20" style={{ maxWidth: 480, margin: '0 auto' }}>
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-foreground text-primary-foreground text-sm px-5 py-3 rounded-full shadow-lg">
          {toast}
        </div>
      )}

      {showCompose && (
        <div className="fixed inset-0 bg-black/40 z-50 flex flex-col justify-end">
          <div className="bg-card rounded-t-3xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-foreground text-base">공지 작성</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCompose(false)}
                className="text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <input
              value={composeTitle}
              onChange={(e) => setComposeTitle(e.target.value)}
              placeholder="공지 제목"
              className="w-full bg-muted rounded-xl px-4 py-2.5 text-sm outline-none mb-3 focus:ring-2 focus:ring-brand"
            />
            <textarea
              rows={4}
              value={composeContent}
              onChange={(e) => setComposeContent(e.target.value)}
              placeholder="공지 내용을 입력하세요"
              className="w-full bg-muted rounded-xl px-4 py-2.5 text-sm outline-none mb-4 resize-none focus:ring-2 focus:ring-brand"
            />
            <Button
              onClick={handlePost}
              disabled={isPending}
              className="w-full bg-brand text-brand-foreground font-bold py-3.5 rounded-2xl hover:bg-brand/80 transition-colors disabled:opacity-60 h-auto"
            >
              공지 올리고 푸시 발송
            </Button>
          </div>
        </div>
      )}

      <div className="bg-card px-4 pt-12 pb-4 shadow-sm sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-lg text-foreground">크루 공지</h1>
          <Button
            onClick={() => setShowCompose(true)}
            size="sm"
            className="bg-brand text-brand-foreground text-xs font-bold px-3 py-1.5 rounded-full hover:bg-brand/80 transition-colors h-auto"
          >
            + 공지 작성
          </Button>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {notices.map((n) => (
          <div key={n.id} className="bg-card rounded-2xl p-4 shadow-sm">
            {n.isPinned && (
              <span className="inline-flex items-center gap-1 text-xs bg-brand-muted text-brand font-semibold px-2 py-0.5 rounded-full mr-2">
                <Pin className="w-3 h-3" /> 고정
              </span>
            )}
            <h3 className="font-bold text-foreground mt-1">{n.title}</h3>
            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">{n.content}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-muted-foreground">{n.date}</span>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleLike(n)}
                  className={`flex items-center gap-1 text-xs transition-colors h-auto px-1 py-0 ${
                    likes[n.id] ? 'text-brand font-semibold' : 'text-muted-foreground'
                  }`}
                >
                  <Heart className={`w-3 h-3 ${likes[n.id] ? 'fill-brand' : ''}`} /> {n.likes}
                </Button>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MessageCircle className="w-3 h-3" /> {n.comments}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
