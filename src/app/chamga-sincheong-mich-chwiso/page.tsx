import { getMeetingDetail, checkIsJoined } from '@/lib/actions';
import JoinClient from './_join-client';

export const dynamic = 'force-dynamic';

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const meetingId = parseInt(id || '1');
  const meeting = await getMeetingDetail(meetingId);
  const isJoined = await checkIsJoined(meetingId);

  if (!meeting) {
    return (
      <div style={{ maxWidth: 430, margin: '0 auto', padding: 40, textAlign: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ fontSize: 40 }}>...</div>
        <div style={{ marginTop: 16, fontWeight: 700 }}>모임을 찾을 수 없어요</div>
      </div>
    );
  }

  return <JoinClient meeting={meeting} initialJoined={isJoined} />;
}
