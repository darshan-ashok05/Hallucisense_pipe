import type { AnalysisResult, ChatResult, Claim, Verdict } from '@/types';

export function verdictFromScore(score: number): Verdict {
  if (score < 0.35) return 'reliable';
  if (score < 0.6) return 'uncertain';
  return 'hallucinated';
}

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}

function round2(x: number): number {
  return Math.round(x * 100) / 100;
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

const MOCK_RESPONSES: { query: string; response: string }[] = [
  {
    query: 'eiffel',
    response:
      'The Eiffel Tower was constructed in 1889 for the World\'s Fair in Paris. It stands 330 meters tall and is made of wrought iron. It was originally intended to be temporary but became a permanent landmark.',
  },
  {
    query: 'photosynthesis',
    response:
      'Photosynthesis converts solar energy into chemical energy stored in glucose. This process occurs primarily in the chloroplasts of plant cells. The main pigments involved are chlorophyll a and b.',
  },
  {
    query: 'great wall',
    response:
      'The Great Wall of China was built in a single year by Emperor Qin Shi Huang. It stretches over 50,000 kilometers and was never breached. Construction used modern steel-reinforced concrete.',
  },
  {
    query: 'water boiling',
    response:
      'Water boils at 100 degrees Celsius at standard atmospheric pressure. This is a fundamental physical property. At higher altitudes, the boiling point decreases due to lower pressure.',
  },
  {
    query: 'einstein',
    response:
      'Albert Einstein was born in 1879 in Ulm, Germany. He developed the theory of relativity in 1905. His famous equation E=mc² relates mass and energy. He received the Nobel Prize in Physics in 1921.',
  },
  {
    query: 'penicillin',
    response:
      'Penicillin was discovered by Alexander Fleming in 1928 when he noticed that a mold called Penicillium notatum had antibacterial properties. This discovery revolutionized medicine and earned him the Nobel Prize in 1945.',
  },
  {
    query: 'quantum',
    response:
      'Quantum computing uses quantum bits or qubits that can exist in superposition. Unlike classical bits which are 0 or 1, qubits can be both simultaneously. This enables parallel computation for certain problems.',
  },
  {
    query: 'australia',
    response:
      'The capital of Australia is Canberra, not Sydney as commonly believed. Canberra was specifically planned and built as the capital city, chosen as a compromise between rival cities Sydney and Melbourne.',
  },
];

function pickMockResponse(query: string): string {
  const lower = query.toLowerCase();
  const match = MOCK_RESPONSES.find((m) => lower.includes(m.query));
  if (match) return match.response;
  return MOCK_RESPONSES[hashString(query) % MOCK_RESPONSES.length].response;
}

const CORRECTIONS: Record<string, string> = {
  'The Great Wall of China was built in a single year by Emperor Qin Shi Huang.':
    'The Great Wall of China was built over many centuries, beginning in the 7th century BCE.',
  'It stretches over 50,000 kilometers and was never breached.':
    'It stretches approximately 21,000 kilometers and was breached multiple times throughout history.',
  'Construction used modern steel-reinforced concrete.':
    'Construction used traditional materials such as rammed earth, stone, and brick.',
};

export function generateMockCorrected(text: string): string {
  const sentences = splitSentences(text);
  return sentences.map((s) => CORRECTIONS[s] ?? s).join(' ');
}

export function generateMockAnalysis(query: string, response: string): AnalysisResult {
  const hScore = round2(clamp01((hashString(response + query) % 10000) / 10000));
  const verdict = verdictFromScore(hScore);
  const sentences = splitSentences(response);
  const claims: Claim[] = sentences.map((s, i) => ({
    text: s,
    score: round2(clamp01(hScore + (hashString(s + i) % 30) / 100 - 0.1)),
  }));
  return {
    h_score: hScore,
    verdict,
    fe: round2(clamp01(hScore + 0.05)),
    cg: round2(clamp01(hScore - 0.1)),
    cf: round2(clamp01(hScore + (hashString(response) % 20) / 100 - 0.05)),
    claims,
    corrected_answer: verdict !== 'reliable' ? generateMockCorrected(response) : undefined,
    response,
  };
}

export function generateMockChat(message: string): ChatResult {
  const reply = pickMockResponse(message);
  const hScore = round2(clamp01((hashString(reply + message) % 10000) / 10000));
  return {
    reply,
    verdict: verdictFromScore(hScore),
    h_score: hScore,
  };
}

export const MOCK_RESPONSE_TEXT = pickMockResponse;
