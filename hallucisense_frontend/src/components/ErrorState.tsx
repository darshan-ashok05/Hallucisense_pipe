import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  onRetry: () => void;
  message?: string;
}

export default function ErrorState({ onRetry, message }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
        <AlertCircle className="w-7 h-7 text-red-400" strokeWidth={2} />
      </div>
      <p className="mt-4 text-sm font-semibold text-gray-700">
        {message ?? 'Unable to connect to the verification engine.'}
      </p>
      <p className="mt-1 text-[13px] text-gray-400 text-center max-w-sm">
        Please make sure your backend is running at http://localhost:8000
      </p>
      <button
        onClick={onRetry}
        className="mt-5 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white text-sm font-semibold shadow-soft hover:shadow-glow transition-all duration-300"
      >
        <RotateCcw className="w-4 h-4" />
        Retry
      </button>
    </div>
  );
}
