import { useState, useEffect } from "react";
import {
  HelpCircle, Loader2, CheckCircle2, XCircle, RotateCcw, Sparkles, TrendingUp,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { generateQuiz } from "../utils/gemini";

const DIFFICULTIES = ["easy", "medium", "hard"];
const COUNTS = [5, 10, 15];

export default function Quiz() {
  const { examConfig, language, quizHistory, addQuizResult } = useAuth();

  const subjectOptions = examConfig?.subjects
    ? examConfig.subjects.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const weakTopics = examConfig?.weakTopics
    ? examConfig.weakTopics.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const [subject, setSubject]       = useState(subjectOptions[0] || "");
  const [customSubject, setCustomSubject] = useState("");
  const [topic, setTopic]           = useState(weakTopics[0] || "");
  const [difficulty, setDifficulty] = useState("medium");
  const [numQuestions, setNumQuestions] = useState(5);

  const [questions, setQuestions]   = useState(null);
  const [answers, setAnswers]       = useState({});
  const [submitted, setSubmitted]   = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");

  const effectiveSubject = subject === "__custom__" ? customSubject.trim() : subject;

  // ── Adaptive difficulty: suggest based on past performance for this subject ──
  useEffect(() => {
    const past = quizHistory.filter((h) => h.subject === effectiveSubject);
    if (past.length === 0) return;

    const recent = past.slice(-3); // last 3 attempts
    const avgPercent =
      recent.reduce((acc, h) => acc + (h.score / h.total) * 100, 0) / recent.length;

    if (avgPercent >= 80) setDifficulty("hard");
    else if (avgPercent < 50) setDifficulty("easy");
    else setDifficulty("medium");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveSubject]);

  const pastForSubject = quizHistory.filter((h) => h.subject === effectiveSubject);
  const lastResult = pastForSubject[pastForSubject.length - 1];

  const startQuiz = async () => {
    if (!effectiveSubject) {
      setError("Please select or enter a subject.");
      return;
    }
    setLoading(true);
    setError("");
    setSubmitted(false);
    setAnswers({});
    try {
      const qs = await generateQuiz(
        { subject: effectiveSubject, topic, difficulty, numQuestions },
        language
      );
      setQuestions(qs);
    } catch (e) {
      setError(e.message ?? "Failed to generate quiz. Please try again.");
      setQuestions(null);
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (qIndex, optIndex) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const score = questions
    ? questions.reduce((acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0), 0)
    : 0;

  const submitQuiz = () => {
    setSubmitted(true);
    addQuizResult({
      subject: effectiveSubject,
      topic,
      difficulty,
      score,
      total: questions.length,
    });
  };

  const resetQuiz = () => {
    setQuestions(null);
    setAnswers({});
    setSubmitted(false);
    setError("");
  };

  return (
    <div className="flex-1 p-6 lg:p-8 animate-fade-up max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <HelpCircle size={22} className="text-violet-400" />
        <h1 className="font-display font-bold text-2xl text-white">AI Quiz</h1>
      </div>
      <p className="text-[var(--c-muted)] text-sm mb-8">
        Test your knowledge with AI-generated multiple-choice questions, personalised to your weak topics.
      </p>

      {/* Setup form */}
      {!questions && (
        <div className="card space-y-5">
          <div>
            <label className="label">Subject</label>
            {subjectOptions.length > 0 ? (
              <select
                className="input"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                {subjectOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
                <option value="__custom__">Other (type below)</option>
              </select>
            ) : (
              <p className="text-xs text-[var(--c-muted)] mb-2">
                No exam configured — enter any subject below.
              </p>
            )}
            {(subject === "__custom__" || subjectOptions.length === 0) && (
              <input
                className="input mt-2"
                placeholder="e.g. Physics, History, Python Basics"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
              />
            )}
          </div>

          <div>
            <label className="label">Specific topic</label>
            <input
              className="input"
              placeholder="e.g. Thermodynamics, World War II, Loops"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            {weakTopics.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {weakTopics.map((wt) => (
                  <button
                    key={wt}
                    type="button"
                    onClick={() => setTopic(wt)}
                    className={`badge text-[10px] cursor-pointer transition-all ${
                      topic === wt
                        ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                        : "border-surface-border text-[var(--c-muted)] hover:border-amber-500/40 hover:text-amber-300"
                    }`}
                  >
                    ⚠ {wt}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Difficulty</label>
              <select
                className="input"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>{d[0].toUpperCase() + d.slice(1)}</option>
                ))}
              </select>
              {lastResult && (
                <p className="flex items-center gap-1 text-[10px] text-[var(--c-muted)] mt-1.5">
                  <TrendingUp size={11} className="text-ink-400" />
                  Suggested based on last score: {lastResult.score}/{lastResult.total}
                </p>
              )}
            </div>
            <div>
              <label className="label">Number of questions</label>
              <select
                className="input"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
              >
                {COUNTS.map((c) => (
                  <option key={c} value={c}>{c} questions</option>
                ))}
              </select>
            </div>
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button onClick={startQuiz} disabled={loading} className="btn-primary py-3">
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Generating quiz…
              </>
            ) : (
              <>
                <Sparkles size={16} /> Generate Quiz
              </>
            )}
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="card flex flex-col items-center justify-center py-16 gap-4 mt-6">
          <Loader2 size={28} className="text-violet-400 animate-spin" />
          <p className="text-sm text-[var(--c-muted)]">Creating your questions…</p>
        </div>
      )}

      {/* Quiz */}
      {questions && !loading && (
        <div className="space-y-5">
          {/* Score banner (after submit) */}
          {submitted && (
            <div className="card bg-violet-500/10 border-violet-500/30 flex items-center justify-between">
              <div>
                <p className="font-display font-bold text-xl text-white">
                  Score: {score} / {questions.length}
                </p>
                <p className="text-sm text-[var(--c-muted)]">
                  {score === questions.length
                    ? "Perfect score! 🎉"
                    : score >= questions.length / 2
                    ? "Good job — review the explanations below."
                    : "Keep practicing — check explanations to improve."}
                </p>
              </div>
              <button onClick={resetQuiz} className="btn-ghost">
                <RotateCcw size={15} /> New Quiz
              </button>
            </div>
          )}

          {questions.map((q, qi) => {
            const selected  = answers[qi];
            const isCorrect = selected === q.correctIndex;

            return (
              <div key={qi} className="card">
                <p className="font-display font-semibold text-white text-sm mb-4">
                  {qi + 1}. {q.question}
                </p>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => {
                    let style = "border-surface-border hover:border-ink-500/40 text-[var(--c-muted)]";
                    if (submitted) {
                      if (oi === q.correctIndex) {
                        style = "border-emerald-500/50 bg-emerald-500/10 text-emerald-300";
                      } else if (oi === selected) {
                        style = "border-red-500/50 bg-red-500/10 text-red-300";
                      }
                    } else if (selected === oi) {
                      style = "border-ink-500/50 bg-ink-600/10 text-white";
                    }

                    return (
                      <button
                        key={oi}
                        onClick={() => selectAnswer(qi, oi)}
                        disabled={submitted}
                        className={`w-full text-left text-sm px-4 py-2.5 rounded-xl border transition-all duration-150 ${style}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className={`mt-3 flex items-start gap-2 text-xs ${isCorrect ? "text-emerald-400" : "text-amber-400"}`}>
                    {isCorrect
                      ? <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                      : <XCircle size={14} className="shrink-0 mt-0.5" />}
                    <span>{q.explanation}</span>
                  </div>
                )}
              </div>
            );
          })}

          {!submitted && (
            <button
              onClick={submitQuiz}
              disabled={Object.keys(answers).length < questions.length}
              className="btn-primary py-3 w-full justify-center"
            >
              Submit Quiz
            </button>
          )}
        </div>
      )}
    </div>
  );
}