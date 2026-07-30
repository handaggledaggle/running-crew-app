import { getRunningRecords } from '@/lib/actions';
import RecordsClient from './_records-client';

export const dynamic = 'force-dynamic';

export default async function RunningRecordPage() {
  const records = await getRunningRecords();
  return <RecordsClient initialRecords={records} />;
}
