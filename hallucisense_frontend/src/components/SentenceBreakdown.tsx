import { useState } from 'react';
import { Check, AlertTriangle, X } from 'lucide-react';
import type { Claim } from '@/types';

interface SentenceBreakdownProps {
  claims: Claim[];
}

function claimStyle(score: number): { bg: string; text: string; border: string; icon: typeof Check } {
  if (score < 0.35)
    return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: Check };
  if (score < 0.6)
    return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: AlertTriangle };
  return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: X };
}

export default function SentenceBreakdown({ claims }: SentenceBreakdownProps) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="rounded-xl border border-brand-100 bg-white p-5 shadow-soft">
      <h4 className="text-sm font-bold text-gray-700 mb-3">Sentence-Level Breakdown</h4>
      <div className="flex flex-col gap-2">
        {claims.map((claim, i) => {
          const style = claimStyle(claim.score);
          const Icon = style.icon;
          const isOpen = expanded === i;
          return (
            <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
              <button
                onClick={() => setExpanded(isOpen ? null : i)}
                className={`w-full flex items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-left transition-all hover:shadow-soft ${style.bg} ${style.border}`}
              >
                <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${style.text}`} strokeWidth={2.2} />
                <span className="text-[13px] text-gray-700 leading-snug flex-1">{claim.text}</span>
                <span className={`text-[11px] font-bold shrink-0 mt-0.5 ${style.text}`}>
                  {claim.score.toFixed(2)}
                </span>
              </button>
              {isOpen && (
                <div className="mt-1.5 ml-7 rounded-lg bg-gray-50 px-3.5 py-2.5 animate-fade-in">
                  <p className="text-[12px] text-gray-500">
                    <span className="font-semibold text-gray-600">Score: </span>
                    {claim.score.toFixed(2)} —{' '}
                    {claim.score < 0.35
                      ? 'This claim appears factually reliable.'
                      : claim.score < 0.6
                        ? 'This claim has some uncertainty and should be verified.'
                        : 'This claim is likely hallucinated and needs correction.'}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
