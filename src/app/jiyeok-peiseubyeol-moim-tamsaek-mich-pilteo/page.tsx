import { getMeetings } from '@/app/actions/meetings';
import ExploreClient from './ExploreClient';

export default async function ExplorePage() {
  const meetings = await getMeetings();
  return <ExploreClient initialMeetings={meetings} />;
}
