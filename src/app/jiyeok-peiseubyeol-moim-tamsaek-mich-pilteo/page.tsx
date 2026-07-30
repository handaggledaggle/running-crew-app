import { getMeetings } from '@/lib/actions';
import ExploreClient from './_explore-client';

export const dynamic = 'force-dynamic';

export default async function ExplorePage() {
  const meetings = await getMeetings();
  return <ExploreClient initialMeetings={meetings} />;
}
