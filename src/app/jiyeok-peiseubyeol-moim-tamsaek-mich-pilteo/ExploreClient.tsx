'use client';
import { useState } from 'react';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import PaceBadge from '@/components/PaceBadge';
import { Button } from '@/components/ui/button';
import { Activity, Bell, Calendar, Timer, Plus } from 'lucide-react';
import { type Pace } from '@/lib/data';
import { type MeetingRow } from '@/app/actions/meetings';

const DISTRICTS = ['강남구', '서초구', '마포구', '송파구', '용산구'] as const;
const PACES = ['초보', '중급', '고급'] as const;

type Props = { initialMeetings: MeetingRow[] };

export default function ExploreClient({ initialMeetings }: Props) {
  const [selDistrict, setSelDistrict] = useState<string | null>(null);
  const [selPace, setSelPace] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = initialMeetings.filter((m) => {
    if (selDistrict && m.district !== selDistrict) return false;
    if (selPace && m.pace !== selPace) return false;
    if (search && !m.location.includes(search) && !m.title.includes(search)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-muted pb-20" style={{ maxWidth: 480, margin: '0 auto' }}>
      {/* Header */}
      <div className="bg-card px-4 pt-12 pb-4 shadow-sm sticky top-0 z-40">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-brand" />
            <span className="font-bold text-lg text-foreground">동네 러닝 모임</span>
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Bell className="w-5 h-5" />
          </Button>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="장소나 모임명으로 검색"
          className="w-full bg-muted rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand"
        />
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {DISTRICTS.map((d) => (
            <Button
              key={d}
              variant="outline"
              size="sm"
              onClick={() => setSelDistrict(selDistrict === d ? null : d)}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-medium border transition-colors h-auto ${
                selDistrict === d
                  ? 'bg-brand text-brand-foreground border-brand hover:bg-brand/80'
                  : 'bg-card text-muted-foreground border-border hover:bg-muted'
              }`}
            >
              {d}
            </Button>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          {PACES.map((p) => (
            <Button
              key={p}
              variant="outline"
              size="sm"
              onClick={() => setSelPace(selPace === p ? null : p)}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-medium border transition-colors h-auto ${
                selPace === p
                  ? 'bg-brand text-brand-foreground border-brand hover:bg-brand/80'
                  : 'bg-card text-muted-foreground border-border hover:bg-muted'
              }`}
            >
              {p}
            </Button>
          ))}
        </div>
      </div>

      {/* Meeting Cards */}
      <div className="px-4 pt-4 space-y-3">
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-10 text-sm">조건에 맞는 모임이 없어요</p>
        )}
        {filtered.map((m) => (
          <div key={m.id} className="bg-card rounded-2xl p-4 shadow-sm border border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-foreground text-base">{m.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {m.district} · {m.location}
                </p>
              </div>
              <PaceBadge pace={m.pace as Pace} />
            </div>
            <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {m.date} {m.time}
              </span>
              <span className="flex items-center gap-1">
                <Timer className="w-3 h-3" /> {m.paceMin}/km
              </span>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-brand-muted flex items-center justify-center text-xs font-bold text-brand-muted-foreground">
                  {m.leaderAvatar}
                </div>
                <span className="text-xs text-muted-foreground">{m.leaderName}</span>
                <span className="text-xs text-muted-foreground">
                  · {m.participants}/{m.capacity}명
                </span>
              </div>
              <Link
                href={`/chamga-sincheong-mich-chwiso?id=${m.id}`}
                className="bg-brand text-brand-foreground text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-brand/80 transition-colors"
              >
                참가 신청
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* FAB - 모임 개설 */}
      <Link
        href="/moim-gaeseol-naljja-jangso-peiseu-jeongwon-seolj"
        className="fixed bottom-20 right-4 bg-brand text-brand-foreground rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-brand/80 transition-colors z-40"
      >
        <Plus className="w-6 h-6" />
      </Link>

      <BottomNav />
    </div>
  );
}
