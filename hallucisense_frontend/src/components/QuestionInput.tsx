import { Sparkles, Loader2, X } from 'lucide-react';

interface QuestionInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  suggestions?: string[];
  placeholder?: string;
  maxLength?: number;
}

export default function QuestionInput({
  value,
  onChange,
  onSubmit,
  loading,
  suggestions = [],
  placeholder = 'What would you like to know?',
  maxLength = 500,
}: QuestionInputProps) {
  return (
    <div>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (value.trim() && !loading) onSubmit();
            }
          }}
          placeholder={placeholder}
          rows={3}
          className="w-full px-4 py-3.5 rounded-xl border border-brand-100 bg-white text-sm text-gray-700 placeholder-gray-300 shadow-soft focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent transition-all resize-none"
          aria-label="Question input"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute top-3 right-3 p-1 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-50 transition-colors"
            aria-label="Clear input"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between mt-2">
        <span className="text-[11px] text-gray-300 font-medium">
          {value.length}/{maxLength}
        </span>
      </div>

      {suggestions.length > 0 && !value && (
        <div className="flex flex-wrap gap-2 mt-3">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => onChange(s)}
              className="px-3.5 py-1.5 rounded-full bg-white border border-brand-100 text-[13px] text-gray-500 hover:text-brand-600 hover:border-brand-300 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={loading || !value.trim()}
        className="mt-4 flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white text-sm font-semibold shadow-soft hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        {loading ? 'Analyzing response...' : 'Ask & Verify'}
      </button>
    </div>
  );
}
