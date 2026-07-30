'use client';
import { useState } from 'react';
import BottomNav from '@/components/BottomNav';
import { toggleAttendance } from '@/lib/actions';
import type { MeetingItem, ParticipantItem } from '@/lib/types';
import { cn } from '@/lib/utils';

type Props = {
  meeting: MeetingItem | null;
  initialMembers: ParticipantItem[];
};

export default function AttendanceClient({ meeting, initialMembers }: Props) {
  const [members, setMembers] = useState<ParticipantItem[]>(initialMembers);

  const toggle = async (id: number) => {
    // Optimistic update
    setMembers((prev) =>
      prev.map((mb) =>
        mb.id === id ? { ...mb, attended: mb.attended !== true } : mb,
      ),
    );
    await toggleAttendance(id);
  };

  const attended = members.filter((mb) => mb.attended === true).length;
  const total = members.length;

  const m = meeting;

  return (
    <div className="bg-page-bg min-h-screen font-sans" style={{ maxWidth: 430, margin: '0 auto' }}>
      <div className="bg-forest" style={{ padding: '16px 20px' }}>
        <div className="text-forest-light" style={{ fontSize: 12, marginBottom: 2 }}>리더 전용</div>
        <div className="text-white font-bold" style={{ fontSize: 18 }}>출석 체크</div>
      </div>

      {/* Meeting Summary */}
      <div className="bg-white border-b border-border" style={{ padding: '16px 20px' }}>
        {m ? (
          <>
            <div className="font-bold" style={{ fontSize: 16 }}>{m.title}</div>
            <div className="text-muted-foreground" style={{ fontSize: 13, marginTop: 4 }}>
              {m.date} {m.time} · {m.location}
            </div>
          </>
        ) : (
          <div className="text-muted-foreground" style={{ fontSize: 14 }}>모임 정보 없음</div>
        )}
        <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
          <div style={{ textAlign: 'center' }}>
            <div className="text-success font-bold" style={{ fontSize: 24 }}>{attended}</div>
            <div className="text-muted-foreground" style={{ fontSize: 11 }}>출석</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="text-destructive font-bold" style={{ fontSize: 24 }}>{total - attended}</div>
            <div className="text-muted-foreground" style={{ fontSize: 11 }}>미출석</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="text-muted-foreground font-bold" style={{ fontSize: 24 }}>{total}</div>
            <div className="text-muted-foreground" style={{ fontSize: 11 }}>전체</div>
          </div>
        </div>
        <div className="bg-muted rounded-full" style={{ height: 8, marginTop: 12 }}>
          <div
            className="bg-success rounded-full h-full"
            style={{
              width: total > 0 ? `${(attended / total) * 100}%` : '0%',
              transition: 'width 0.3s',
            }}
          />
        </div>
      </div>

      {/* Member List */}
      <div style={{ padding: '16px', paddingBottom: 80 }}>
        {total === 0 && (
          <div className="text-muted-foreground text-center" style={{ padding: '40px 0' }}>
            <div style={{ fontSize: 36 }}>--</div>
            <div style={{ marginTop: 12 }}>참가자가 없어요</div>
          </div>
        )}
        {members.map((mb) => (
          <div
            key={mb.id}
            className="bg-white rounded-xl flex items-center justify-between"
            style={{
              padding: '14px 16px', marginBottom: 10,
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              opacity: mb.attended === false ? 0.6 : 1,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 32 }}>{mb.userAvatar}</span>
              <div>
                <div className="font-semibold" style={{ fontSize: 15 }}>{mb.userName}</div>
                <div
                  className={cn(
                    'mt-0.5',
                    mb.attended === true ? 'text-success' : mb.attended === null ? 'text-warning' : 'text-destructive',
                  )}
                  style={{ fontSize: 12 }}
                >
                  {mb.attended === true ? '출석' : mb.attended === null ? '미정' : '미출석'}
                </div>
              </div>
            </div>
            <button
              onClick={() => toggle(mb.id)}
              className={cn(
                'border-none rounded-lg cursor-pointer font-semibold',
                mb.attended === true ? 'bg-success-bg text-success' : 'bg-muted text-foreground',
              )}
              style={{ padding: '8px 16px', fontSize: 13 }}
            >
              {mb.attended === true ? '출석 v' : '출석'}
            </button>
          </div>
        ))}
      </div>
      <BottomNav />
    </div>
  );
}
