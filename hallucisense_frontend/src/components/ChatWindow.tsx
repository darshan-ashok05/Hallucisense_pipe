import { useRef, useEffect } from 'react';
import ChatMessageBubble from './ChatMessageBubble';
import type { ChatMessage } from '@/types';

interface ChatWindowProps {
  messages: ChatMessage[];
  loading: boolean;
}

export default function ChatWindow({ messages, loading }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto space-y-4 rounded-2xl border border-brand-100 bg-white/60 p-5 shadow-soft"
    >
      {messages.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center h-full py-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center mb-3 shadow-glow">
            <span className="text-2xl">🤖</span>
          </div>
          <p className="text-sm text-gray-400 font-medium">
            Start the conversation — send a message below.
          </p>
        </div>
      )}

      {messages.map((msg) => (
        <ChatMessageBubble key={msg.id} message={msg} />
      ))}

      {loading && (
        <div className="flex justify-start animate-fade-in">
          <div className="rounded-2xl rounded-bl-md bg-white border border-brand-100 shadow-soft px-4 py-3">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full bg-brand-300 animate-bounce"
                style={{ animationDelay: '0ms' }}
              />
              <span
                className="w-2 h-2 rounded-full bg-brand-400 animate-bounce"
                style={{ animationDelay: '150ms' }}
              />
              <span
                className="w-2 h-2 rounded-full bg-brand-500 animate-bounce"
                style={{ animationDelay: '300ms' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
