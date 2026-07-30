'use client';
import { useState, useEffect, useTransition } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { createCrewPost, likePost } from '@/app/actions/crew-post';

type Post = {
  id: string;
  author: string;
  avatar: string;
  content: string;
  time: string;
  likes: number;
  comments: number;
};

export default function CrewFeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [compose, setCompose] = useState('');
  const [submitMsg, setSubmitMsg] = useState('');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetch('/api/crew-posts')
      .then((r) => r.json())
      .then((data: Post[]) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const submit = () => {
    if (!compose.trim()) return;
    const newPost: Post = {
      id: String(Date.now()),
      author: '리더 나',
      avatar: '나',
      content: compose,
      time: '방금',
      likes: 0,
      comments: 0,
    };
    // Optimistic update
    setPosts([newPost, ...posts]);
    setCompose('');

    startTransition(async () => {
      const result = await createCrewPost({
        author: newPost.author,
        avatar: newPost.avatar,
        content: newPost.content,
      });
      if ('error' in result && result.error) {
        setSubmitMsg(result.error);
        // Rollback optimistic update
        setPosts((prev) => prev.filter((p) => p.id !== newPost.id));
      }
    });
  };

  const handleLike = (post: Post) => {
    // Optimistic update
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, likes: p.likes + 1 } : p))
    );
    startTransition(async () => {
      await likePost(Number(post.id));
    });
  };

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ background: 'var(--primary)', padding: '20px 16px 20px', color: '#fff' }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>크루 공지 피드</div>
        <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>올림픽공원 런 크루 · 멤버 24명</div>
      </div>

      <div style={{ padding: '16px', background: '#fff', margin: '16px', borderRadius: 16, boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
        <textarea
          value={compose}
          onChange={(e) => setCompose(e.target.value)}
          placeholder="공지사항이나 일정을 입력하세요..."
          rows={3}
          style={{ width: '100%', border: '1px solid #E5E5E5', borderRadius: 10, padding: '12px', fontSize: 14, resize: 'none', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
        />
        <Button
          onClick={submit}
          disabled={isPending || !compose.trim()}
          style={{ marginTop: 8, background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 24px', fontWeight: 700, fontSize: 14, cursor: isPending ? 'not-allowed' : 'pointer', float: 'right', opacity: isPending || !compose.trim() ? 0.7 : 1, height: 'auto' }}
        >
          {isPending ? '올리는 중...' : '공지 올리기'}
        </Button>
        <div style={{ clear: 'both' }} />
        {submitMsg && (
          <div style={{ textAlign: 'center', marginTop: 8, color: 'var(--primary)', fontSize: 13 }}>{submitMsg}</div>
        )}
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading && <div style={{ textAlign: 'center', color: '#6B6B6B', padding: 20 }}>불러오는 중...</div>}
        {posts.map((p) => (
          <div key={p.id} style={{ background: '#fff', borderRadius: 16, padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                {p.avatar}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{p.author}</div>
                <div style={{ fontSize: 12, color: '#6B6B6B' }}>{p.time}</div>
              </div>
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.6, color: '#1A1A1A', marginBottom: 12 }}>{p.content}</div>
            <div style={{ display: 'flex', gap: 16, borderTop: '1px solid #E5E5E5', paddingTop: 10 }}>
              <Button
                onClick={() => handleLike(p)}
                variant="ghost"
                style={{ background: 'none', border: 'none', color: '#6B6B6B', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, height: 'auto', padding: '4px 8px' }}
              >
                <Heart size={13} /> {p.likes}
              </Button>
              <Button
                variant="ghost"
                style={{ background: 'none', border: 'none', color: '#6B6B6B', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, height: 'auto', padding: '4px 8px' }}
              >
                <MessageCircle size={13} /> {p.comments}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
