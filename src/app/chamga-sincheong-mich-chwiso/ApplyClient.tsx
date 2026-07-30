'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';
import { applyToMeetupAction, cancelApplicationAction } from '@/app/actions';
import type { MeetupRow } from '@/app/actions';

const PACE_COLORS: Record<string, string> = {
  '초보': '#10B981',
  '중급': '#F59E0B',
  '고급': '#EF4444',
};

export default function ApplyClient({ meetup }: { meetup: MeetupRow | null }) {
  const router = useRouter();
  const [applied, setApplied] = useState(false);
  const [participantId, setParticipantId] = useState<number | null>(null);
  const [toast, setToast] = useState('');
  const [isPending, startTransition] = useTransition();

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  function handleApply() {
    if (!meetup) return;
    startTransition(async () => {
      const result = await applyToMeetupAction(meetup.id, '나');
      if (!result.error) {
        setApplied(true);
        if (result.participantId) setParticipantId(result.participantId);
        showToast('✅ 참가 신청이 완료되었습니다!');
      } else {
        showToast(result.error);
      }
    });
  }

  function handleCancel() {
    if (!meetup) return;
    startTransition(async () => {
      if (participantId && participantId !== -1) {
        await cancelApplicationAction(participantId, meetup.id);
      }
      setApplied(false);
      setParticipantId(null);
      showToast('취소되었습니다');
    });
  }

  if (!meetup) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: '#9CA3AF' }}>
        모임 정보를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 80 }}>
      {toast && (
        <div style={{ position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', background: '#1A1A2E', color: '#fff', borderRadius: 10, padding: '10px 20px', fontSize: 14, zIndex: 999, whiteSpace: 'nowrap' }}>
          {toast}
        </div>
      )}

      <div style={{ background: '#FF6B35', padding: '20px 16px 16px', color: '#fff', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer', padding: 0 }}>←</button>
        <div style={{ fontSize: 18, fontWeight: 700 }}>모임 상세</div>
      </div>

      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{meetup.title}</h2>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', background: PACE_COLORS[meetup.pace] ?? '#6B7280', borderRadius: 12, padding: '2px 10px' }}>
              {meetup.pace}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, color: '#4B5563' }}>
            <span>📅 {meetup.date} {meetup.time}</span>
            <span>📍 {meetup.location}</span>
            <span>👤 {meetup.registered}/{meetup.capacity}명 신청</span>
          </div>
          <div style={{ marginTop: 12, padding: '10px 12px', background: '#FFF7F4', borderRadius: 8, fontSize: 13, color: '#6B7280' }}>
            {meetup.description}
          </div>
        </div>

        <div style={{ background: '#E5E7EB', borderRadius: 12, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: 14 }}>
          🗺️ 지도 (집결지: {meetup.location})
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#FF6B35', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>
            {meetup.leader[0]}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{meetup.leader}</div>
            <div style={{ fontSize: 12, color: '#9CA3AF' }}>크루 리더</div>
          </div>
        </div>

        {!applied ? (
          <button
            onClick={handleApply}
            disabled={isPending || meetup.registered >= meetup.capacity}
            style={{ background: meetup.registered >= meetup.capacity ? '#9CA3AF' : '#FF6B35', color: '#fff', border: 'none', borderRadius: 10, padding: '14px', fontSize: 16, fontWeight: 700, cursor: isPending || meetup.registered >= meetup.capacity ? 'default' : 'pointer', opacity: isPending ? 0.7 : 1 }}
          >
            {meetup.registered >= meetup.capacity ? '정원 마감' : isPending ? '신청 중...' : '참가 신청하기'}
          </button>
        ) : (
          <>
            <div style={{ background: '#ECFDF5', borderRadius: 10, padding: '12px', textAlign: 'center', color: '#10B981', fontWeight: 600, fontSize: 15 }}>✅ 신청 완료</div>
            <button
              onClick={handleCancel}
              disabled={isPending}
              style={{ background: '#fff', color: '#EF4444', border: '1.5px solid #EF4444', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 600, cursor: isPending ? 'default' : 'pointer' }}
            >
              {isPending ? '취소 중...' : '신청 취소'}
            </button>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
