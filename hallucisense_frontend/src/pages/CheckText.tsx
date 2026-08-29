import { useState } from 'react';
import { FileCheck, X, Loader2 } from 'lucide-react';
import AnalysisResult from '@/components/AnalysisResult';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import { analyzeResponse } from '@/services/api';
import type { AnalysisResult as AnalysisResultType, PageId } from '@/types';

interface CheckTextProps {
  onNavigate: (page: PageId) => void;
}

export default function CheckText({ onNavigate }: CheckTextProps) {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResultType | null>(null);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!response.trim()) return;
    setLoading(true);
    setError(false);
    setResult(null);
    try {
      const analysis = await analyzeResponse(question, response);
      setResult(analysis);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuestion('');
    setResponse('');
    setResult(null);
    setError(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Check Pasted Text</h2>
        <p className="text-sm text-gray-500 mt-1">
          Already have an AI response? Paste it here and verify its factual reliability.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {/* Left: Original Question */}
          <div>
            <label className="block text-[12px] font-semibold text-gray-500 mb-1.5">
              Original Question
            </label>
            <div className="relative">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What was the original question asked?"
                rows={6}
                className="w-full px-4 py-3 rounded-xl border border-brand-100 bg-white text-sm text-gray-700 placeholder-gray-300 shadow-soft focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent transition-all resize-y"
                aria-label="Original question"
              />
              {question && (
                <button
                  type="button"
                  onClick={() => setQuestion('')}
                  className="absolute top-2 right-2 p-1 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-50 transition-colors"
                  aria-label="Clear question"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right: LLM Response */}
          <div>
            <label className="block text-[12px] font-semibold text-gray-500 mb-1.5">
              Paste LLM Response
            </label>
            <div className="relative">
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Paste the full LLM response here..."
                rows={6}
                className="w-full px-4 py-3 rounded-xl border border-brand-100 bg-white text-sm text-gray-700 placeholder-gray-300 shadow-soft focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent transition-all resize-y"
                aria-label="LLM response"
              />
              {response && (
                <button
                  type="button"
                  onClick={() => setResponse('')}
                  className="absolute top-2 right-2 p-1 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-50 transition-colors"
                  aria-label="Clear response"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleClear}
            className="px-5 py-3 rounded-xl bg-white border border-brand-100 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-brand-200 transition-all"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={loading || !response.trim()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white text-sm font-semibold shadow-soft hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileCheck className="w-4 h-4" />}
            {loading ? 'Analyzing...' : 'Check Response'}
          </button>
        </div>
      </form>

      {loading && <LoadingState />}

      {error && <ErrorState onRetry={() => handleSubmit(new Event('submit') as unknown as React.FormEvent)} />}

      {!loading && !error && !result && (
        <div className="rounded-2xl border border-dashed border-brand-200 bg-white/50 p-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-3">
            <FileCheck className="w-7 h-7 text-brand-400" strokeWidth={1.8} />
          </div>
          <p className="text-sm text-gray-400 font-medium">
            Paste an AI response above and click "Check Response" to begin analysis.
          </p>
        </div>
      )}

      {result && !loading && !error && (
        <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-card animate-fade-in-up">
          <AnalysisResult result={result} query={question} />
        </div>
      )}
    </div>
  );
}
