'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';
import { createMeetupAction } from '@/app/actions';

export default function CreateMeetupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    pace: '초보(6분+)',
    capacity: 10,
    description: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.set(k, String(v)));
    startTransition(async () => {
      const result = await createMeetupAction(formData);
      if (result?.error) {
        setErrorMsg(result.error);
      } else {
        setSubmitted(true);
        setTimeout(() => router.push('/jiyeok-peiseubyeol-moim-tamsaek-mich-pilteo'), 1500);
      }
    });
  }

  if (submitted) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
        <div style={{ fontSize: 56 }}>🎉</div>
        <div style={{ fontSize: 20, fontWeight: 700 }}>모임이 개설되었습니다!</div>
        <div style={{ color: '#6B7280', fontSize: 14 }}>크루 피드에 자동 공지됩니다</div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ background: '#FF6B35', padding: '20px 16px 16px', color: '#fff', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer', padding: 0 }}>←</button>
        <div style={{ fontSize: 18, fontWeight: 700 }}>모임 개설</div>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          { key: 'title', label: '모임 제목', type: 'text', placeholder: '예) 마포 한강 저녁 러닝' },
          { key: 'date', label: '날짜', type: 'date', placeholder: '' },
          { key: 'time', label: '시간', type: 'time', placeholder: '' },
          { key: 'location', label: '집결 장소', type: 'text', placeholder: '예) 마포 한강공원 주차장' },
        ].map(({ key, label, type, placeholder }) => (
          <div key={key}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>{label}</label>
            <input
              type={type}
              placeholder={placeholder}
              required
              value={(form as Record<string, string | number>)[key] as string}
              onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
              style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 14, outline: 'none' }}
            />
          </div>
        ))}

        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>페이스 (km/min)</label>
          <select
            value={form.pace}
            onChange={e => setForm(prev => ({ ...prev, pace: e.target.value }))}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 14, background: '#fff' }}
          >
            {['초보(6분+)', '중급(5~6분)', '고급(5분 미만)'].map(p => <option key={p}>{p}</option>)}
          </select>
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
            최대 정원 <span style={{ color: '#FF6B35', fontWeight: 700 }}>{form.capacity}명</span>
          </label>
          <input
            type="range"
            min={2}
            max={30}
            value={form.capacity}
            onChange={e => setForm(prev => ({ ...prev, capacity: Number(e.target.value) }))}
            style={{ width: '100%', accentColor: '#FF6B35' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9CA3AF' }}>
            <span>2명</span><span>30명</span>
          </div>
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>모임 소개</label>
          <textarea
            value={form.description}
            onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
            placeholder="코스 정보, 준비물 등을 적어주세요"
            rows={3}
            style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 14, resize: 'vertical', outline: 'none' }}
          />
        </div>

        {errorMsg && (
          <div style={{ color: '#EF4444', fontSize: 13, textAlign: 'center' }}>{errorMsg}</div>
        )}

        <button
          type="submit"
          disabled={isPending}
          style={{ background: isPending ? '#9CA3AF' : '#FF6B35', color: '#fff', border: 'none', borderRadius: 10, padding: '14px', fontSize: 16, fontWeight: 700, cursor: isPending ? 'default' : 'pointer', marginTop: 4 }}
        >
          {isPending ? '개설 중...' : '모임 개설하기'}
        </button>
      </form>
      <BottomNav />
    </div>
  );
}
