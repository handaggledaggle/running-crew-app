'use client';
import { useState } from 'react';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import type { MeetingItem } from '@/lib/types';
import { DISTRICTS, PACES } from '@/lib/data';
import { cn } from '@/lib/utils';

export default function ExploreClient({ initialMeetings }: { initialMeetings: MeetingItem[] }) {
  const [district, setDistrict] = useState('전체');
  const [pace, setPace] = useState('전체');

  const filtered = initialMeetings.filter(
    (m) =>
      (district === '전체' || m.district === district) &&
      (pace === '전체' || m.pace === pace),
  );

  return (
    <div className="bg-page-bg min-h-screen font-sans" style={{ maxWidth: 430, margin: '0 auto' }}>
      {/* Header */}
      <div className="bg-brand flex items-center justify-between" style={{ padding: '16px 20px 12px' }}>
        <div>
          <div className="text-white" style={{ fontSize: 12, opacity: 0.85 }}>크루런</div>
          <div className="text-white font-bold" style={{ fontSize: 20 }}>러닝 모임 탐색</div>
        </div>
        <button className="bg-transparent border-none text-white cursor-pointer" style={{ fontSize: 24 }}>알림</button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border-b border-border" style={{ padding: '12px 16px' }}>
        <div style={{ marginBottom: 8 }}>
          <div className="text-muted-foreground" style={{ fontSize: 11, marginBottom: 6 }}>지역</div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
            {DISTRICTS.map((d) => (
              <button
                key={d}
                onClick={() => setDistrict(d)}
                className={cn(
                  'border-none cursor-pointer',
                  district === d ? 'bg-brand text-white font-bold' : 'bg-muted text-foreground font-normal',
                )}
                style={{ padding: '5px 12px', borderRadius: 20, whiteSpace: 'nowrap', fontSize: 13 }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-muted-foreground" style={{ fontSize: 11, marginBottom: 6 }}>페이스</div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
            {PACES.map((p) => (
              <button
                key={p}
                onClick={() => setPace(p)}
                className={cn(
                  'border-none cursor-pointer',
                  pace === p ? 'bg-forest text-white font-bold' : 'bg-muted text-foreground font-normal',
                )}
                style={{ padding: '5px 12px', borderRadius: 20, whiteSpace: 'nowrap', fontSize: 13 }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Meeting List */}
      <div style={{ padding: '16px', paddingBottom: 80 }}>
        <div className="text-muted-foreground" style={{ fontSize: 13, marginBottom: 12 }}>모임 {filtered.length}개</div>
        {filtered.map((m) => {
          const full = m.joined >= m.capacity;
          return (
            <Link key={m.id} href={`/chamga-sincheong-mich-chwiso?id=${m.id}`} style={{ textDecoration: 'none' }}>
              <div
                className="bg-white rounded-xl cursor-pointer"
                style={{
                  padding: '16px', marginBottom: 12,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                      <span className="bg-brand-tint text-brand font-semibold" style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10 }}>{m.district}</span>
                      <span className="bg-forest-tint text-forest font-semibold" style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10 }}>{m.pace}</span>
                    </div>
                    <div className="font-bold text-ink" style={{ fontSize: 16, marginBottom: 4 }}>{m.title}</div>
                    <div className="text-muted-foreground" style={{ fontSize: 13 }}>{m.date} {m.time}</div>
                    <div className="text-muted-foreground" style={{ fontSize: 13, marginTop: 2 }}>{m.location}</div>
                  </div>
                  <div style={{ textAlign: 'center', minWidth: 56 }}>
                    <div style={{ fontSize: 22, color: full ? '#ef4444' : '#22c55e' }}>●</div>
                    <div className={cn('font-semibold', full ? 'text-destructive' : 'text-success')} style={{ fontSize: 12 }}>{m.joined}/{m.capacity}</div>
                  </div>
                </div>
                <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    className={cn(
                      'border-none rounded-lg font-bold',
                      full ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-brand text-white cursor-pointer',
                    )}
                    style={{ padding: '8px 20px', fontSize: 14 }}
                  >
                    {full ? '마감' : '참가 신청'}
                  </button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <BottomNav />
    </div>
  );
}
