'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import OptiAvatar from './OptiAvatar';
import type { ChatMessage, Roadmap, StoredSession } from '@/lib/types';
import {
  getStoredSession,
  saveStoredSession,
  parseRoadmapFromResponse,
  stripRoadmapJson,
} from '@/lib/storage';

interface ChatPanelProps {
  userId: string;
  onRoadmapUpdate: (roadmap: Roadmap) => void;
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M14 8L2 2.5L5 8M14 8L2 13.5L5 8M14 8H5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ChatPanel({ userId, onRoadmapUpdate }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<StoredSession | null>(null);
  const [initialized, setInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [input]);

  const sendToN8n = useCallback(
    async (text: string, currentSession: StoredSession) => {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId: currentSession.sessionId }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      return data.output as string;
    },
    []
  );

  const processResponse = useCallback(
    (rawOutput: string, prevMessages: ChatMessage[], sess: StoredSession, isInit: boolean, userMessage?: ChatMessage) => {
      const roadmap = parseRoadmapFromResponse(rawOutput);
      const displayText = stripRoadmapJson(rawOutput);

      const assistantMsg: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: displayText,
        timestamp: Date.now(),
      };

      const updatedMessages = isInit
        ? [...prevMessages, assistantMsg]
        : userMessage
        ? [...prevMessages, userMessage, assistantMsg]
        : [...prevMessages, assistantMsg];

      const updatedSession: StoredSession = {
        ...sess,
        isFirstTime: false,
        messages: updatedMessages,
        roadmap: roadmap ?? sess.roadmap,
      };

      setMessages(updatedMessages);
      saveStoredSession(updatedSession);
      setSession(updatedSession);

      if (roadmap) onRoadmapUpdate(roadmap);

      return updatedSession;
    },
    [onRoadmapUpdate]
  );

  // Initialize session + trigger onboarding
  useEffect(() => {
    if (initialized) return;
    setInitialized(true);

    const stored = getStoredSession(userId);
    setSession(stored);
    setMessages(stored.messages);

    if (stored.isFirstTime) {
      setLoading(true);
      sendToN8n('__INIT__', stored)
        .then((raw) => processResponse(raw, stored.messages, stored, true))
        .catch(() => {
          const errMsg: ChatMessage = {
            id: uuidv4(),
            role: 'assistant',
            content: "Hi! I'm Opti, your AI Automation Expert. I'm having a little trouble connecting right now — please try sending a message to get started.",
            timestamp: Date.now(),
          };
          setMessages([errMsg]);
        })
        .finally(() => setLoading(false));
    }
  }, [userId, initialized, sendToN8n, processResponse]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading || !session) return;

    setInput('');

    const userMsg: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const raw = await sendToN8n(text, session);
      processResponse(raw, messages, session, false, userMsg);
    } catch {
      const errMsg: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: 'I had trouble connecting. Please try again in a moment.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function formatTime(ts: number) {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div
      className="flex flex-col h-full overflow-hidden rounded-xl"
      style={{
        background: 'rgba(13,27,62,0.65)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: '1px solid rgba(30,58,138,0.4)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-3.5 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(30,58,138,0.25)' }}
      >
        <OptiAvatar size={34} animated />
        <div>
          <p className="text-sm font-semibold text-white leading-none">Opti</p>
          <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>
            AI Automation Expert
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-xs" style={{ color: '#64748B' }}>
            Online
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto chat-scroll px-4 py-5 space-y-5 min-h-0">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <OptiAvatar size={48} animated />
            <p className="mt-4 text-sm text-[#475569]">Starting your session...</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {msg.role === 'assistant' && (
              <div className="flex-shrink-0 mt-0.5">
                <OptiAvatar size={28} animated={false} />
              </div>
            )}

            <div
              className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'
              }`}
              style={
                msg.role === 'user'
                  ? { background: '#1E3A8A', color: '#E2E8F0' }
                  : {
                      background: 'rgba(10,15,30,0.7)',
                      border: '1px solid rgba(30,58,138,0.3)',
                      color: '#CBD5E1',
                    }
              }
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <p
                className="text-xs mt-2"
                style={{ color: msg.role === 'user' ? 'rgba(147,197,253,0.5)' : '#334155' }}
              >
                {formatTime(msg.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex gap-3">
            <OptiAvatar size={28} animated />
            <div
              className="rounded-2xl rounded-tl-sm px-4 py-3"
              style={{
                background: 'rgba(10,15,30,0.7)',
                border: '1px solid rgba(30,58,138,0.3)',
              }}
            >
              <div className="flex gap-1.5 items-center h-5">
                <span
                  className="typing-dot w-1.5 h-1.5 rounded-full"
                  style={{ background: '#2563EB' }}
                />
                <span
                  className="typing-dot w-1.5 h-1.5 rounded-full"
                  style={{ background: '#2563EB' }}
                />
                <span
                  className="typing-dot w-1.5 h-1.5 rounded-full"
                  style={{ background: '#2563EB' }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        className="px-4 py-4 flex-shrink-0"
        style={{ borderTop: '1px solid rgba(30,58,138,0.25)' }}
      >
        <div className="flex gap-2.5 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Opti about automation..."
            rows={1}
            disabled={loading}
            className="flex-1 text-sm text-white placeholder-[#334155] resize-none rounded-xl px-4 py-3 transition-all duration-150"
            style={{
              background: 'rgba(7,13,26,0.8)',
              border: '1px solid rgba(30,58,138,0.35)',
              maxHeight: '120px',
              overflowY: 'auto',
              lineHeight: '1.5',
            }}
          />

          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="flex-shrink-0 rounded-xl p-3 transition-all duration-150 text-white"
            style={{
              background:
                loading || !input.trim() ? 'rgba(30,58,138,0.3)' : '#1E3A8A',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            }}
          >
            <SendIcon />
          </button>
        </div>

        <p className="text-xs text-center mt-2" style={{ color: '#1E3A8A' }}>
          Enter to send &middot; Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
