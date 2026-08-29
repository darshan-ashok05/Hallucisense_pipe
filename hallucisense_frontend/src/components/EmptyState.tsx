import { Brain, Search, FileCheck, MessageSquare } from 'lucide-react';
import type { PageId } from '@/types';

interface EmptyStateProps {
  onNavigate: (page: PageId) => void;
}

const ACTIONS: { page: PageId; label: string; icon: typeof Search }[] = [
  { page: 'ask', label: 'Ask a Question', icon: Search },
  { page: 'check', label: 'Check Pasted Text', icon: FileCheck },
  { page: 'chat', label: 'Open Chatbot', icon: MessageSquare },
];

export default function EmptyState({ onNavigate }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="relative">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-glow pulse-glow">
          <Brain className="w-10 h-10 text-white" strokeWidth={1.8} />
        </div>
      </div>
      <h3 className="mt-6 text-xl font-bold text-gray-700">Ready to verify</h3>
      <p className="mt-2 text-sm text-gray-500 text-center max-w-md leading-relaxed">
        Ask a question or paste an AI-generated response to begin. HalluciSense
        checks responses through multiple verification stages.
      </p>
      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.page}
              onClick={() => onNavigate(action.page)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-brand-100 text-sm font-medium text-gray-600 shadow-soft hover:text-brand-600 hover:border-brand-300 hover:shadow-card transition-all duration-300"
            >
              <Icon className="w-4 h-4" />
              {action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
