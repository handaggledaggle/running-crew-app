import type { Metadata } from 'next';
export const metadata: Metadata = { title: '러닝 크루', description: '동네 러닝 모임 앱' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, fontFamily: 'system-ui,-apple-system,sans-serif', background: '#F8F8F8', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto', minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  );
}
