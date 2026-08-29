import type { AnalysisResult, ChatResult } from '@/types';
import {
  generateMockAnalysis,
  generateMockChat,
  generateMockCorrected,
} from '@/data/mockData';

// ─────────────────────────────────────────────────────────────────────────────
// HalluciSense API Service Layer
//
// This is the ONLY module that talks to the backend. Flip USE_MOCK_API to false
// when your backend is running at API_BASE_URL and the same function calls will
// hit your real endpoints.
//
// Expected endpoints (default http://localhost:8000):
//
//   POST /api/analyze   { query, response }
//     -> { h_score, verdict, fe, cg, cf, claims: [{text, score}], corrected_answer }
//
//   POST /api/chat      { message, history }
//     -> { reply, verdict, h_score }
//
// ─────────────────────────────────────────────────────────────────────────────

const API_BASE_URL = 'http://localhost:8000';

// Set to false when your backend is ready
const USE_MOCK_API = false;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Analyze a question + LLM response pair for hallucinations.
 */
export async function analyzeResponse(
  query: string,
  response: string
): Promise<AnalysisResult> {
  if (!USE_MOCK_API) {
    const res = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, response }),
    });
    if (!res.ok) throw new Error(`Analysis failed: ${res.status}`);
    return (await res.json()) as AnalysisResult;
  }

  await delay(900);
  return generateMockAnalysis(query, response);
}

/**
 * Chat endpoint — returns a reply + verdict for a single message.
 */
export async function chatWithAI(
  message: string,
  history: { role: string; content: string }[]
): Promise<ChatResult> {
  if (!USE_MOCK_API) {
    const res = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    });
    if (!res.ok) throw new Error(`Chat failed: ${res.status}`);
    return (await res.json()) as ChatResult;
  }

  await delay(800);
  return generateMockChat(message);
}

/**
 * Request a corrected version of a hallucinated response.
 */
export async function getCorrectedAnswer(
  query: string,
  response: string
): Promise<string> {
  if (!USE_MOCK_API) {
    const res = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, response, correct: true }),
    });
    if (!res.ok) throw new Error(`Correction failed: ${res.status}`);
    const data = await res.json();
    return data.corrected_answer ?? '';
  }

  await delay(700);
  return generateMockCorrected(response);
}

export { API_BASE_URL, USE_MOCK_API };
