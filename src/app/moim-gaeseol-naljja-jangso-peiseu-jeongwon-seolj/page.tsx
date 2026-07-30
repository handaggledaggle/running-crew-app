'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Check } from 'lucide-react';
import { createMeeting } from '@/app/actions/meetings';

export default function CreateMeetingPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    date: '',
    time: '',
    location: '',
    pace: '중급',
    capacity: 10,
    description: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await createMeeting(form);
      setSubmitted(true);
      setTimeout(() => router.push('/jiyeok-peiseubyeol-moim-tamsaek-mich-pilteo'), 1500);
    });
  }

  return (
    <div className="min-h-screen bg-muted pb-20" style={{ maxWidth: 480, margin: '0 auto' }}>
      <div className="bg-card px-4 pt-12 pb-4 shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-muted-foreground">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold text-lg text-foreground">모임 개설</h1>
        </div>
      </div>

      {submitted && (
        <div className="mx-4 mt-4 bg-success-muted border border-success rounded-xl p-4 text-center">
          <p className="text-success-muted-foreground font-semibold flex items-center justify-center gap-1">
            <Check className="w-4 h-4" /> 모임이 개설되었습니다!
          </p>
          <p className="text-success-muted-foreground text-sm mt-1">잠시 후 탐색 화면으로 이동합니다</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="px-4 pt-4 space-y-4">
        <div className="bg-card rounded-2xl p-4 shadow-sm">
          <label className="text-sm font-semibold text-secondary-foreground block mb-2">날짜</label>
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full bg-muted rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <div className="bg-card rounded-2xl p-4 shadow-sm">
          <label className="text-sm font-semibold text-secondary-foreground block mb-2">시간</label>
          <input
            type="time"
            required
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            className="w-full bg-muted rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <div className="bg-card rounded-2xl p-4 shadow-sm">
          <label className="text-sm font-semibold text-secondary-foreground block mb-2">장소</label>
          <input
            type="text"
            required
            placeholder="예: 한강 여의도 공원 이벤트광장"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full bg-muted rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <div className="bg-card rounded-2xl p-4 shadow-sm">
          <label className="text-sm font-semibold text-secondary-foreground block mb-2">페이스</label>
          <div className="flex gap-2">
            {(['초보', '중급', '고급'] as const).map((p) => (
              <Button
                type="button"
                key={p}
                onClick={() => setForm({ ...form, pace: p })}
                className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors h-auto flex-col gap-0 ${
                  form.pace === p
                    ? 'bg-brand text-brand-foreground border-brand hover:bg-brand/80'
                    : 'bg-muted text-muted-foreground border-border hover:bg-secondary'
                }`}
              >
                {p}
                <br />
                <span className="text-xs opacity-70">
                  {p === '초보' ? '7:00+' : p === '중급' ? '6:00~7:00' : '~6:00'}
                </span>
              </Button>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl p-4 shadow-sm">
          <label className="text-sm font-semibold text-secondary-foreground block mb-2">
            정원{' '}
            <span className="text-brand font-bold">{form.capacity}명</span>
          </label>
          <input
            type="range"
            min={2}
            max={30}
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
            className="w-full accent-brand"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>2명</span>
            <span>30명</span>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-4 shadow-sm">
          <label className="text-sm font-semibold text-secondary-foreground block mb-2">
            모임 설명 (선택)
          </label>
          <textarea
            rows={3}
            placeholder="모임에 대한 설명을 적어주세요"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-muted rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand resize-none"
          />
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-brand text-brand-foreground font-bold py-4 rounded-2xl text-base hover:bg-brand/80 transition-colors shadow-md disabled:opacity-60 h-auto"
        >
          {isPending ? '개설 중...' : '모임 개설하기'}
        </Button>
      </form>
      <BottomNav />
    </div>
  );
}
