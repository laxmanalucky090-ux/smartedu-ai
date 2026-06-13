import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, ArrowRight, BookOpen, Brain, TrendingUp } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const FEATURES = [
  { icon: Brain,      label: "AI Study Plans",     desc: "Personalised weekly schedules" },
  { icon: BookOpen,   label: "AI Mentor",           desc: "Ask anything, get instant help" },
  { icon: TrendingUp, label: "Progress Tracking",   desc: "Visual insights on your growth" },
];

export default function Login() {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const [form, setForm] = useState({ name: "", email: "" });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800)); // simulate auth
    login(form.name.trim(), form.email.trim());
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex bg-[var(--c-bg)] overflow-hidden">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[46%] bg-surface-card border-r border-surface-border px-12 py-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-ink-600 flex items-center justify-center shadow-lg shadow-ink-600/40">
            <Zap size={18} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg text-white">SmartEdu AI</span>
        </div>

        <div>
          <p className="text-xs font-mono tracking-[0.2em] text-ink-400 uppercase mb-4">
            Study smarter, not harder
          </p>
          <h1 className="font-display font-bold text-5xl text-white leading-[1.1] mb-6">
            Your AI-powered<br />
            <span className="gradient-text">study companion</span>
          </h1>
          <p className="text-[var(--c-muted)] text-base max-w-sm leading-relaxed">
            Get personalised study plans, an always-available AI mentor, and detailed
            progress insights — all in one place.
          </p>

          <div className="mt-10 space-y-4">
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-ink-600/15 border border-ink-500/20 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-ink-400" />
                </div>
                <div>
                  <p className="text-sm font-display font-semibold text-white">{label}</p>
                  <p className="text-xs text-[var(--c-muted)]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[10px] text-[var(--c-muted)]">
          © 2025 SmartEdu AI. Built with React + Gemini.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-fade-up">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-ink-600 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-white">SmartEdu AI</span>
          </div>

          <h2 className="font-display font-bold text-3xl text-white mb-1">Get started</h2>
          <p className="text-[var(--c-muted)] text-sm mb-8">
            Enter your details to begin your learning journey.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Your name</label>
              <input
                className="input"
                placeholder="e.g. Arjun Kumar"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="label">Email address</label>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary w-full justify-center py-3 mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Start Learning <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-[var(--c-muted)] text-center mt-6">
            No password needed — your progress is saved locally.
          </p>
        </div>
      </div>
    </div>
  );
}
