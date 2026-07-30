import { getMeetingById, getMeetingParticipants } from '@/app/actions/meetings';
import AttendanceClient from './AttendanceClient';

export default async function AttendancePage({
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
  return <AttendanceClient meeting={meeting} initialParticipants={participants} />;
}
