'use client';
import { useState, useEffect, useTransition, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createMoim, joinMoim, cancelMoim } from '@/app/actions/moim';

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

const PACE_OPTIONS = ['입문', '중급', '상급'];

function MoimDetailContent() {
  const searchParams = useSearchParams();
  const moimId = searchParams.get('id');

  const [tab, setTab] = useState<'detail' | 'create'>(moimId ? 'detail' : 'create');
  const [moim, setMoim] = useState<Moim | null>(null);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  // Create form state
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [distance, setDistance] = useState('');
  const [selectedPace, setSelectedPace] = useState('입문');
  const [createMsg, setCreateMsg] = useState('');

  useEffect(() => {
    fetch('/api/moim')
      .then((r) => r.json())
      .then((list: Moim[]) => {
        const found = moimId ? list.find((m) => m.id === moimId) : list[0];
        setMoim(found ?? list[0] ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [moimId]);

  const handleJoin = () => {
    if (!moim) return;
    startTransition(async () => {
      const result = await (joined
        ? cancelMoim(Number(moim.id), '현재 사용자')
        : joinMoim(Number(moim.id), '현재 사용자'));
      if ('error' in result && result.error) {
        setMessage(result.error);
      } else {
        setJoined(!joined);
        setMessage(joined ? '참가가 취소되었습니다.' : '참가 신청이 완료되었습니다!');
        if (moim) {
          setMoim({ ...moim, joined: joined ? moim.joined - 1 : moim.joined + 1 });
        }
      }
    });
  };

  const handleCreate = () => {
    if (!title || !date || !time || !location || !capacity || !distance) {
      setCreateMsg('모든 항목을 입력해주세요.');
      return;
    }
    startTransition(async () => {
      const result = await createMoim({
        title,
        date,
        time,
        location,
        pace: selectedPace,
        distance: Number(distance),
        capacity: Number(capacity),
        leaderName: '나',
      });
      if ('error' in result && result.error) {
        setCreateMsg(result.error);
      } else {
        setCreateMsg('모임이 개설되었습니다!');
        setTitle(''); setDate(''); setTime(''); setLocation(''); setCapacity(''); setDistance('');
      }
    });
  };

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* 헤더 */}
      <div style={{ background: 'var(--primary)', padding: '20px 16px 24px', color: '#fff', position: 'relative' }}>
        <Link href="/jiyeok-peiseubyeol-moim-tamsaek-mich-pilteo" style={{ color: '#fff', fontSize: 20, position: 'absolute', left: 16, top: 20 }}>
          ←
        </Link>
        <div style={{ textAlign: 'center', paddingTop: 4 }}>
          <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 4 }}>모임 상세 / 개설</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{loading ? '불러오는 중...' : (moim?.title ?? '러닝 크루 모임')}</div>
        </div>
      </div>

      {/* 탭 */}
      <div style={{ display: 'flex', background: '#fff', borderBottom: '1px solid #E5E5E5' }}>
        {(['detail', 'create'] as const).map((t) => (
          <Button
            key={t}
            onClick={() => setTab(t)}
            style={{ flex: 1, padding: '14px 0', border: 'none', background: 'none', fontWeight: tab === t ? 700 : 400, color: tab === t ? 'var(--primary)' : '#6B6B6B', borderBottom: tab === t ? '2px solid var(--primary)' : '2px solid transparent', cursor: 'pointer', fontSize: 14, height: 'auto', borderRadius: 0 }}
          >
            {t === 'detail' ? '모임 상세' : '모임 개설'}
          </Button>
        ))}
      </div>

      {tab === 'detail' ? (
        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {loading && <div style={{ textAlign: 'center', color: '#6B6B6B', padding: 40 }}>불러오는 중...</div>}
          {!loading && moim && (
            <>
              <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {[
                    ['날짜', moim.date],
                    ['시간', moim.time],
                    ['장소', moim.location],
                    ['거리', `${moim.distance}km`],
                    ['정원', `${moim.capacity}명`],
                    ['페이스', moim.pace],
                  ].map(([k, v]) => (
                    <div key={k}><div style={{ fontSize: 12, color: '#6B6B6B', marginBottom: 2 }}>{k}</div><div style={{ fontWeight: 600, fontSize: 15 }}>{v}</div></div>
                  ))}
                </div>
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #E5E5E5' }}>
                  <div style={{ fontSize: 12, color: '#6B6B6B', marginBottom: 4 }}>리더</div>
                  <div style={{ fontWeight: 600 }}>{moim.leader}</div>
                </div>
              </div>

              <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
                <div style={{ fontWeight: 700, marginBottom: 12 }}>참가 현황</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <div className="bg-gray-100" style={{ flex: 1, borderRadius: 999, height: 8 }}>
                    <div style={{ width: `${(moim.joined / moim.capacity) * 100}%`, background: 'var(--primary)', borderRadius: 999, height: '100%' }} />
                  </div>
                  <span style={{ fontSize: 13, color: '#6B6B6B' }}>{moim.joined}/{moim.capacity}명</span>
                </div>
                <Button
                  onClick={handleJoin}
                  disabled={isPending}
                  className={joined ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' : ''}
                  style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', ...(joined ? {} : { background: 'var(--primary)', color: '#fff' }), fontWeight: 700, fontSize: 16, cursor: isPending ? 'not-allowed' : 'pointer', opacity: isPending ? 0.7 : 1, height: 'auto' }}
                >
                  {isPending ? '처리 중...' : joined ? '참가 취소' : '참가 신청'}
                </Button>
                {message && (
                  <div style={{ textAlign: 'center', marginTop: 8, color: joined ? '#2ECC71' : 'var(--primary)', fontWeight: 600, fontSize: 14 }}>
                    {message}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      ) : (
        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 1px 6px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: '모임 제목', type: 'text', placeholder: '예: 한강 저녁 런', value: title, setter: setTitle },
              { label: '날짜', type: 'date', placeholder: '', value: date, setter: setDate },
              { label: '시간', type: 'time', placeholder: '', value: time, setter: setTime },
              { label: '장소', type: 'text', placeholder: '예: 한강 여의도 공원', value: location, setter: setLocation },
              { label: '거리 (km)', type: 'number', placeholder: '예: 5', value: distance, setter: setDistance },
              { label: '정원 (명)', type: 'number', placeholder: '예: 10', value: capacity, setter: setCapacity },
            ].map(({ label, type, placeholder, value, setter }) => (
              <div key={label}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#1A1A1A' }}>{label}</label>
                <Input
                  type={type}
                  placeholder={placeholder}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #E5E5E5', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>페이스</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {PACE_OPTIONS.map((p) => (
                  <Button
                    key={p}
                    onClick={() => setSelectedPace(p)}
                    style={{ flex: 1, padding: '10px', borderRadius: 10, border: selectedPace === p ? 'none' : '1px solid #E5E5E5', background: selectedPace === p ? 'var(--primary)' : '#fff', color: selectedPace === p ? '#fff' : '#1A1A1A', cursor: 'pointer', fontSize: 14, fontWeight: selectedPace === p ? 700 : 400, height: 'auto' }}
                  >
                    {p}
                  </Button>
                ))}
              </div>
            </div>
            <Button
              onClick={handleCreate}
              disabled={isPending}
              style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 12, padding: '14px', fontWeight: 700, fontSize: 16, cursor: isPending ? 'not-allowed' : 'pointer', marginTop: 4, opacity: isPending ? 0.7 : 1, height: 'auto' }}
            >
              {isPending ? '처리 중...' : '모임 개설 완료'}
            </Button>
            {createMsg && (
              <div style={{ textAlign: 'center', color: createMsg.includes('완료') || createMsg.includes('개설') ? '#2ECC71' : 'var(--primary)', fontWeight: 600, fontSize: 14 }}>
                {createMsg}
              </div>
            )}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

export default function MoimDetailPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: 40, color: '#6B6B6B' }}>불러오는 중...</div>}>
      <MoimDetailContent />
    </Suspense>
  );
}
