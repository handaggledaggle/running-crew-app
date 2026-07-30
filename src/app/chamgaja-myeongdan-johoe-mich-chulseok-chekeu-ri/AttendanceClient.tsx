'use client';
import { useState, useTransition } from 'react';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Check, ChevronLeft } from 'lucide-react';
import { type MeetingRow, type ParticipantRow } from '@/app/actions/meetings';
import { toggleAttendance, markAllAttended } from '@/app/actions/attendance';

type Props = {
  meeting: MeetingRow;
  initialParticipants: ParticipantRow[];
};

export default function AttendanceClient({ meeting, initialParticipants }: Props) {
  const [attendance, setAttendance] = useState<Record<number, boolean>>(
    Object.fromEntries(initialParticipants.map((p) => [p.id, p.attended]))
  );
  const [allDone, setAllDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleToggle(p: ParticipantRow) {
    const current = attendance[p.id] ?? false;
    setAttendance((prev) => ({ ...prev, [p.id]: !current }));
    startTransition(async () => {
      await toggleAttendance(p.id, current);
    });
  }

  function handleMarkAll() {
    const allPresent = Object.fromEntries(initialParticipants.map((p) => [p.id, true]));
    setAttendance(allPresent);
    setAllDone(true);
    setTimeout(() => setAllDone(false), 2000);
    startTransition(async () => {
      await markAllAttended(meeting.id);
    });
  }

  const checkedCount = Object.values(attendance).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-muted pb-20" style={{ maxWidth: 480, margin: '0 auto' }}>
      <div className="bg-card px-4 pt-12 pb-4 shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link
            href={`/chamga-sincheong-mich-chwiso?id=${meeting.id}`}
            className="text-muted-foreground"
          >
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="font-bold text-lg text-foreground">참가자 명단</h1>
            <p className="text-xs text-muted-foreground">
              {meeting.date} · {meeting.title}
            </p>
          </div>
        </div>
      </div>

      {allDone && (
        <div className="mx-4 mt-4 bg-success-muted border border-success rounded-xl p-3 text-center text-success-muted-foreground text-sm font-medium flex items-center justify-center gap-1">
          <Check className="w-4 h-4" />
          전체 출석 처리 완료!
        </div>
      )}

      {/* Summary bar */}
      <div className="mx-4 mt-4 bg-card rounded-2xl p-4 shadow-sm flex gap-4">
        <div className="flex-1 text-center">
          <p className="text-2xl font-bold text-foreground">{initialParticipants.length}</p>
          <p className="text-xs text-muted-foreground mt-0.5">총 참가자</p>
        </div>
        <div className="w-px bg-muted" />
        <div className="flex-1 text-center">
          <p className="text-2xl font-bold text-brand">{checkedCount}</p>
          <p className="text-xs text-muted-foreground mt-0.5">출석 완료</p>
        </div>
        <div className="w-px bg-muted" />
        <div className="flex-1 text-center">
          <p className="text-2xl font-bold text-muted-foreground">
            {initialParticipants.length - checkedCount}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">미출석</p>
        </div>
      </div>

      {/* Participant checklist */}
      <div className="px-4 mt-3 space-y-2">
        {initialParticipants.map((p) => (
          <div
            key={p.id}
            onClick={() => handleToggle(p)}
            className="bg-card rounded-2xl px-4 py-3 shadow-sm flex items-center gap-3 cursor-pointer active:bg-muted transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-brand-muted flex items-center justify-center text-sm font-bold text-brand-muted-foreground">
              {p.userAvatar}
            </div>
            <span className="flex-1 font-medium text-foreground text-sm">{p.userName}</span>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                attendance[p.id] ? 'bg-brand' : 'bg-muted border border-input'
              }`}
            >
              {attendance[p.id] && <Check className="w-3 h-3 text-white" />}
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 mt-4">
        <Button
          onClick={handleMarkAll}
          disabled={isPending}
          className="w-full bg-brand text-brand-foreground font-bold py-3.5 rounded-2xl text-sm hover:bg-brand/80 transition-colors shadow-md disabled:opacity-60 h-auto"
        >
          전체 출석 처리
        </Button>
      </div>
      <BottomNav />
    </div>
  );
}
