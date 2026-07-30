import { getNotices } from '@/lib/actions';
import NoticeClient from './_notice-client';

export const dynamic = 'force-dynamic';

export default async function NoticeFeedPage() {
  const notices = await getNotices();
  return <NoticeClient initialNotices={notices} />;
}
