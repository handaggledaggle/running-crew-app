import { getLatestMeeting, getParticipants } from '@/lib/actions';
import AttendanceClient from './_attendance-client';

export const dynamic = 'force-dynamic';

export default async function AttendancePage() {
  const meeting = await getLatestMeeting();
  const members = meeting ? await getParticipants(meeting.id) : [];

  return <AttendanceClient meeting={meeting} initialMembers={members} />;
}
