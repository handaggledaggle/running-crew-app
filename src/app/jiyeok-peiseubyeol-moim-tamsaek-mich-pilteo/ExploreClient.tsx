'use client';
import { useState } from 'react';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import type { MeetupRow } from '@/app/actions';

const PACE_LABELS: Record<string, string> = {
  '전체': '전체',
  '초보': '초보(6분+)',
  '중급': '중급(5~6분)',
  '고급': '고급(~5분)',
};
const PACE_COLORS: Record<string, string> = {
  '초보': '#10B981',
  '중급': '#F59E0B',
  '고급': '#EF4444',
};

export default function ExploreClient({ initialMeetups }: { initialMeetups: MeetupRow[] }) {
  const [selectedPace, setSelectedPace] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = initialMeetups.filter(m => {
    const matchPace = selectedPace === '전체' || m.pace === selectedPace;
    const matchSearch = m.location.includes(searchQuery) || m.title.includes(searchQuery);
    return matchPace && matchSearch;
  });

  return (
    <div style={{ paddingBottom: 72 }}>
      {/* Header */}
      <div style={{ background: '#FF6B35', padding: '20px 16px 16px', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>서울 마포구 기준</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>🏃 오늘의 러닝 모임</div>
          </div>
          <Link
            href="/moim-gaeseol-ilsi-jangso-peiseu-jeongwon-seoljeo"
            style={{ background: '#fff', color: '#FF6B35', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}
          >
            + 개설
          </Link>
        </div>
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="동네·장소 검색"
          style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: 'none', fontSize: 14, outline: 'none' }}
        />
      </div>

      {/* Pace Filters */}
      <div style={{ display: 'flex', gap: 8, padding: '12px 16px', overflowX: 'auto' }}>
        {['전체', '초보', '중급', '고급'].map(p => (
          <button
            key={p}
            onClick={() => setSelectedPace(p)}
            style={{ whiteSpace: 'nowrap', padding: '6px 14px', borderRadius: 20, border: '1.5px solid', borderColor: selectedPace === p ? '#FF6B35' : '#E5E7EB', background: selectedPace === p ? '#FF6B35' : '#fff', color: selectedPace === p ? '#fff' : '#374151', fontSize: 13, fontWeight: selectedPace === p ? 700 : 400, cursor: 'pointer' }}
          >
            {PACE_LABELS[p]}
          </button>
        ))}
      </div>

      {/* Meetup List */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>검색 결과가 없어요</div>
        )}
        {filtered.map(m => (
          <Link key={m.id} href="/chamga-sincheong-mich-chwiso" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: '#1A1A2E' }}>{m.title}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: PACE_COLORS[m.pace] ?? '#6B7280', borderRadius: 12, padding: '2px 8px', whiteSpace: 'nowrap', marginLeft: 8 }}>
                  {m.pace}
                </span>
              </div>
              <div style={{ fontSize: 13, color: '#6B7280', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span>📅 {m.date} {m.time}</span>
                <span>📍 {m.location}</span>
              </div>
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ height: 6, background: '#F3F4F6', borderRadius: 3, flex: 1, marginRight: 12, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: m.registered >= m.capacity ? '#EF4444' : '#FF6B35', borderRadius: 3, width: `${Math.min(100, (m.registered / m.capacity) * 100)}%` }} />
                </div>
                <span style={{ fontSize: 12, color: m.registered >= m.capacity ? '#EF4444' : '#374151', fontWeight: 600 }}>
                  {m.registered}/{m.capacity}명
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <BottomNav />
    </div>
  );
}
