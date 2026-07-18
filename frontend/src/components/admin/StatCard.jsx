import { cn } from '@/lib/cn';

export function StatCard({ label, value, icon: Icon, accent = 'bg-primary/10 text-primary' }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-5">
      <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', accent)}>
        <Icon size={20} />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm text-neutral-500">{label}</p>
        <p className="text-xl font-extrabold text-neutral-900">{value}</p>
      </div>
    </div>
  );
}
