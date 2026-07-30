'use client';
import { useState, useTransition } from 'react';
import BottomNav from '@/components/BottomNav';
import { saveRunRecordAction } from '@/app/actions';
import type { RunRecordRow } from '@/app/actions';

export default function RunRecordClient({ initialRecords }: { initialRecords: RunRecordRow[] }) {
  const [form, setForm] = useState({ date: '', distance: '', duration: '', avgPace: '' });
  const [records, setRecords] = useState(initialRecords);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const cumTotal = records.reduce((s, r) => s + r.distance, 0);
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthTotal = records
    .filter(r => r.date.startsWith(currentMonth))
    .reduce((s, r) => s + r.distance, 0);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const newRec: RunRecordRow = {
      id: Date.now(),
      date: form.date,
      distance: Number(form.distance),
      duration: form.duration,
      avgPace: form.avgPace,
    };
    // Optimistic update
    setRecords(prev => [newRec, ...prev]);
    setForm({ date: '', distance: '', duration: '', avgPace: '' });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.set(k, v));
    startTransition(async () => {
      await saveRunRecordAction(formData);
    });
  }

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ background: '#FF6B35', padding: '20px 16px 16px', color: '#fff' }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>📊 러닝 기록</div>
      </div>

      {/* Stats hero */}
      <div style={{ margin: 16, background: 'linear-gradient(135deg,#FF6B35,#FF8C5A)', borderRadius: 16, padding: 20, color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {[
            { label: '누적 거리', value: `${cumTotal.toFixed(1)} km` },
            { label: '이번 달', value: `${monthTotal.toFixed(1)} km` },
            { label: '참가 횟수', value: `${records.length}회` },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800 }}>{s.value}</div>
              <div style={{ fontSize: 11, opacity: 0.85, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Record form */}
      <form onSubmit={handleSave} style={{ margin: '0 16px 16px', background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>기록 추가</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { key: 'date', label: '날짜', type: 'date', placeholder: '' },
            { key: 'distance', label: '거리 (km)', type: 'number', placeholder: '6.2' },
            { key: 'duration', label: '소요 시간', type: 'text', placeholder: '37:12' },
            { key: 'avgPace', label: '평균 페이스', type: 'text', placeholder: '6:00' },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label style={{ fontSize: 11, color: '#6B7280', display: 'block', marginBottom: 4 }}>{label}</label>
              <input
                type={type}
                placeholder={placeholder}
                value={(form as Record<string, string>)[key]}
                onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                required
                style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 14, outline: 'none' }}
              />
            </div>
          ))}
        </div>
        <button
          type="submit"
          disabled={isPending}
          style={{ width: '100%', marginTop: 12, background: '#FF6B35', color: '#fff', border: 'none', borderRadius: 8, padding: '11px', fontSize: 14, fontWeight: 700, cursor: isPending ? 'default' : 'pointer', opacity: isPending ? 0.7 : 1 }}
        >
          {saved ? '✅ 저장 완료!' : '기록 저장'}
        </button>
      </form>

      {/* History */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#374151', marginBottom: 4 }}>최근 러닝 기록</div>
        {records.map(r => (
          <div key={r.id} style={{ background: '#fff', borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{r.distance} km</div>
              <div style={{ fontSize: 12, color: '#9CA3AF' }}>{r.date}</div>
            </div>
            <div style={{ textAlign: 'right', fontSize: 12, color: '#6B7280' }}>
              <div>⏱ {r.duration}</div>
              <div>🏃 {r.avgPace}/km</div>
            </div>
          </div>
        ))}
      </div>
      <BottomNav />
    </div>
  );
}
