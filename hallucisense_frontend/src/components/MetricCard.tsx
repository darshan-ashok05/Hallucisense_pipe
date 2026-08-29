interface MetricCardProps {
  label: string;
  value: number; // 0.00 - 1.00
  description: string;
}

function colorForValue(v: number): string {
  if (v < 0.35) return 'bg-green-400';
  if (v < 0.6) return 'bg-amber-400';
  return 'bg-red-400';
}

export default function MetricCard({ label, value, description }: MetricCardProps) {
  const barColor = colorForValue(value);
  return (
    <div className="rounded-xl border border-brand-100 bg-white p-4 shadow-soft hover:shadow-card transition-shadow duration-300">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      <p className="text-2xl font-bold gradient-text mt-1">{value.toFixed(2)}</p>
      <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-1000 ease-out`}
          style={{ width: `${value * 100}%` }}
        />
      </div>
      <p className="text-[10px] text-gray-400 mt-1.5">{description}</p>
    </div>
  );
}
