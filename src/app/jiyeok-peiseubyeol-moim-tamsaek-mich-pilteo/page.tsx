import { fetchMeetups } from '@/app/actions';
import ExploreClient from './ExploreClient';

export default async function ExplorePage() {
  const meetupList = await fetchMeetups();
  return <ExploreClient initialMeetups={meetupList} />;
}
