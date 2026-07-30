'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, BarChart2, Bell, CheckSquare } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/jiyeok-peiseubyeol-moim-tamsaek-mich-pilteo', label: '탐색', Icon: Search },
  { href: '/reoning-hu-girok-ipryeokgwa-nujeok-geori-pyosi', label: '기록', Icon: BarChart2 },
  { href: '/keuru-gongji-pideu', label: '크루', Icon: Bell },
  { href: '/chamgaja-myeongdan-johoe-mich-chulseok-chekeu', label: '출석', Icon: CheckSquare },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #E5E5E5', display: 'flex', zIndex: 100 }}>
      {NAV_ITEMS.map((item) => (
        <Link key={item.href} href={item.href} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0 12px', textDecoration: 'none', color: pathname === item.href ? 'var(--primary)' : '#6B6B6B', fontWeight: pathname === item.href ? 700 : 400, fontSize: 12, gap: 2 }}>
          <item.Icon size={22} />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
