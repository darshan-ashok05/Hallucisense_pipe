import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import HallucinationGauge from './HallucinationGauge';
import VerdictBanner from './VerdictBanner';
import MetricCard from './MetricCard';
import SentenceBreakdown from './SentenceBreakdown';
import CorrectedAnswer from './CorrectedAnswer';
import type { AnalysisResult } from '@/types';

interface AnalysisResultProps {
  result: AnalysisResult;
  query?: string;
}

const METRICS = [
  { key: 'h_score' as const, label: 'H-Score', desc: 'Overall hallucination' },
  { key: 'fe' as const, label: 'Factual Error', desc: 'Detected factual errors' },
  { key: 'cg' as const, label: 'Confidence Gap', desc: 'Model confidence mismatch' },
  { key: 'cf' as const, label: 'Consistency Fail', desc: 'Self-contradiction rate' },
];

export default function AnalysisResult({ result, query = '' }: AnalysisResultProps) {
  const [showDetails, setShowDetails] = useState(false);
  const showCorrectButton = result.verdict !== 'reliable';

  return (
    <div className="animate-fade-in-up">
      {/* Gauge + Verdict */}
      <div className="flex flex-col items-center gap-5">
        <HallucinationGauge score={result.h_score} />
        <VerdictBanner verdict={result.verdict} />
      </div>

      {/* Corrected answer button */}
      {showCorrectButton && (
        <CorrectedAnswer query={query} response={result.response ?? ''} />
      )}

      {/* Technical details toggle */}
      <div className="mt-6">
        <button
          onClick={() => setShowDetails((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-brand-50/60 hover:bg-brand-50 transition-colors text-sm font-semibold text-brand-600"
          aria-expanded={showDetails}
        >
          <span>Show technical details</span>
          {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showDetails && (
          <div className="mt-4 space-y-5 animate-fade-in">
            {/* Metric cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {METRICS.map((m) => (
                <MetricCard
                  key={m.key}
                  label={m.label}
                  value={result[m.key]}
                  description={m.desc}
                />
              ))}
            </div>

            {/* Sentence-level breakdown */}
            <SentenceBreakdown claims={result.claims} />
          </div>
        )}
      </div>
    </div>
  );
}
