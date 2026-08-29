import { useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import AnalysisResult from './AnalysisResult';
import type { ChatMessage } from '@/types';

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

const VERDICT_BADGE: Record<
  string,
  { label: string; bg: string; text: string; icon: typeof CheckCircle2 }
> = {
  reliable: { label: 'Reliable', bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle2 },
  uncertain: { label: 'Uncertain', bg: 'bg-amber-100', text: 'text-amber-700', icon: AlertTriangle },
  hallucinated: {
    label: 'Hallucination detected',
    bg: 'bg-red-100',
    text: 'text-red-700',
    icon: XCircle,
  },
};

export default function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
      <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-gradient-to-r from-brand-500 to-accent-500 text-white rounded-br-md'
              : 'bg-white border border-brand-100 text-gray-700 shadow-soft rounded-bl-md'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Verdict badge for assistant messages */}
        {!isUser && message.verdict && (
          <div className="mt-2 flex items-center gap-2">
            {(() => {
              const badge = VERDICT_BADGE[message.verdict];
              const Icon = badge.icon;
              return (
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${badge.bg} ${badge.text}`}
                >
                  <Icon className="w-3 h-3" strokeWidth={2.5} />
                  {badge.label}
                </span>
              );
            })()}
            <span className="text-[11px] text-gray-400 font-medium">
              H-Score: {message.h_score?.toFixed(2)}
            </span>
            <button
              onClick={() => setShowAnalysis((v) => !v)}
              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[11px] text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
            >
              {showAnalysis ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
              Details
            </button>
          </div>
        )}

        {/* Expandable analysis */}
        {!isUser && showAnalysis && message.verdict && (
          <div className="mt-3 w-full rounded-2xl border border-brand-100 bg-white p-5 shadow-card animate-fade-in-up">
            <AnalysisResult
              result={{
                h_score: message.h_score ?? 0,
                verdict: message.verdict,
                fe: 0,
                cg: 0,
                cf: 0,
                claims: [],
                response: message.content,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
