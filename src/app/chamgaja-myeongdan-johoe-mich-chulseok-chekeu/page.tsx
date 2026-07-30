'use client';
import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { markAttendance } from '@/app/actions/attendance';

type Member = {
  id: number;
  moimId: number;
  userName: string;
  attended: boolean;
};

export default function ChulseokPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetch('/api/attendance?moimId=1')
      .then((r) => r.json())
      .then((data: Member[]) => {
        setMembers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggle = (member: Member) => {
    const newAttended = !member.attended;
    // Optimistic update
    setMembers((prev) =>
      prev.map((m) => (m.id === member.id ? { ...m, attended: newAttended } : m))
    );
    startTransition(async () => {
      await markAttendance(member.id, newAttended);
    });
  };

  const checked = members.filter((m) => m.attended).length;

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ background: 'var(--primary)', padding: '20px 16px 24px', color: '#fff', position: 'relative' }}>
        <Link href="/jiyeok-peiseubyeol-moim-tamsaek-mich-pilteo" style={{ color: '#fff', fontSize: 20, position: 'absolute', left: 16, top: 20 }}>
          ←
        </Link>
        <div style={{ textAlign: 'center', paddingTop: 4 }}>
          <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 4 }}>출석 체크</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>홍대 저녁 러닝 크루</div>
          <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>2026-07-31 19:30 · 홍대 놀이터</div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#6B6B6B', padding: 40 }}>불러오는 중...</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: '#E5E5E5', margin: '16px', borderRadius: 12, overflow: 'hidden' }}>
            {[
              ['총 신청', members.length, 'bg-white'],
              ['출석 확인', checked, 'bg-green-50'],
              ['미확인', members.length - checked, 'bg-red-50'],
            ].map(([label, val, bgClass]) => (
              <div key={String(label)} className={String(bgClass)} style={{ padding: '14px 0', textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 700 }}>{val}</div>
                <div style={{ fontSize: 12, color: '#6B6B6B', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {members.map((m) => (
              <div
                key={m.id}
                onClick={() => !isPending && toggle(m)}
                style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#fff', borderRadius: 12, padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', cursor: isPending ? 'not-allowed' : 'pointer', opacity: isPending ? 0.8 : 1 }}
              >
                <div className="bg-gray-100" style={{ width: 42, height: 42, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, color: '#6B6B6B' }}>
                  {m.userName[0]}
                </div>
                <div style={{ flex: 1, fontWeight: 600, fontSize: 15 }}>{m.userName}</div>
                <div
                  className={m.attended ? '' : 'bg-gray-100'}
                  style={{ width: 28, height: 28, borderRadius: '50%', ...(m.attended ? { background: 'var(--primary)' } : {}), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, fontWeight: 700 }}
                >
                  {m.attended ? <Check size={14} /> : null}
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: '20px 16px 0' }}>
            <Button
              style={{ width: '100%', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 12, padding: '15px', fontWeight: 700, fontSize: 16, cursor: 'pointer', height: 'auto' }}
            >
              출석 완료 ({checked}명)
            </Button>
          </div>
        </>
      )}

      <BottomNav />
    </div>
  );
}
