export type Verdict = 'reliable' | 'uncertain' | 'hallucinated';

export interface Claim {
  text: string;
  score: number; // 0.00 - 1.00
}

export interface AnalysisResult {
  h_score: number; // 0.00 - 1.00
  verdict: Verdict;
  fe: number; // Factual Error 0.00-1.00
  cg: number; // Confidence Gap 0.00-1.00
  cf: number; // Consistency Fail 0.00-1.00
  claims: Claim[];
  corrected_answer?: string;
  response?: string;
}

export interface ChatResult {
  reply: string;
  verdict: Verdict;
  h_score: number;
}

export type PageId = 'ask' | 'check' | 'chat' | 'settings' | 'about';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  verdict?: Verdict;
  h_score?: number;
  timestamp: number;
}
