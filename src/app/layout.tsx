import type { Metadata } from 'next';
import BottomNav from '@/components/BottomNav';
export const metadata: Metadata = { title: '러닝크루' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, background: '#F8F8F8', fontFamily: '-apple-system, sans-serif', maxWidth: 430, marginInline: 'auto' }}>
        <div style={{ paddingBottom: 68 }}>{children}</div>
        <BottomNav />
      </body>
    </html>
  );
}
