import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '러닝 크루 모임',
  description: '동네 러닝 모임을 찾고 참가하세요',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, fontFamily: "'Noto Sans KR', sans-serif", background: '#F8F8F8', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto', minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  );
}
