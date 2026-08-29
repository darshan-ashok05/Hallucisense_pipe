import { useState } from 'react';
import { Sparkles, Loader2, Copy, Check, RotateCcw } from 'lucide-react';
import { getCorrectedAnswer } from '@/services/api';

interface CorrectedAnswerProps {
  query: string;
  response: string;
}

export default function CorrectedAnswer({ query, response }: CorrectedAnswerProps) {
  const [corrected, setCorrected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const text = await getCorrectedAnswer(query, response);
      setCorrected(text);
    } catch {
      setCorrected('Unable to generate corrected answer.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!corrected) return;
    navigator.clipboard.writeText(corrected);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!corrected) {
    return (
      <div className="flex justify-center mt-5">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white text-sm font-semibold shadow-soft hover:shadow-glow transition-all duration-300 disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {loading ? 'Generating...' : 'Generate Corrected Answer'}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-5 rounded-2xl border-2 border-green-300 bg-green-50/60 p-5 animate-fade-in-up">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Check className="w-5 h-5 text-green-600" strokeWidth={2.2} />
          <h4 className="text-sm font-bold text-green-800">Corrected Answer</h4>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-green-600 hover:bg-green-100 transition-colors"
            aria-label="Copy corrected answer"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={handleGenerate}
            className="p-1.5 rounded-lg text-green-600 hover:bg-green-100 transition-colors"
            aria-label="Regenerate corrected answer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">{corrected}</p>
    </div>
  );
}
