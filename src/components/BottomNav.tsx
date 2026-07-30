'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/jiyeok-peiseubyeol-moim-tamsaek-mich-pilteo', icon: 'Q', label: '탐색' },
  { href: '/moim-gaeseol-naljja-jangso-peiseu-jeongwon-seolj', icon: '+', label: '개설' },
  { href: '/chamgaja-myeongdan-johoe-mich-chulseok-chekeu-ri', icon: '#', label: '출석' },
  { href: '/reoning-girok-ipryeokgwa-nujeok-geori-tonggye', icon: '%', label: '기록' },
  { href: '/keuru-gongji-pideu', icon: '!', label: '공지' },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed bottom-0 bg-white border-t border-border flex z-[100]"
      style={{ left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430 }}
    >
      {NAV.map((n) => {
        const active = pathname === n.href;
        return (
          <Link
            key={n.href}
            href={n.href}
            className={cn(
              'flex-1 flex flex-col items-center no-underline',
              active ? 'text-brand font-bold' : 'text-muted-foreground font-normal',
            )}
            style={{ padding: '8px 0' }}
          >
            <span style={{ fontSize: 22 }}>{n.icon}</span>
            <span style={{ fontSize: 11, marginTop: 2 }}>{n.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
