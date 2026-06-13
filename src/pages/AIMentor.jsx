import { useState, useRef, useEffect } from "react";
import { Bot, Send, Loader2, User, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { mentorChat } from "../utils/gemini";

const SUGGESTIONS = [
  "Explain Newton's 3rd law with examples",
  "Give me a quick revision of integration techniques",
  "How should I manage exam stress?",
  "What is cybersecurity?",
];

function Message({ msg }) {
  const isUser = msg.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          isUser
            ? "bg-ink-600/30 border border-ink-500/40"
            : "bg-surface-border"
        }`}
      >
        {isUser ? (
          <User size={14} className="text-ink-300" />
        ) : (
          <Bot size={14} className="text-[var(--c-muted)]" />
        )}
      </div>

      <div
        className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-ink-600/20 border border-ink-500/30 text-white rounded-tr-sm"
            : "bg-surface-card border border-surface-border text-[var(--c-text)] rounded-tl-sm"
        }`}
      >
        {msg.text}
      </div>
    </div>
  );
}

export default function AIMentor() {
  const { examConfig, language, progressPercent } = useAuth();

  const mentorContext = {
    examName: examConfig?.examName,
    subjects: examConfig?.subjects,
    weakTopics: examConfig?.weakTopics,
    examDate: examConfig?.examDate,
    progressPercent,
  };

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: `Hi! I'm your SmartEdu AI Mentor 🎓
Ask me anything about your studies.`,
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔥 SAFE SEND FUNCTION (NO CRASH EVEN IF GEMINI FAILS)
  const send = async (text) => {
    const q = (text ?? input).trim();
    if (!q || loading) return;

    setInput("");

    const userMsg = { role: "user", text: q };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      let reply = await mentorChat(
        q,
        mentorContext,
        [...messages, userMsg],
        language
      );

      // fallback safety
      if (!reply) reply = "I couldn't generate a response. Try again.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: reply },
      ]);
    } catch (e) {
      console.log(e);

      // 🔥 IMPORTANT FALLBACK (NO GEMINI = STILL WORKS)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            "⚠️ AI temporarily unavailable.\n\nBut I can still help:\n- Try asking simpler questions\n- Check internet/API key\n- Or refresh and retry",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () =>
    setMessages([
      {
        role: "assistant",
        text: "Chat cleared! Ask me anything 📚",
      },
    ]);

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-ink-600/20 border border-ink-500/30 flex items-center justify-center">
            <Bot size={18} />
          </div>
          <div>
            <p className="font-semibold text-white text-sm">AI Mentor</p>
            <p className="text-xs text-gray-400">
              Exam-focused AI Tutor
            </p>
          </div>
        </div>

        <button onClick={clearChat} className="text-xs text-gray-300">
          <Trash2 size={13} /> Clear
        </button>
      </div>

      {/* CHAT */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
        {messages.map((msg, i) => (
          <Message key={i} msg={msg} />
        ))}

        {loading && (
          <div className="flex gap-3">
            <Loader2 className="animate-spin text-gray-400" />
            <span className="text-gray-400 text-sm">Thinking...</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* SUGGESTIONS */}
      {messages.length <= 2 && (
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="text-xs px-3 py-1 border rounded"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* INPUT */}
      <div className="px-4 py-4 border-t flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          className="flex-1 border px-3 py-2 rounded"
          placeholder="Ask anything..."
        />

        <button
          onClick={() => send()}
          disabled={loading}
          className="px-4 bg-blue-500 text-white rounded"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Send />}
        </button>
      </div>
    </div>
  );
}