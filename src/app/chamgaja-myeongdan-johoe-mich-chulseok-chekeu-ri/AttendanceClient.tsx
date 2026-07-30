'use client';
import { useState, useTransition } from 'react';
import BottomNav from '@/components/BottomNav';
import { toggleAttendanceAction } from '@/app/actions';
import type { MeetupRow, ParticipantRow } from '@/app/actions';

export default function AttendanceClient({
  meetup,
  initialParticipants,
}: {
  meetup: MeetupRow | null;
  initialParticipants: ParticipantRow[];
}) {
  const [list, setList] = useState(initialParticipants);
  const [closed, setClosed] = useState(false);
  const [, startTransition] = useTransition();

  function toggleAttend(participant: ParticipantRow) {
    if (closed) return;
    const nextAttended = !participant.attended;
    // Optimistic update
    setList(prev => prev.map(p => p.id === participant.id ? { ...p, attended: nextAttended } : p));
    startTransition(async () => {
      const result = await toggleAttendanceAction(participant.id, participant.attended);
      if (result?.error) {
        // Revert on error
        setList(prev => prev.map(p => p.id === participant.id ? { ...p, attended: participant.attended } : p));
      }
    });
  }

  const attendedCount = list.filter(p => p.attended).length;
  const absentCount = list.filter(p => !p.attended).length;

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ background: '#FF6B35', padding: '20px 16px 16px', color: '#fff' }}>
        <div style={{ fontSize: 13, opacity: 0.85 }}>리더 전용</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>참가자 명단 · 출석 체크</div>
      </div>

      {meetup && (
        <div style={{ margin: 16, background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{meetup.title}</div>
          <div style={{ fontSize: 13, color: '#6B7280' }}>📅 {meetup.date} {meetup.time} · 신청 {list.length}명 / 정원 {meetup.capacity}명</div>
          <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
            {[
              { label: '출석', count: attendedCount, color: '#10B981' },
              { label: '미확인', count: absentCount, color: '#9CA3AF' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.count}</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {list.map(p => (
          <div
            key={p.id}
            onClick={() => toggleAttend(p)}
            style={{ background: '#fff', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', cursor: closed ? 'default' : 'pointer', opacity: closed ? 0.8 : 1 }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: '#9CA3AF' }}>신청일 {p.appliedAt}</div>
            </div>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: p.attended ? '#10B981' : '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
              {p.attended ? '✓' : ''}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: 16 }}>
        <button
          onClick={() => setClosed(true)}
          disabled={closed}
          style={{ width: '100%', background: closed ? '#9CA3AF' : '#1A1A2E', color: '#fff', border: 'none', borderRadius: 10, padding: '14px', fontSize: 15, fontWeight: 700, cursor: closed ? 'default' : 'pointer' }}
        >
          {closed ? '출석 마감 완료' : '출석 마감'}
        </button>
      </div>
      <BottomNav />
    </div>
  );
}
