import { getRunRecords, getMonthlyStats } from '@/app/actions/run-records';
import RunRecordClient from './RunRecordClient';

export default async function RunRecordPage() {
  const [records, monthlyStats] = await Promise.all([getRunRecords(), getMonthlyStats()]);
  return <RunRecordClient initialRecords={records} monthlyStats={monthlyStats} />;
}
