import { ScanSearch, GitBranch, BarChart3, Check } from 'lucide-react';

const STAGES = [
  { num: '01', icon: ScanSearch, title: 'Retrieval Check', desc: 'Evidence validation' },
  { num: '02', icon: GitBranch, title: 'Semantic Verification', desc: 'Knowledge-graph check' },
  { num: '03', icon: BarChart3, title: 'Consistency Analysis', desc: 'Self-contradiction scan' },
];

export default function PipelineStatus() {
  return (
    <div>
      <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">
        Verification Pipeline
      </h3>
      <div className="relative flex flex-col gap-3">
        {/* Vertical gradient line */}
        <div className="absolute left-4 top-8 bottom-8 w-px bg-gradient-to-b from-brand-300 via-accent-400 to-brand-200" />
        {STAGES.map((stage, i) => {
          const Icon = stage.icon;
          return (
            <div
              key={i}
              className="relative flex items-start gap-3 animate-slide-in"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="relative z-10 w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shrink-0 shadow-soft">
                <Icon className="w-4 h-4 text-white" strokeWidth={2} />
              </div>
              <div className="pt-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-gray-300">{stage.num}</span>
                  <p className="text-[13px] font-semibold text-gray-700 leading-tight">
                    {stage.title}
                  </p>
                </div>
                <p className="text-[11px] text-gray-400">{stage.desc}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Check className="w-3 h-3 text-green-400" strokeWidth={2.5} />
                  <span className="text-[10px] text-green-500 font-medium">Complete</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
