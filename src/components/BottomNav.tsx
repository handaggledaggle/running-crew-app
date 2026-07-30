'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ClipboardList, Activity, Bell } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const NAV_ITEMS: { href: string; icon: LucideIcon; label: string }[] = [
  { href: '/jiyeok-peiseubyeol-moim-tamsaek-mich-pilteo', icon: Search, label: '탐색' },
  { href: '/chamga-sincheong-mich-chwiso', icon: ClipboardList, label: '내 모임' },
  { href: '/reoning-girok-ipryeok-mich-nujeok-geori-tonggye', icon: Activity, label: '기록' },
  { href: '/keuru-gongji-pideu-mich-pusi-alrim', icon: Bell, label: '공지' },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border flex z-50" style={{maxWidth: 480, margin: '0 auto'}}>
      {NAV_ITEMS.map(item => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link key={item.href} href={item.href}
            className={`flex-1 flex flex-col items-center py-3 gap-0.5 text-xs font-medium transition-colors ${
              active ? 'text-brand' : 'text-muted-foreground'
            }`}>
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
