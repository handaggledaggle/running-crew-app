'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';
import { joinMeeting, cancelMeeting } from '@/lib/actions';
import type { MeetingItem } from '@/lib/types';
import { cn } from '@/lib/utils';

type Props = {
  meeting: MeetingItem;
  initialJoined: boolean;
};

export default function JoinClient({ meeting: m, initialJoined }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'joined' | 'cancelled'>(
    initialJoined ? 'joined' : 'idle',
  );
  const [loading, setLoading] = useState(false);
  const [localJoined, setLocalJoined] = useState(m.joined + (initialJoined ? 0 : 0));

  const handleJoin = async () => {
    setLoading(true);
    await joinMeeting(m.id);
    setLocalJoined((n) => n + 1);
    setStatus('joined');
    setLoading(false);
  };

  const handleCancel = async () => {
    setLoading(true);
    await cancelMeeting(m.id);
    setLocalJoined((n) => Math.max(0, n - 1));
    setStatus('cancelled');
    setLoading(false);
  };

  const avatars = ['A', 'B', 'C', 'D', 'E', 'F'];
  const isFull = localJoined >= m.capacity;

  return (
    <div className="bg-page-bg min-h-screen font-sans" style={{ maxWidth: 430, margin: '0 auto' }}>
      <div className="bg-brand flex items-center gap-3 px-5 py-4">
        <button onClick={() => router.back()} className="bg-transparent border-none text-white cursor-pointer" style={{ fontSize: 20 }}>←</button>
        <div className="text-white font-bold" style={{ fontSize: 18 }}>모임 상세</div>
      </div>

      <div style={{ padding: 20, paddingBottom: 120 }}>
        {/* Meeting Detail Card */}
        <div className="bg-white rounded-xl" style={{ padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            <span className="bg-brand-tint text-brand font-bold" style={{ fontSize: 12, padding: '3px 10px', borderRadius: 10 }}>{m.district}</span>
            <span className="bg-forest-tint text-forest font-bold" style={{ fontSize: 12, padding: '3px 10px', borderRadius: 10 }}>{m.pace}</span>
          </div>
          <div className="font-bold text-ink" style={{ fontSize: 22, marginBottom: 16 }}>{m.title}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <span>날짜</span>
              <div>
                <div className="text-muted-foreground" style={{ fontSize: 13 }}>날짜·시간</div>
                <div className="font-semibold">{m.date} {m.time}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <span>장소</span>
              <div>
                <div className="text-muted-foreground" style={{ fontSize: 13 }}>집합 장소</div>
                <div className="font-semibold">{m.location}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <span>인원</span>
              <div>
                <div className="text-muted-foreground" style={{ fontSize: 13 }}>참가 현황</div>
                <div className="font-semibold">{localJoined}명 / 정원 {m.capacity}명</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <span>리더</span>
              <div>
                <div className="text-muted-foreground" style={{ fontSize: 13 }}>리더</div>
                <div className="font-semibold">{m.leader}</div>
              </div>
            </div>
          </div>
          {m.memo && (
            <div className="bg-brand-tint rounded-lg" style={{ marginTop: 14, padding: '10px 14px' }}>
              <div className="text-brand font-semibold" style={{ fontSize: 12, marginBottom: 4 }}>리더 메모</div>
              <div className="text-foreground" style={{ fontSize: 14 }}>{m.memo}</div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl" style={{ padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span className="text-muted-foreground" style={{ fontSize: 13 }}>참가 현황</span>
            <span className="text-brand font-bold" style={{ fontSize: 13 }}>{localJoined}/{m.capacity}명</span>
          </div>
          <div className="bg-muted rounded-full" style={{ height: 8 }}>
            <div
              className="bg-brand rounded-full h-full"
              style={{
                width: `${Math.min((localJoined / m.capacity) * 100, 100)}%`,
                transition: 'width 0.3s',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' as const }}>
            {avatars.slice(0, localJoined).map((a, i) => (
              <span key={i} style={{ fontSize: 28 }}>{a}</span>
            ))}
          </div>
        </div>

        {/* Status Feedback */}
        {status === 'joined' && (
          <div className="bg-success-bg rounded-xl text-center" style={{ padding: 16, marginBottom: 16 }}>
            <div className="font-bold text-success" style={{ fontSize: 20 }}>완료</div>
            <div className="font-bold text-success" style={{ marginTop: 4 }}>참가 신청 완료!</div>
            <div className="text-success" style={{ fontSize: 13, marginTop: 4 }}>모임 당일 집합 장소로 와주세요</div>
          </div>
        )}
        {status === 'cancelled' && (
          <div className="bg-error-bg rounded-xl text-center" style={{ padding: 16, marginBottom: 16 }}>
            <div className="font-bold text-destructive" style={{ fontSize: 20 }}>취소</div>
            <div className="font-bold text-destructive" style={{ marginTop: 4 }}>참가 취소됨</div>
          </div>
        )}
      </div>

      {/* CTA */}
      <div
        className="fixed bg-page-bg border-t border-border"
        style={{
          bottom: 60, left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 430, padding: '12px 20px',
        }}
      >
        {status !== 'joined' ? (
          <button
            onClick={handleJoin}
            disabled={loading || isFull}
            className={cn(
              'w-full border-none rounded-xl font-bold',
              isFull
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-brand text-white cursor-pointer',
            )}
            style={{ padding: '16px', fontSize: 16 }}
          >
            {loading ? '처리 중...' : isFull ? '마감' : '참가 신청하기'}
          </button>
        ) : (
          <button
            onClick={handleCancel}
            disabled={loading}
            className="w-full bg-error-bg text-destructive border-none rounded-xl font-bold cursor-pointer"
            style={{ padding: '16px', fontSize: 16 }}
          >
            {loading ? '처리 중...' : '참가 취소하기'}
          </button>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
