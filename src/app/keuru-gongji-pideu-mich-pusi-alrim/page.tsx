import { getNotices } from '@/app/actions/notices';
import NoticeClient from './NoticeClient';

export default async function NoticePage() {
  const initialNotices = await getNotices();
  return <NoticeClient initialNotices={initialNotices} />;
}
