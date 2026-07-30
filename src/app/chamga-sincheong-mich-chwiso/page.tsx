import { getMeetingById, getMeetingParticipants } from '@/app/actions/meetings';
import JoinClient from './JoinClient';

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const meetingId = id ? Number(id) : 1;
  const [meeting, participants] = await Promise.all([
    getMeetingById(meetingId),
    getMeetingParticipants(meetingId),
  ]);
  return <JoinClient meeting={meeting} participants={participants} />;
}
