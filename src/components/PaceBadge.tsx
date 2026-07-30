import { Pace } from '@/lib/data';

const paceColor: Record<Pace, string> = {
  '초보': 'bg-success-muted text-success-muted-foreground',
  '중급': 'bg-info-muted text-info-muted-foreground',
  '고급': 'bg-destructive/10 text-destructive',
};

export default function PaceBadge({ pace }: { pace: Pace }) {
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${paceColor[pace]}`}>
      {pace}
    </span>
  );
}
