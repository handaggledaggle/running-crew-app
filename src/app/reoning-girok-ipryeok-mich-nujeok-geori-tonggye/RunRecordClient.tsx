'use client';
import { useState, useTransition } from 'react';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { type RunRecordRow, createRunRecord } from '@/app/actions/run-records';

type MonthStat = { month: string; km: number };

type Props = {
  initialRecords: RunRecordRow[];
  monthlyStats: MonthStat[];
};

export default function RunRecordClient({ initialRecords, monthlyStats }: Props) {
  const [records, setRecords] = useState(initialRecords);
  const [form, setForm] = useState({ distance: '', duration: '' });
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const totalKm = records.reduce((s, r) => s + r.distance, 0);
  const thisMonthStr = new Date().toISOString().slice(0, 7);
  const thisMonthKm = records
    .filter((r) => r.date.startsWith(thisMonthStr))
    .reduce((s, r) => s + r.distance, 0);

  const avgPace = (() => {
    if (records.length === 0) return '0:00';
    const totalMin = records.reduce((s, r) => s + r.duration, 0);
    const totalDist = records.reduce((s, r) => s + r.distance, 0);
    if (totalDist === 0) return '0:00';
    const pace = totalMin / totalDist;
    return `${Math.floor(pace)}:${String(Math.round((pace % 1) * 60)).padStart(2, '0')}`;
  })();

  const maxKm = Math.max(...monthlyStats.map((m) => m.km), 1);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const dist = parseFloat(form.distance);
    const dur = parseInt(form.duration);
    if (!dist || !dur) return;
    const pace = dur / dist;
    const paceStr = `${Math.floor(pace)}:${String(Math.round((pace % 1) * 60)).padStart(2, '0')}`;
    const newRecord: RunRecordRow = {
      id: `r${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      distance: dist,
      duration: dur,
      pace: paceStr,
    };
    setRecords([newRecord, ...records]);
    setForm({ distance: '', duration: '' });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    startTransition(async () => {
      await createRunRecord({ distance: dist, duration: dur });
    });
  }

  return (
    <div className="min-h-screen bg-muted pb-20" style={{ maxWidth: 480, margin: '0 auto' }}>
      <div className="bg-card px-4 pt-12 pb-4 shadow-sm sticky top-0 z-40">
        <h1 className="font-bold text-lg text-foreground">러닝 기록</h1>
      </div>

      {saved && (
        <div className="mx-4 mt-4 bg-success-muted border border-success rounded-xl p-3 text-center text-success-muted-foreground text-sm font-medium">
          기록이 저장되었습니다!
        </div>
      )}

      {/* Stats */}
      <div className="px-4 pt-4">
        <div className="bg-gradient-to-r from-brand to-brand/80 rounded-2xl p-4 text-white">
          <p className="text-sm opacity-80 mb-1">이번 달 누적</p>
          <p className="text-4xl font-bold">
            {thisMonthKm.toFixed(1)} <span className="text-xl font-normal">km</span>
          </p>
          <div className="flex gap-4 mt-3 text-sm">
            <div>
              <p className="opacity-70">총 러닝</p>
              <p className="font-bold">{records.length}회</p>
            </div>
            <div>
              <p className="opacity-70">평균 페이스</p>
              <p className="font-bold">{avgPace}/km</p>
            </div>
            <div>
              <p className="opacity-70">누적 거리</p>
              <p className="font-bold">{totalKm.toFixed(1)}km</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly chart */}
      <div className="mx-4 mt-3 bg-card rounded-2xl p-4 shadow-sm">
        <p className="text-sm font-semibold text-secondary-foreground mb-3">월별 누적 거리</p>
        <div className="flex items-end gap-2 h-24">
          {monthlyStats.map((m) => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-muted-foreground">{m.km}</span>
              <div
                className="w-full rounded-t-sm bg-brand transition-all"
                style={{ height: `${(m.km / maxKm) * 72}px` }}
              />
              <span className="text-xs text-muted-foreground">{m.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Record input form */}
      <form onSubmit={handleSave} className="mx-4 mt-3 bg-card rounded-2xl p-4 shadow-sm">
        <p className="text-sm font-semibold text-secondary-foreground mb-3">오늘 러닝 기록 추가</p>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">거리 (km)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              placeholder="5.0"
              value={form.distance}
              onChange={(e) => setForm({ ...form, distance: e.target.value })}
              className="w-full bg-muted rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">시간 (분)</label>
            <input
              type="number"
              min="0"
              placeholder="30"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              className="w-full bg-muted rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div className="flex items-end">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-brand text-brand-foreground px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-brand/80 transition-colors disabled:opacity-60"
            >
              저장
            </Button>
          </div>
        </div>
      </form>

      {/* History */}
      <div className="px-4 mt-3 space-y-2">
        {records.map((r) => (
          <div
            key={r.id}
            className="bg-card rounded-2xl px-4 py-3 shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-bold text-foreground">{r.distance} km</p>
              <p className="text-xs text-muted-foreground">{r.date}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-brand">{r.pace}/km</p>
              <p className="text-xs text-muted-foreground">{r.duration}분</p>
            </div>
          </div>
        ))}
      </div>
      <BottomNav />
    </div>
  );
}
