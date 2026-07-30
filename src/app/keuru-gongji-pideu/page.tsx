import { fetchNotices } from '@/app/actions';
import FeedClient from './FeedClient';

export default async function FeedPage() {
  const noticeList = await fetchNotices();
  return <FeedClient initialNotices={noticeList} />;
}
