import { TrendingUp } from 'lucide-react';

const STATS = [
  { label: 'F1-Score', value: 94.2 },
  { label: 'Precision', value: 92.8 },
  { label: 'Recall', value: 95.6 },
];

export default function PerformanceCard() {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-accent-500/5 border border-brand-100 p-4">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-4 h-4 text-brand-500" strokeWidth={2.2} />
        <h3 className="text-[12px] font-bold text-gray-700">Model Performance</h3>
      </div>
      <div className="space-y-2.5">
        {STATS.map((stat) => (
          <div key={stat.label} className="flex items-center gap-3">
            <span className="text-[11px] font-medium text-gray-500 w-16 shrink-0">
              {stat.label}
            </span>
            <div className="flex-1 h-1.5 rounded-full bg-white/60 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-400 to-accent-400 transition-all duration-1000 ease-out"
                style={{ width: `${stat.value}%` }}
              />
            </div>
            <span className="text-[11px] font-bold gradient-text w-10 text-right">
              {stat.value}%
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-brand-100/60">
        <span className="w-2 h-2 rounded-full bg-green-400 pulse-glow" />
        <span className="text-[11px] text-gray-500 font-medium">Pipeline Active</span>
      </div>
    </div>
  );
}
