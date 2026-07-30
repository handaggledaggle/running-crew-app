'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/jiyeok-peiseubyeol-moim-tamsaek-mich-pilteo', label: '탐색', icon: '🔍' },
  { href: '/keuru-gongji-pideu', label: '피드', icon: '📣' },
  { href: '/reoning-girok-ipryeokgwa-nujeok-geori-pyosi', label: '기록', icon: '📊' },
  { href: '/chamgaja-myeongdan-johoe-mich-chulseok-chekeu-ri', label: '관리', icon: '✅' },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, maxWidth: 480, margin: '0 auto', background: '#fff', borderTop: '1px solid #E5E7EB', display: 'flex', zIndex: 100 }}>
      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link key={item.href} href={item.href} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0', textDecoration: 'none', color: active ? '#FF6B35' : '#9CA3AF', fontSize: 11, fontWeight: active ? 700 : 400 }}>
            <span style={{ fontSize: 20, marginBottom: 2 }}>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
