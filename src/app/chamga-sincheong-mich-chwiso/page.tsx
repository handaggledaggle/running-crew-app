import { fetchMeetups } from '@/app/actions';
import ApplyClient from './ApplyClient';

export default async function ApplyPage() {
  const meetups = await fetchMeetups();
  const meetup = meetups[0] ?? null;
  return <ApplyClient meetup={meetup} />;
}
