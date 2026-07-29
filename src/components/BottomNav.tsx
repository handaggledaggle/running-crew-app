'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/page-1', icon: '🔍', label: '탐색' },
  { href: '/page-2', icon: '📋', label: '모임' },
  { href: '/page-3', icon: '✅', label: '출석' },
  { href: '/page-4', icon: '📊', label: '기록' },
  { href: '/page-5', icon: '📣', label: '공지' },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #eee', display: 'flex', zIndex: 100 }}>
      {tabs.map(t => {
        const active = pathname === t.href;
        return (
          <Link key={t.href} href={t.href} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 0 10px', textDecoration: 'none', color: active ? '#FF6B35' : '#999', fontSize: 11, fontWeight: active ? 700 : 400 }}>
            <span style={{ fontSize: 22, marginBottom: 2 }}>{t.icon}</span>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
