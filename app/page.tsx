"use client";

import { useEffect, useRef, useState } from "react";

// A single chat message in the conversation thread.
type Message = {
  role: "user" | "assistant";
  content: string;
};

// Friendly conversation starters shown on the empty state. Clicking one
// drops the text into the composer so the user can send (or edit) it.
const SUGGESTIONS = [
  "I'm feeling overwhelmed at work.",
  "Help me build a better morning routine.",
  "How do I stay motivated on a long project?",
  "I want to feel more confident in meetings.",
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Keep the latest message (or the typing indicator) in view.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Grow the textarea to fit its contents (capped) so the input box
  // never hides what the user is typing.
  function autoGrow() {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setLoading(true);

    // Reset the textarea height after clearing it.
    requestAnimationFrame(autoGrow);

    try {
      // We always call the relative "/api/chat" path. Locally, next.config.js
      // proxies this to the FastAPI backend on port 8000.
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!res.ok) {
        // Surface the backend's error detail when available.
        let detail = `Request failed (${res.status})`;
        try {
          const data = await res.json();
          if (data?.detail) detail = data.detail;
        } catch {
          /* response had no JSON body */
        }
        throw new Error(detail);
      }

      const data = await res.json();
      const reply: string =
        typeof data?.reply === "string" ? data.reply : "(no reply received)";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Something went wrong reaching the assistant.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    void sendMessage(input);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Enter sends, Shift+Enter inserts a newline.
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  }

  const hasConversation = messages.length > 0;

  return (
    <main className="page">
      <div className="chat-card">
        <header className="chat-header">
          <div className="brand">
            <span className="brand-logo" aria-hidden="true">
              🧘
            </span>
            <div className="brand-text">
              <h1 className="brand-title">MindfulChat</h1>
              <p className="brand-subtitle">Your supportive AI coach</p>
            </div>
          </div>
          {hasConversation && (
            <button
              type="button"
              className="reset-btn"
              onClick={() => {
                setMessages([]);
                setError(null);
              }}
            >
              New chat
            </button>
          )}
        </header>

        <section className="messages" aria-live="polite">
          {!hasConversation && !loading && (
            <div className="empty-state">
              <p className="empty-emoji" aria-hidden="true">
                💬
              </p>
              <p className="empty-title">Hi, I&apos;m here to listen.</p>
              <p className="empty-subtitle">
                What&apos;s on your mind today? Pick a starter or type your own.
              </p>
              <div className="suggestions">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="chip"
                    onClick={() => void sendMessage(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`msg-row ${m.role}`}>
              <div className={`bubble ${m.role}`}>{m.content}</div>
            </div>
          ))}

          {loading && (
            <div className="msg-row assistant">
              <div className="bubble assistant typing" aria-label="Assistant is typing">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </section>

        {error && (
          <div className="error-banner" role="alert">
            <span aria-hidden="true">⚠️</span> {error}
          </div>
        )}

        <form className="composer" onSubmit={handleSubmit}>
          <textarea
            ref={textareaRef}
            className="composer-input"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              autoGrow();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type your message…"
            rows={1}
            disabled={loading}
          />
          <button
            type="submit"
            className="send-btn"
            disabled={loading || input.trim().length === 0}
          >
            {loading ? "Sending…" : "Send"}
          </button>
        </form>
      </div>

      <p className="footnote">
        Powered by the AI Engineer Challenge backend · be kind to yourself 💜
      </p>
    </main>
  );
}
