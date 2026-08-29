import { useState } from 'react';
import { Copy, Check, RotateCcw, Brain } from 'lucide-react';

interface ResponseCardProps {
  response: string;
  onRegenerate?: () => void;
  timestamp?: string;
}

export default function ResponseCard({ response, onRegenerate, timestamp }: ResponseCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-brand-100 bg-white p-5 shadow-card animate-fade-in-up">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shrink-0 shadow-soft">
          <Brain className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              AI Generated Response
            </p>
            <div className="flex items-center gap-1">
              {timestamp && (
                <span className="text-[11px] text-gray-300 mr-2">{timestamp}</span>
              )}
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                aria-label="Copy response"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
              {onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                  aria-label="Regenerate response"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{response}</p>
        </div>
      </div>
    </div>
  );
}
