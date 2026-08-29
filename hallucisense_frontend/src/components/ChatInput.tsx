import { useState } from 'react';
import { Send, Paperclip, Smile, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  loading: boolean;
}

export default function ChatInput({ onSend, loading }: ChatInputProps) {
  const [value, setValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !loading) {
        onSend(value.trim());
        setValue('');
      }
    }
  };

  const handleSend = () => {
    if (value.trim() && !loading) {
      onSend(value.trim());
      setValue('');
    }
  };

  return (
    <div className="flex items-end gap-2 pb-2">
      <div className="flex-1 flex items-end gap-1 rounded-2xl border border-brand-100 bg-white px-3 py-2 shadow-soft focus-within:ring-2 focus-within:ring-brand-300 transition-all">
        <button
          className="p-1.5 rounded-lg text-gray-300 hover:text-brand-500 transition-colors"
          aria-label="Attach file"
        >
          <Paperclip className="w-[18px] h-[18px]" />
        </button>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask HalluciSense anything..."
          rows={1}
          className="flex-1 px-1 py-1.5 text-sm text-gray-700 placeholder-gray-300 bg-transparent resize-none focus:outline-none max-h-32"
          aria-label="Chat message input"
        />
        <button
          className="p-1.5 rounded-lg text-gray-300 hover:text-brand-500 transition-colors"
          aria-label="Emoji"
        >
          <Smile className="w-[18px] h-[18px]" />
        </button>
      </div>
      <button
        onClick={handleSend}
        disabled={loading || !value.trim()}
        className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-soft hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        aria-label="Send message"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
      </button>
    </div>
  );
}
