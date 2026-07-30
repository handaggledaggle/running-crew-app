'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';
import { createMeeting } from '@/lib/actions';
import { cn } from '@/lib/utils';

const PACE_OPTIONS = ['4~5분/km', '5~6분/km', '6~7분/km', '7분+/km'];
const DISTRICT_OPTIONS = ['영등포', '성동', '송파', '강북', '강남', '마포', '관악', '서초'];

export default function CreateMeetingPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    district: '',
    pace: '',
    capacity: '',
    memo: '',
  });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!form.title || !form.date || !form.time || !form.location || !form.pace) return;
    setLoading(true);
    await createMeeting(form);
    setLoading(false);
    setDone(true);
    setTimeout(() => router.push('/jiyeok-peiseubyeol-moim-tamsaek-mich-pilteo'), 1500);
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    borderRadius: 10, fontSize: 15, outline: 'none',
    boxSizing: 'border-box' as const, fontFamily: 'sans-serif',
  };

  return (
    <div className="bg-page-bg min-h-screen font-sans" style={{ maxWidth: 430, margin: '0 auto' }}>
      <div className="bg-brand flex items-center gap-3 px-5 py-4">
        <button onClick={() => router.back()} className="bg-transparent border-none text-white cursor-pointer" style={{ fontSize: 20 }}>←</button>
        <div className="text-white font-bold" style={{ fontSize: 18 }}>모임 개설</div>
      </div>

      <div style={{ padding: 20, paddingBottom: 100 }}>
        {done ? (
          <div className="text-center" style={{ padding: '60px 0' }}>
            <div style={{ fontSize: 60 }}>:)</div>
            <div className="font-bold text-ink" style={{ fontSize: 20, marginTop: 16 }}>모임이 개설됐어요!</div>
            <div className="text-muted-foreground" style={{ marginTop: 8 }}>참가 신청을 기다려보세요</div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl" style={{ padding: 20, marginBottom: 16 }}>
              <div className="font-bold text-ink" style={{ fontSize: 15, marginBottom: 16 }}>기본 정보</div>
              <div style={{ marginBottom: 14 }}>
                <label className="text-foreground font-semibold block" style={{ fontSize: 13, marginBottom: 6 }}>모임 이름</label>
                <input className="border border-border" style={inputStyle} placeholder="예: 한강 저녁 러닝" value={form.title} onChange={(e) => set('title', e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                <div style={{ flex: 1 }}>
                  <label className="text-foreground font-semibold block" style={{ fontSize: 13, marginBottom: 6 }}>날짜</label>
                  <input className="border border-border" style={inputStyle} type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="text-foreground font-semibold block" style={{ fontSize: 13, marginBottom: 6 }}>시간</label>
                  <input className="border border-border" style={inputStyle} type="time" value={form.time} onChange={(e) => set('time', e.target.value)} />
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label className="text-foreground font-semibold block" style={{ fontSize: 13, marginBottom: 6 }}>집합 장소</label>
                <input className="border border-border" style={inputStyle} placeholder="예: 여의도 한강공원 물빛광장" value={form.location} onChange={(e) => set('location', e.target.value)} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label className="text-foreground font-semibold block" style={{ fontSize: 13, marginBottom: 6 }}>지역구</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
                  {DISTRICT_OPTIONS.map((d) => (
                    <button
                      key={d}
                      onClick={() => set('district', d)}
                      className={cn(
                        'border-none cursor-pointer',
                        form.district === d ? 'bg-brand text-white font-bold' : 'bg-muted text-foreground font-normal',
                      )}
                      style={{ padding: '7px 13px', borderRadius: 20, fontSize: 13 }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl" style={{ padding: 20, marginBottom: 16 }}>
              <div className="font-bold text-ink" style={{ fontSize: 15, marginBottom: 16 }}>러닝 설정</div>
              <div style={{ marginBottom: 14 }}>
                <label className="text-foreground font-semibold block" style={{ fontSize: 13, marginBottom: 6 }}>목표 페이스</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
                  {PACE_OPTIONS.map((p) => (
                    <button
                      key={p}
                      onClick={() => set('pace', p)}
                      className={cn(
                        'border-none cursor-pointer',
                        form.pace === p ? 'bg-brand text-white font-bold' : 'bg-muted text-foreground font-normal',
                      )}
                      style={{ padding: '8px 14px', borderRadius: 20, fontSize: 13 }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label className="text-foreground font-semibold block" style={{ fontSize: 13, marginBottom: 6 }}>정원</label>
                <input
                  className="border border-border"
                  style={{ ...inputStyle, width: 100 }}
                  type="number"
                  placeholder="10"
                  value={form.capacity}
                  onChange={(e) => set('capacity', e.target.value)}
                />
              </div>
              <div>
                <label className="text-foreground font-semibold block" style={{ fontSize: 13, marginBottom: 6 }}>공지 메모 (선택)</label>
                <textarea
                  className="border border-border"
                  style={{ ...inputStyle, height: 80, resize: 'none' }}
                  placeholder="준비물, 코스 안내 등"
                  value={form.memo}
                  onChange={(e) => set('memo', e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={cn(
                'w-full text-white border-none rounded-xl font-bold',
                loading ? 'bg-brand-muted cursor-not-allowed' : 'bg-brand cursor-pointer',
              )}
              style={{ padding: '16px', fontSize: 16 }}
            >
              {loading ? '개설 중...' : '개설하기'}
            </button>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
