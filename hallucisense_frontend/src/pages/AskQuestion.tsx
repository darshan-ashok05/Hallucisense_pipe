import { useState } from 'react';
import QuestionInput from '@/components/QuestionInput';
import ResponseCard from '@/components/ResponseCard';
import AnalysisResult from '@/components/AnalysisResult';
import EmptyState from '@/components/EmptyState';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import { analyzeResponse } from '@/services/api';
import { MOCK_RESPONSE_TEXT } from '@/data/mockData';
import type { AnalysisResult as AnalysisResultType, PageId } from '@/types';

const SUGGESTIONS = [
  'Explain quantum computing in simple terms',
  'Who discovered penicillin?',
  'What is the capital of Australia?',
];

interface AskQuestionProps {
  onNavigate: (page: PageId) => void;
}

export default function AskQuestion({ onNavigate }: AskQuestionProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResultType | null>(null);
  const [error, setError] = useState(false);
  const [timestamp, setTimestamp] = useState('');

  const handleSubmit = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(false);
    setResult(null);
    try {
      const response = MOCK_RESPONSE_TEXT(query);
      const analysis = await analyzeResponse(query, response);
      setResult(analysis);
      setTimestamp(new Date().toLocaleTimeString());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Hero card */}
      <div className="rounded-2xl border border-brand-100 bg-white/80 backdrop-blur-sm p-6 shadow-card mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Ask a Question</h2>
        <p className="text-sm text-gray-500 mt-1 mb-5">
          Ask a question and analyze the generated response for potential hallucinations.
        </p>
        <QuestionInput
          value={query}
          onChange={setQuery}
          onSubmit={handleSubmit}
          loading={loading}
          suggestions={SUGGESTIONS}
        />
      </div>

      {loading && <LoadingState />}

      {error && <ErrorState onRetry={handleSubmit} />}

      {!loading && !error && !result && <EmptyState onNavigate={onNavigate} />}

      {result && !loading && !error && (
        <div className="space-y-5">
          <ResponseCard response={result.response ?? ''} timestamp={timestamp} />
          <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-card">
            <AnalysisResult result={result} query={query} />
          </div>
        </div>
      )}
    </div>
  );
}
