import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BrainCircuit, RefreshCw, BookOpen, Loader2, CheckSquare, Square,
  Youtube, FileText, StickyNote, Dumbbell, ChevronDown, ChevronUp,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { generateStudyPlan, generateTasks, generateResources } from "../utils/gemini";

// Very simple markdown-to-HTML renderer
function renderMd(text) {
  return text
    .replace(/^### (.+)$/gm,    '<h3 class="font-display font-bold text-base text-white mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm,     '<h2 class="font-display font-bold text-lg text-white mt-8 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm,      '<h1 class="font-display font-bold text-xl text-white mt-8 mb-3">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g,  '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g,      '<em class="text-ink-300">$1</em>')
    .replace(/^- (.+)$/gm,      '<li class="ml-4 list-disc text-[var(--c-muted)] text-sm leading-relaxed">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm,'<li class="ml-4 list-decimal text-[var(--c-muted)] text-sm leading-relaxed">$2</li>')
    .replace(/\n\n/g,           '<br/><br/>');
}

const TYPE_STYLES = {
  study:    { label: "Study",    color: "text-sky-400 border-sky-500/30 bg-sky-500/10" },
  revision: { label: "Revision", color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
  mocktest: { label: "Mock Test",color: "text-rose-400 border-rose-500/30 bg-rose-500/10" },
};

const youtubeLink = (title) => `https://www.youtube.com/results?search_query=${encodeURIComponent(title)}`;
const pdfLink     = (title) => `https://www.google.com/search?q=${encodeURIComponent(title + " pdf")}`;
const notesLink   = (title) => `https://www.google.com/search?q=${encodeURIComponent(title + " notes")}`;

export default function StudyPlan() {
  const {
    examConfig, language,
    tasks, setTasks, toggleTask, progressPercent,
    resources, setResources,
  } = useAuth();
  const navigate = useNavigate();

  const [plan, setPlan]       = useState(() => localStorage.getItem("smartedu_plan") ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [expandedDay, setExpandedDay] = useState(null);

  const generate = async () => {
    if (!examConfig) return;
    setLoading(true);
    setError("");
    try {
      // 1. Generate markdown overview plan
      const result = await generateStudyPlan(examConfig, language);
      setPlan(result);
      localStorage.setItem("smartedu_plan", result);

      // 2. Generate task checklist
      const newTasks = await generateTasks(examConfig, language);
      setTasks(newTasks);

      // 3. Generate resources (per subject)
      const newResources = await generateResources(examConfig.subjects, language);
      setResources(newResources);
    } catch (e) {
      setError(e.message ?? "Failed to generate plan. Check your API key.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate if no plan exists yet
  useEffect(() => {
    if (examConfig && !plan) generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!examConfig) {
    return (
      <div className="flex-1 p-6 lg:p-8 flex flex-col items-center justify-center gap-4 text-center animate-fade-up">
        <BookOpen size={36} className="text-[var(--c-muted)]" />
        <p className="font-display font-semibold text-white">No exam configured</p>
        <p className="text-sm text-[var(--c-muted)]">Set up your exam first to generate a study plan.</p>
        <button onClick={() => navigate("/exam-setup")} className="btn-primary">
          Set Up Exam
        </button>
      </div>
    );
  }

  // Group tasks by day
  const tasksByDay = tasks.reduce((acc, t) => {
    (acc[t.day] = acc[t.day] || []).push(t);
    return acc;
  }, {});
  const dayNumbers = Object.keys(tasksByDay).map(Number).sort((a, b) => a - b);

  const subjectList = examConfig.subjects
    ? examConfig.subjects.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="flex-1 p-6 lg:p-8 animate-fade-up max-w-3xl space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <BrainCircuit size={22} className="text-ink-400" />
          <div>
            <h1 className="font-display font-bold text-2xl text-white">Smart Study Plan</h1>
            <p className="text-sm text-[var(--c-muted)]">{examConfig.examName} · AI-generated</p>
          </div>
        </div>
        <button onClick={generate} disabled={loading} className="btn-ghost">
          {loading ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
          {loading ? "Generating…" : "Regenerate"}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="card flex flex-col items-center justify-center py-20 gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-full border-2 border-ink-500/20 border-t-ink-400 animate-spin" />
            <BrainCircuit size={20} className="text-ink-400 absolute inset-0 m-auto" />
          </div>
          <p className="font-display font-semibold text-white">Generating your plan…</p>
          <p className="text-sm text-[var(--c-muted)]">Analysing your exam, subjects, tasks & resources</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="card bg-red-500/10 border-red-500/30">
          <p className="text-red-400 font-display font-semibold mb-1">Error</p>
          <p className="text-sm text-[var(--c-muted)]">{error}</p>
          <button onClick={generate} className="btn-primary mt-4">Try Again</button>
        </div>
      )}

      {/* Overview plan */}
      {!loading && !error && plan && (
        <div className="card">
          <div
            className="prose-custom text-[var(--c-muted)] text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderMd(plan) }}
          />
        </div>
      )}

      {/* Progress + Task checklist */}
      {!loading && tasks.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-lg text-white">Your Checklist</h2>
            <span className="font-mono text-sm text-ink-300">{progressPercent}% done</span>
          </div>
          <div className="progress-track mb-6">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>

          <div className="space-y-3">
            {dayNumbers.map((day) => {
              const dayTasks = tasksByDay[day];
              const isOpen = expandedDay === day || expandedDay === null;
              return (
                <div key={day} className="border border-surface-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedDay(expandedDay === day ? null : day)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-surface hover:bg-surface/70 transition-colors"
                  >
                    <span className="font-display font-semibold text-sm text-white">Day {day}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--c-muted)]">
                        {dayTasks.filter((t) => t.completed).length}/{dayTasks.length}
                      </span>
                      {isOpen ? <ChevronUp size={14} className="text-[var(--c-muted)]" /> : <ChevronDown size={14} className="text-[var(--c-muted)]" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="p-3 space-y-2">
                      {dayTasks.map((t) => {
                        const typeStyle = TYPE_STYLES[t.type] || TYPE_STYLES.study;
                        return (
                          <button
                            key={t.id}
                            onClick={() => toggleTask(t.id)}
                            className="w-full flex items-start gap-3 text-left px-3 py-2 rounded-lg hover:bg-surface/60 transition-colors"
                          >
                            {t.completed
                              ? <CheckSquare size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                              : <Square size={18} className="text-[var(--c-muted)] shrink-0 mt-0.5" />
                            }
                            <span className="flex-1">
                              <span className={`text-sm ${t.completed ? "text-[var(--c-muted)] line-through" : "text-white"}`}>
                                {t.text}
                              </span>
                              <span className="flex items-center gap-2 mt-1">
                                <span className="badge text-[10px] border-surface-border text-[var(--c-muted)]">{t.subject}</span>
                                <span className={`badge text-[10px] ${typeStyle.color}`}>{typeStyle.label}</span>
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Resources */}
      {!loading && Object.keys(resources).length > 0 && (
        <div className="space-y-4">
          <h2 className="font-display font-bold text-lg text-white">Resources</h2>
          {subjectList.map((subject) => {
            const res = resources[subject];
            if (!res) return null;
            return (
              <div key={subject} className="card">
                <h3 className="font-display font-semibold text-white text-sm mb-3">{subject}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {/* YouTube */}
                  <div>
                    <p className="flex items-center gap-1.5 text-xs text-[var(--c-muted)] uppercase tracking-wider font-display font-semibold mb-2">
                      <Youtube size={13} className="text-red-400" /> Videos
                    </p>
                    <ul className="space-y-1.5">
                      {(res.youtube || []).map((item, i) => (
                        <li key={i}>
                          <a href={youtubeLink(item.title)} target="_blank" rel="noopener noreferrer"
                             className="text-ink-300 hover:text-ink-200 hover:underline">
                            {item.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Notes */}
                  <div>
                    <p className="flex items-center gap-1.5 text-xs text-[var(--c-muted)] uppercase tracking-wider font-display font-semibold mb-2">
                      <StickyNote size={13} className="text-amber-400" /> Notes
                    </p>
                    <ul className="space-y-1.5">
                      {(res.notes || []).map((item, i) => (
                        <li key={i}>
                          <a href={notesLink(item.title)} target="_blank" rel="noopener noreferrer"
                             className="text-ink-300 hover:text-ink-200 hover:underline">
                            {item.title}
                          </a>
                          {item.description && <p className="text-xs text-[var(--c-muted)]">{item.description}</p>}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* PDFs */}
                  <div>
                    <p className="flex items-center gap-1.5 text-xs text-[var(--c-muted)] uppercase tracking-wider font-display font-semibold mb-2">
                      <FileText size={13} className="text-sky-400" /> PDFs / References
                    </p>
                    <ul className="space-y-1.5">
                      {(res.pdfs || []).map((item, i) => (
                        <li key={i}>
                          <a href={pdfLink(item.title)} target="_blank" rel="noopener noreferrer"
                             className="text-ink-300 hover:text-ink-200 hover:underline">
                            {item.title}
                          </a>
                          {item.description && <p className="text-xs text-[var(--c-muted)]">{item.description}</p>}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Practice */}
                  <div>
                    <p className="flex items-center gap-1.5 text-xs text-[var(--c-muted)] uppercase tracking-wider font-display font-semibold mb-2">
                      <Dumbbell size={13} className="text-emerald-400" /> Practice
                    </p>
                    <ul className="space-y-1.5">
                      {(res.practice || []).map((item, i) => (
                        <li key={i}>
                          <span className="text-white">{item.title}</span>
                          {item.description && <p className="text-xs text-[var(--c-muted)]">{item.description}</p>}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}