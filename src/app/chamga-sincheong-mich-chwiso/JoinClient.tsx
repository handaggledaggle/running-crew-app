'use client';
import { useState, useTransition } from 'react';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import PaceBadge from '@/components/PaceBadge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Timer, Users, ClipboardList, Check, ChevronLeft } from 'lucide-react';
import { type Pace } from '@/lib/data';
import { type MeetingRow, type ParticipantRow, joinMeeting, cancelJoin } from '@/app/actions/meetings';

type Props = {
  meeting: MeetingRow;
  participants: ParticipantRow[];
};

export default function JoinClient({ meeting, participants }: Props) {
  const [joined, setJoined] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [toast, setToast] = useState('');
  const [isPending, startTransition] = useTransition();

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  function handleJoin() {
    startTransition(async () => {
      await joinMeeting(meeting.id);
      setJoined(true);
      showToast('참가 신청이 완료되었습니다!');
    });
  }

  function handleCancel() {
    startTransition(async () => {
      await cancelJoin(meeting.id);
      setShowCancel(false);
      setJoined(false);
      showToast('참가가 취소되었습니다');
    });
  }

  return (
    <div className="min-h-screen bg-muted pb-20" style={{ maxWidth: 480, margin: '0 auto' }}>
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-foreground text-primary-foreground text-sm px-5 py-3 rounded-full shadow-lg">
          {toast}
        </div>
      )}

      {showCancel && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
          <div className="bg-card w-full rounded-t-3xl p-6">
            <h3 className="font-bold text-foreground text-lg mb-2">참가를 취소할까요?</h3>
            <p className="text-muted-foreground text-sm mb-5">취소하면 자리가 다른 러너에게 돌아갑니다.</p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowCancel(false)}
                className="flex-1 py-3 border border-border rounded-xl text-muted-foreground font-medium h-auto"
              >
                유지
              </Button>
              <Button
                onClick={handleCancel}
                disabled={isPending}
                className="flex-1 py-3 bg-destructive rounded-xl text-white font-bold disabled:opacity-60 h-auto hover:bg-destructive/80"
              >
                취소하기
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-card px-4 pt-12 pb-4 shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link href="/jiyeok-peiseubyeol-moim-tamsaek-mich-pilteo" className="text-muted-foreground">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="font-bold text-lg text-foreground">모임 상세</h1>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-3">
        <div className="bg-card rounded-2xl p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <h2 className="font-bold text-foreground text-lg flex-1">{meeting.title}</h2>
            <PaceBadge pace={meeting.pace as Pace} />
          </div>
          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 shrink-0" />
              <span>
                {meeting.date} {meeting.time}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>{meeting.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 shrink-0" />
              <span>페이스 {meeting.paceMin}/km</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 shrink-0" />
              <span>
                {meeting.participants}/{meeting.capacity}명 참가 중
              </span>
              <div className="flex-1 bg-muted rounded-full h-1.5">
                <div
                  className="bg-brand h-1.5 rounded-full"
                  style={{ width: `${(meeting.participants / meeting.capacity) * 100}%` }}
                />
              </div>
            </div>
          </div>
          {meeting.description && (
            <p className="mt-3 text-sm text-muted-foreground">{meeting.description}</p>
          )}
        </div>

        {/* Map placeholder */}
        <div className="bg-secondary rounded-2xl h-40 flex items-center justify-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground text-sm">지도 미리보기 - {meeting.location}</span>
        </div>

        {/* Participants */}
        <div className="bg-card rounded-2xl p-4 shadow-sm">
          <p className="text-sm font-semibold text-secondary-foreground mb-3">
            참가자 {participants.length}명
          </p>
          <div className="flex gap-2 flex-wrap">
            {participants.map((p) => (
              <div key={p.id} className="flex flex-col items-center gap-1">
                <div className="w-9 h-9 rounded-full bg-brand-muted flex items-center justify-center text-xs font-bold text-brand-muted-foreground">
                  {p.userAvatar}
                </div>
                <span className="text-xs text-muted-foreground">{p.userName.slice(0, 2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Leader manage btn */}
        <Link
          href={`/chamgaja-myeongdan-johoe-mich-chulseok-chekeu-ri?id=${meeting.id}`}
          className="flex items-center justify-center gap-2 bg-muted text-foreground text-sm py-2.5 rounded-xl font-medium hover:bg-secondary transition-colors"
        >
          <ClipboardList className="w-4 h-4" />
          참가자 명단 관리 (리더 전용)
        </Link>
      </div>

      {/* CTA */}
      <div className="fixed bottom-16 left-0 right-0 px-4 pb-2" style={{ maxWidth: 480, margin: '0 auto' }}>
        {!joined ? (
          <Button
            onClick={handleJoin}
            disabled={isPending}
            className="w-full bg-brand text-brand-foreground font-bold py-4 rounded-2xl text-base hover:bg-brand/80 transition-colors shadow-md disabled:opacity-60 h-auto"
          >
            {isPending ? '신청 중...' : '참가 신청하기'}
          </Button>
        ) : (
          <Button
            onClick={() => setShowCancel(true)}
            className="w-full bg-foreground text-primary-foreground font-bold py-4 rounded-2xl text-base hover:bg-foreground/90 transition-colors shadow-md h-auto flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            참가 신청됨 · 취소하기
          </Button>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
