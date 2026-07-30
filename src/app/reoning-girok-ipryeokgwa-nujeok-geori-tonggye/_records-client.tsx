'use client';
import { useState } from 'react';
import BottomNav from '@/components/BottomNav';
import { saveRunningRecord } from '@/lib/actions';
import type { RunningRecordItem } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function RecordsClient({ initialRecords }: { initialRecords: RunningRecordItem[] }) {
  const [records, setRecords] = useState<RunningRecordItem[]>(initialRecords);
  const [form, setForm] = useState({ date: '', distanceKm: '', durationMin: '', memo: '' });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const totalDist = records.reduce((s, r) => s + r.distanceKm, 0);
  const totalTime = records.reduce((s, r) => s + r.durationMin, 0);

  const handleSave = async () => {
    const dist = parseFloat(form.distanceKm);
    const dur = parseInt(form.durationMin);
    if (!dist || !dur) return;

    const today = new Date().toISOString().slice(0, 10);
    const newRecord: RunningRecordItem = {
      id: Date.now(),
      date: form.date || today,
      distanceKm: dist,
      durationMin: dur,
      memo: form.memo || null,
    };

    // Optimistic update
    setRecords((prev) => [newRecord, ...prev]);
    setForm({ date: '', distanceKm: '', durationMin: '', memo: '' });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);

    setLoading(true);
    await saveRunningRecord(form);
    setLoading(false);
  };

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const inputStyle = {
    width: '100%', padding: '11px 14px',
    borderRadius: 10, fontSize: 15, outline: 'none', boxSizing: 'border-box' as const,
  };

  return (
    <div className="bg-page-bg min-h-screen font-sans" style={{ maxWidth: 430, margin: '0 auto' }}>
      <div className="bg-forest" style={{ padding: '16px 20px' }}>
        <div className="text-forest-light" style={{ fontSize: 12 }}>이번 달 누적</div>
        <div className="text-white font-bold" style={{ fontSize: 20 }}>러닝 기록</div>
      </div>

      {/* Monthly Stats */}
      <div className="bg-forest flex gap-3" style={{ padding: '0 20px 20px' }}>
        <div className="flex-1 rounded-xl text-center" style={{ backgroundColor: 'rgba(255,255,255,0.15)', padding: '14px' }}>
          <div className="text-white font-bold" style={{ fontSize: 24 }}>{totalDist.toFixed(1)}</div>
          <div className="text-forest-light" style={{ fontSize: 12, marginTop: 2 }}>km 누적 거리</div>
        </div>
        <div className="flex-1 rounded-xl text-center" style={{ backgroundColor: 'rgba(255,255,255,0.15)', padding: '14px' }}>
          <div className="text-white font-bold" style={{ fontSize: 24 }}>
            {Math.floor(totalTime / 60)}h {totalTime % 60}m
          </div>
          <div className="text-forest-light" style={{ fontSize: 12, marginTop: 2 }}>총 러닝 시간</div>
        </div>
        <div className="flex-1 rounded-xl text-center" style={{ backgroundColor: 'rgba(255,255,255,0.15)', padding: '14px' }}>
          <div className="text-white font-bold" style={{ fontSize: 24 }}>{records.length}</div>
          <div className="text-forest-light" style={{ fontSize: 12, marginTop: 2 }}>러닝 횟수</div>
        </div>
      </div>

      <div style={{ padding: 16, paddingBottom: 100 }}>
        {/* Input Form */}
        <div className="bg-white rounded-xl" style={{ padding: 20, marginBottom: 16 }}>
          <div className="font-bold text-ink" style={{ fontSize: 15, marginBottom: 14 }}>오늘 기록 입력</div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <div className="text-muted-foreground" style={{ fontSize: 12, marginBottom: 5 }}>거리 (km)</div>
              <input
                className="border border-border"
                style={inputStyle}
                type="number"
                step="0.1"
                placeholder="5.0"
                value={form.distanceKm}
                onChange={(e) => set('distanceKm', e.target.value)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div className="text-muted-foreground" style={{ fontSize: 12, marginBottom: 5 }}>시간 (분)</div>
              <input
                className="border border-border"
                style={inputStyle}
                type="number"
                placeholder="30"
                value={form.durationMin}
                onChange={(e) => set('durationMin', e.target.value)}
              />
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div className="text-muted-foreground" style={{ fontSize: 12, marginBottom: 5 }}>메모 (선택)</div>
            <input
              className="border border-border"
              style={inputStyle}
              placeholder="오늘 러닝 한 줄 메모"
              value={form.memo}
              onChange={(e) => set('memo', e.target.value)}
            />
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className={cn(
              'w-full text-white border-none rounded-xl font-bold cursor-pointer',
              saved ? 'bg-success' : 'bg-brand',
            )}
            style={{ padding: '13px', fontSize: 15 }}
          >
            {saved ? '저장됐어요!' : '기록 저장'}
          </button>
        </div>

        {/* Record List */}
        <div className="font-bold text-ink" style={{ fontSize: 15, marginBottom: 10 }}>최근 기록</div>
        {records.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-xl flex items-center justify-between"
            style={{
              padding: '14px 16px', marginBottom: 10,
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            }}
          >
            <div>
              <div className="font-semibold" style={{ fontSize: 15 }}>{r.distanceKm} km</div>
              <div className="text-muted-foreground" style={{ fontSize: 12, marginTop: 2 }}>{r.date} · {r.durationMin}분</div>
              {r.memo && <div className="text-muted-foreground" style={{ fontSize: 12, marginTop: 2 }}>{r.memo}</div>}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="text-forest font-bold" style={{ fontSize: 13 }}>
                {r.distanceKm > 0 ? (r.durationMin / r.distanceKm).toFixed(1) : '—'}
                <span className="font-normal" style={{ fontSize: 11 }}>분/km</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <BottomNav />
    </div>
  );
}
