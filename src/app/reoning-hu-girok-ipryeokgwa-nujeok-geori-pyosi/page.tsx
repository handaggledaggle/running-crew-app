'use client';
import { useState, useEffect, useTransition } from 'react';
import { Activity } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { saveRunRecord } from '@/app/actions/run-record';

type RunRecord = {
  id: string;
  date: string;
  distance: number;
  duration: number;
};

export default function GirokPage() {
  const [records, setRecords] = useState<RunRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dist, setDist] = useState('');
  const [dur, setDur] = useState('');
  const [date, setDate] = useState('');
  const [saveMsg, setSaveMsg] = useState('');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetch('/api/run-records?userId=default-user')
      .then((r) => r.json())
      .then((data: RunRecord[]) => {
        setRecords(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalDist = records.reduce((sum, r) => sum + r.distance, 0);
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthDist = records
    .filter((r) => r.date.startsWith(currentMonth))
    .reduce((sum, r) => sum + r.distance, 0);

  const save = () => {
    if (!dist || !dur || !date) {
      setSaveMsg('모든 항목을 입력해주세요.');
      return;
    }
    const newRecord: RunRecord = {
      id: String(Date.now()),
      date,
      distance: parseFloat(dist),
      duration: parseInt(dur),
    };
    // Optimistic update
    setRecords([newRecord, ...records]);
    setDist('');
    setDur('');
    setDate('');
    setSaveMsg('');

    startTransition(async () => {
      const result = await saveRunRecord({
        date: newRecord.date,
        distance: newRecord.distance,
        duration: newRecord.duration,
      });
      if ('error' in result && result.error) {
        setSaveMsg(result.error);
      } else {
        setSaveMsg('기록이 저장되었습니다!');
      }
    });
  };

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ background: 'var(--primary)', padding: '20px 16px 24px', color: '#fff' }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>내 러닝 기록</div>
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            ['누적 거리', `${totalDist.toFixed(1)}km`],
            ['이번 달', `${monthDist.toFixed(1)}km`],
            ['총 활동', `${records.length}회`],
          ].map(([k, v]) => (
            <div key={k} style={{ flex: 1, background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '12px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{loading ? '...' : v}</div>
              <div style={{ fontSize: 11, opacity: 0.85, marginTop: 3 }}>{k}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px', background: '#fff', margin: '16px', borderRadius: 16, boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
        <div style={{ fontWeight: 700, marginBottom: 14 }}>기록 입력</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <div>
            <label style={{ fontSize: 12, color: '#6B6B6B', display: 'block', marginBottom: 4 }}>거리 (km)</label>
            <Input
              value={dist}
              onChange={(e) => setDist(e.target.value)}
              type="number"
              placeholder="5.0"
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #E5E5E5', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, color: '#6B6B6B', display: 'block', marginBottom: 4 }}>시간 (분)</label>
            <Input
              value={dur}
              onChange={(e) => setDur(e.target.value)}
              type="number"
              placeholder="30"
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #E5E5E5', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, color: '#6B6B6B', display: 'block', marginBottom: 4 }}>날짜</label>
          <Input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            type="date"
            style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #E5E5E5', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <Button
          onClick={save}
          disabled={isPending}
          style={{ width: '100%', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 10, padding: '13px', fontWeight: 700, fontSize: 15, cursor: isPending ? 'not-allowed' : 'pointer', opacity: isPending ? 0.7 : 1, height: 'auto' }}
        >
          {isPending ? '저장 중...' : '기록 저장'}
        </Button>
        {saveMsg && (
          <div style={{ textAlign: 'center', marginTop: 8, color: saveMsg.includes('저장') ? '#2ECC71' : 'var(--primary)', fontWeight: 600, fontSize: 13 }}>
            {saveMsg}
          </div>
        )}
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>최근 기록</div>
        {loading && <div style={{ textAlign: 'center', color: '#6B6B6B', padding: 20 }}>불러오는 중...</div>}
        {records.map((r) => (
          <div key={r.id} style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#FFE0D9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={20} color="var(--primary)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{r.distance}km</div>
              <div style={{ fontSize: 12, color: '#6B6B6B', marginTop: 2 }}>{r.date} · {r.duration}분</div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 700 }}>
              {(r.distance / (r.duration / 60)).toFixed(1)} km/h
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
