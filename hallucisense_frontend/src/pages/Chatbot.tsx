import { useState } from 'react';
import ChatWindow from '@/components/ChatWindow';
import ChatInput from '@/components/ChatInput';
import { chatWithAI } from '@/services/api';
import type { ChatMessage } from '@/types';

let idCounter = 0;
const nextId = () => `msg-${++idCounter}`;

export default function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (text: string) => {
    const userMsg: ChatMessage = {
      id: nextId(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);
    try {
      const result = await chatWithAI(text, messages);
      setMessages((m) => [
        ...m,
        {
          id: nextId(),
          role: 'assistant',
          content: result.reply,
          verdict: result.verdict,
          h_score: result.h_score,
          timestamp: Date.now(),
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: nextId(),
          role: 'assistant',
          content: 'Unable to get a response. Please try again.',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">HalluciSense AI</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Ask anything. Every response is automatically verified.
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50">
            <span className="w-2 h-2 rounded-full bg-green-400 pulse-glow" />
            <span className="text-[12px] text-green-600 font-medium">Verification active</span>
          </div>
        </div>
      </div>

      <ChatWindow messages={messages} loading={loading} />

      <div className="mt-4">
        <ChatInput onSend={handleSend} loading={loading} />
      </div>
    </div>
  );
}
