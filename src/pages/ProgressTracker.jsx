import { TrendingUp, CheckCircle2, BookOpen, RotateCcw, ClipboardCheck, HelpCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const COLORS = ["bg-ink-500", "bg-sky-500", "bg-violet-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500"];

const TYPE_META = {
  study:    { label: "Study",     icon: BookOpen,       color: "text-sky-400" },
  revision: { label: "Revision",  icon: RotateCcw,      color: "text-amber-400" },
  mocktest: { label: "Mock Tests",icon: ClipboardCheck, color: "text-rose-400" },
};

export default function ProgressTracker() {
  const { examConfig, tasks, progressPercent, quizHistory } = useAuth();

  // Group tasks by subject
  const subjectMap = {};
  tasks.forEach((t) => {
    if (!subjectMap[t.subject]) subjectMap[t.subject] = { total: 0, completed: 0 };
    subjectMap[t.subject].total += 1;
    if (t.completed) subjectMap[t.subject].completed += 1;
  });
  const subjects = Object.keys(subjectMap);

  // Group tasks by type
  const typeMap = {};
  tasks.forEach((t) => {
    const type = t.type || "study";
    if (!typeMap[type]) typeMap[type] = { total: 0, completed: 0 };
    typeMap[type].total += 1;
    if (t.completed) typeMap[type].completed += 1;
  });

  const completedTasks = tasks.filter((t) => t.completed).length;
  const recentQuizzes = quizHistory.slice(-5).reverse();

  return (
    <div className="flex-1 p-6 lg:p-8 animate-fade-up max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <TrendingUp size={22} className="text-emerald-400" />
        <h1 className="font-display font-bold text-2xl text-white">Progress Tracker</h1>
      </div>
      <p className="text-[var(--c-muted)] text-sm mb-8">
        Automatically calculated from your study plan checklist — complete tasks to see this grow.
      </p>

      {tasks.length === 0 ? (
        <div className="card border-dashed text-center py-10">
          <TrendingUp size={32} className="text-[var(--c-muted)] mx-auto mb-3" />
          <p className="font-display font-semibold text-white mb-1">No progress yet</p>
          <p className="text-sm text-[var(--c-muted)]">
            Generate your study plan to get a task checklist — progress here updates automatically as you complete tasks.
          </p>
        </div>
      ) : (
        <>
          {/* Overall */}
          <div className="card mb-6 bg-emerald-500/10 border-emerald-500/20">
            <div className="flex items-center justify-between mb-3">
              <p className="font-display font-semibold text-white">Overall Progress</p>
              <span className="font-display font-bold text-2xl text-white">{progressPercent}%</span>
            </div>
            <div className="progress-track h-3">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-[var(--c-muted)] mt-2">
              {completedTasks} of {tasks.length} tasks completed
            </p>
          </div>

          {/* By subject */}
          <div className="mb-6">
            <h3 className="font-display font-semibold text-sm text-[var(--c-muted)] uppercase tracking-widest mb-3">
              By Subject
            </h3>
            <div className="space-y-3">
              {subjects.map((subject, i) => {
                const { total, completed } = subjectMap[subject];
                const percent = Math.round((completed / total) * 100);
                return (
                  <div key={subject} className="card">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {percent === 100
                          ? <CheckCircle2 size={16} className="text-emerald-400" />
                          : <span className={`w-2.5 h-2.5 rounded-full ${COLORS[i % COLORS.length]}`} />
                        }
                        <span className="font-display font-semibold text-sm text-white">{subject}</span>
                        {examConfig?.weakTopics?.toLowerCase().includes(subject.toLowerCase()) && (
                          <span className="badge text-[10px] border-amber-500/30 text-amber-400">Weak topic</span>
                        )}
                      </div>
                      <span className="font-mono text-xs text-[var(--c-muted)]">{completed}/{total} ({percent}%)</span>
                    </div>
                    <div className="progress-track">
                      <div className={`h-full rounded-full ${COLORS[i % COLORS.length]} transition-all duration-700`} style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* By task type */}
          <div className="mb-6">
            <h3 className="font-display font-semibold text-sm text-[var(--c-muted)] uppercase tracking-widest mb-3">
              By Task Type
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.entries(typeMap).map(([type, { total, completed }]) => {
                const meta = TYPE_META[type] || TYPE_META.study;
                const Icon = meta.icon;
                const percent = Math.round((completed / total) * 100);
                return (
                  <div key={type} className="stat-card">
                    <Icon size={18} className={meta.color} />
                    <p className="font-display font-bold text-xl text-white mt-2">{completed}/{total}</p>
                    <p className="text-xs text-[var(--c-muted)]">{meta.label} ({percent}%)</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quiz history */}
          {recentQuizzes.length > 0 && (
            <div>
              <h3 className="font-display font-semibold text-sm text-[var(--c-muted)] uppercase tracking-widest mb-3">
                Recent Quiz Results
              </h3>
              <div className="space-y-2">
                {recentQuizzes.map((q, i) => {
                  const percent = Math.round((q.score / q.total) * 100);
                  return (
                    <div key={i} className="card flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <HelpCircle size={16} className="text-violet-400" />
                        <div>
                          <p className="text-sm font-display font-semibold text-white">
                            {q.subject}{q.topic ? ` · ${q.topic}` : ""}
                          </p>
                          <p className="text-xs text-[var(--c-muted)]">
                            {q.difficulty} · {new Date(q.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={`font-mono text-sm font-bold ${percent >= 70 ? "text-emerald-400" : percent >= 40 ? "text-amber-400" : "text-red-400"}`}>
                        {q.score}/{q.total}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}