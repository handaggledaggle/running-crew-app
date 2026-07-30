import { fetchMeetups, fetchParticipants } from '@/app/actions';
import AttendanceClient from './AttendanceClient';

export default async function AttendancePage() {
  const meetups = await fetchMeetups();
  const meetup = meetups[0] ?? null;
  const participantList = meetup ? await fetchParticipants(meetup.id) : [];
  return <AttendanceClient meetup={meetup} initialParticipants={participantList} />;
}
