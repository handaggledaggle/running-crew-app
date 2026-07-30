'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Moim = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  pace: string;
  distance: number;
  capacity: number;
  joined: number;
  leader: string;
};

const PACES = ['전체', '입문', '중급', '상급'];

export default function TamsaekPage() {
  const [search, setSearch] = useState('');
  const [pace, setPace] = useState('전체');
  const [moimList, setMoimList] = useState<Moim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/moim')
      .then((r) => r.json())
      .then((data) => {
        setMoimList(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = moimList.filter((m) => {
    const matchPace = pace === '전체' || m.pace === pace;
    const matchSearch = m.title.includes(search) || m.location.includes(search);
    return matchPace && matchSearch;
  });

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* 헤더 */}
      <div style={{ background: 'var(--primary)', padding: '20px 16px 16px', color: '#fff' }}>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>러닝 크루 모임</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="지역, 모임 이름 검색"
            style={{ flex: 1, padding: '10px 14px', borderRadius: 24, border: 'none', fontSize: 14, outline: 'none' }}
          />
          <Button
            style={{ background: '#fff', border: 'none', borderRadius: 24, padding: '10px 14px', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, height: 'auto' }}
          >
            <MapPin size={14} /> 내 위치
          </Button>
        </div>
      </div>

      {/* 페이스 필터 */}
      <div style={{ display: 'flex', gap: 8, padding: '12px 16px', background: '#fff', borderBottom: '1px solid #E5E5E5' }}>
        {PACES.map((p) => (
          <Button
            key={p}
            onClick={() => setPace(p)}
            style={{ padding: '6px 16px', borderRadius: 999, border: pace === p ? 'none' : '1px solid #E5E5E5', background: pace === p ? 'var(--primary)' : '#fff', color: pace === p ? '#fff' : '#6B6B6B', fontWeight: pace === p ? 700 : 400, fontSize: 13, cursor: 'pointer', height: 'auto' }}
          >
            {p}
          </Button>
        ))}
      </div>

      {/* 모임 리스트 */}
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading && (
          <div style={{ textAlign: 'center', color: '#6B6B6B', padding: 40 }}>불러오는 중...</div>
        )}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: '#6B6B6B', padding: 40 }}>검색 결과가 없습니다</div>
        )}
        {filtered.map((m) => (
          <Link
            key={m.id}
            href={`/moim-gaeseol-rideo-gwa-chamga-sincheong-chwiso-c?id=${m.id}`}
            style={{ display: 'block', background: '#fff', borderRadius: 16, padding: '16px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)', color: 'inherit', textDecoration: 'none' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{m.title}</div>
              <span style={{ background: m.pace === '입문' ? '#D4F5E2' : m.pace === '중급' ? '#FFF3CD' : '#FFE0D9', color: m.pace === '입문' ? '#1A7A4A' : m.pace === '중급' ? '#9A6700' : '#C0392B', borderRadius: 999, padding: '3px 10px', fontSize: 12, fontWeight: 600 }}>
                {m.pace}
              </span>
            </div>
            <div style={{ color: '#6B6B6B', fontSize: 13, marginBottom: 10, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span>{m.date} {m.time}</span>
              <span>{m.location}</span>
              <span>{m.distance}km 코스</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#6B6B6B' }}>{m.joined}/{m.capacity}명</span>
              <Button style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 24, padding: '7px 18px', fontWeight: 700, fontSize: 13, cursor: 'pointer', height: 'auto' }}>
                참가 신청
              </Button>
            </div>
          </Link>
        ))}
      </div>

      {/* 모임 개설 FAB */}
      <Link
        href="/moim-gaeseol-rideo-gwa-chamga-sincheong-chwiso-c"
        style={{ position: 'fixed', bottom: 88, right: 20, background: 'var(--primary)', color: '#fff', borderRadius: 999, padding: '14px 20px', fontWeight: 700, fontSize: 15, boxShadow: '0 4px 16px rgba(232,77,42,0.4)', zIndex: 99, textDecoration: 'none', display: 'block' }}
      >
        + 모임 개설
      </Link>

      <BottomNav />
    </div>
  );
}
