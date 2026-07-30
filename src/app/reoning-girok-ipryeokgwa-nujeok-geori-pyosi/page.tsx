import { fetchRunRecords } from '@/app/actions';
import RunRecordClient from './RunRecordClient';

export default async function RunRecordPage() {
  const records = await fetchRunRecords();
  return <RunRecordClient initialRecords={records} />;
}
