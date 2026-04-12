import { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, User } from 'lucide-react';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

interface Props {
  onClose: () => void;
}

export default function ChatBot({ onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      text: "Namaste! I'm your PlanMyWay-AI assistant. I can help you with destinations, budgets, travel tips, and custom trip ideas."
    }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setTyping(true);

    try {
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/travel-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ message: text }),
        }
      );

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data?.error || 'Failed to get chatbot response');
      }

      const reply =
        typeof data?.reply === 'string' && data.reply.trim()
          ? data.reply
          : 'Sorry, I could not generate a response right now. Please try again.';

      setMessages((prev) => [...prev, { role: 'bot', text: reply }]);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Something went wrong while contacting the assistant.';

      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: `Sorry, I couldn't respond right now. ${errorMessage}`,
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div
      className="fixed bottom-24 right-4 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-100 flex flex-col overflow-hidden"
      style={{ maxHeight: '70vh' }}
    >
      <div className="bg-amber-500 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">PlanMyWay-AI</p>
            <p className="text-white/80 text-xs">Travel Assistant</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'bot' && (
              <div className="w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5 text-amber-600" />
              </div>
            )}

            <div
              className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-amber-500 text-white rounded-tr-sm'
                  : 'bg-stone-100 text-stone-700 rounded-tl-sm'
              }`}
            >
              {msg.text}
            </div>

            {msg.role === 'user' && (
              <div className="w-7 h-7 bg-stone-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5 text-stone-500" />
              </div>
            )}
          </div>
        ))}

        {typing && (
          <div className="flex gap-2 justify-start">
            <div className="w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="bg-stone-100 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
              <span
                className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"
                style={{ animationDelay: '0ms' }}
              />
              <span
                className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"
                style={{ animationDelay: '150ms' }}
              />
              <span
                className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"
                style={{ animationDelay: '300ms' }}
              />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t border-stone-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about destinations, budgets, or trip ideas..."
            className="flex-1 px-3 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || typing}
            className="w-9 h-9 bg-amber-500 hover:bg-amber-600 disabled:bg-stone-200 text-white rounded-xl flex items-center justify-center transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
