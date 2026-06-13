import { useNavigate } from "react-router-dom";
import {
  BookOpen, BrainCircuit, Bot, TrendingUp, ArrowRight,
  Flame, Clock, CheckCircle2, Calendar, HelpCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function greet(name) {
  const h = new Date().getHours();
  const g = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  return `${g}, ${name.split(" ")[0]} 👋`;
}

const QUICK_ACTIONS = [
  { to: "/exam-setup",  icon: BookOpen,     label: "Exam Setup",   color: "text-sky-400",    bg: "bg-sky-400/10 border-sky-500/20"   },
  { to: "/study-plan",  icon: BrainCircuit, label: "Study Plan",   color: "text-violet-400", bg: "bg-violet-400/10 border-violet-500/20" },
  { to: "/quiz",        icon: HelpCircle,   label: "Quiz",         color: "text-rose-400",   bg: "bg-rose-400/10 border-rose-500/20" },
  { to: "/ai-mentor",   icon: Bot,          label: "AI Mentor",    color: "text-ink-400",    bg: "bg-ink-400/10 border-ink-500/20"   },
  { to: "/progress",    icon: TrendingUp,   label: "Progress",     color: "text-emerald-400",bg: "bg-emerald-400/10 border-emerald-500/20" },
];

export default function Dashboard() {
  const { user, examConfig, progress, tasks, progressPercent } = useAuth();
  const navigate = useNavigate();

  const daysLeft = examConfig?.examDate
    ? Math.max(0, Math.ceil((new Date(examConfig.examDate) - new Date()) / 86400000))
    : null;

  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks     = tasks.length;

  // Rough estimate: each task ≈ dailyHours / tasks-per-day. Keep it simple — 1 task ≈ 1 unit.
  const hoursStudied = examConfig?.dailyHours
    ? Math.round((completedTasks * Number(examConfig.dailyHours)) / Math.max(1, totalTasks / (tasks.length ? new Set(tasks.map(t=>t.day)).size : 1)) * 10) / 10
    : completedTasks;

  return (
    <div className="flex-1 p-6 lg:p-8 space-y-8 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-white mb-1">
          {greet(user?.name ?? "Student")}
        </h1>
        <p className="text-[var(--c-muted)] text-sm">
          {examConfig
            ? `Preparing for ${examConfig.examName} — keep it up!`
            : "Set up your exam to get a personalised study plan."}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Flame,         label: "Day Streak",    value: `${progress.streak ?? 0}d`,        color: "text-orange-400" },
          { icon: Clock,         label: "Hours Studied", value: `${hoursStudied}h`,                 color: "text-sky-400"    },
          { icon: CheckCircle2,  label: "Tasks Done",    value: `${completedTasks}/${totalTasks}`,  color: "text-emerald-400"},
          { icon: Calendar,      label: "Days to Exam",  value: daysLeft !== null ? `${daysLeft}d` : "—", color: "text-amber-400" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="stat-card">
            <Icon size={18} className={color} />
            <p className="font-display font-bold text-2xl text-white mt-2">{value}</p>
            <p className="text-xs text-[var(--c-muted)]">{label}</p>
          </div>
        ))}
      </div>

      {/* Exam banner */}
      {examConfig ? (
        <div className="card bg-ink-600/10 border-ink-500/30">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-xs font-mono text-ink-400 mb-1 uppercase tracking-widest">Current Exam</p>
              <h2 className="font-display font-bold text-xl text-white">{examConfig.examName}</h2>
              <p className="text-sm text-[var(--c-muted)] mt-0.5">
                Subjects: {examConfig.subjects} · {examConfig.dailyHours}h/day
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => navigate("/study-plan")} className="btn-primary">
                View Plan <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Progress bar — auto-calculated from completed tasks */}
          <div className="mt-5">
            <div className="flex justify-between text-xs text-[var(--c-muted)] mb-1.5">
              <span>Overall Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
            {totalTasks === 0 && (
              <p className="text-[10px] text-[var(--c-muted)] mt-1.5">
                Generate your study plan to start tracking tasks.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="card border-dashed border-surface-border text-center py-10">
          <BookOpen size={32} className="text-[var(--c-muted)] mx-auto mb-3" />
          <p className="font-display font-semibold text-white mb-1">No exam configured</p>
          <p className="text-sm text-[var(--c-muted)] mb-4">Set up your exam to unlock your study plan.</p>
          <button onClick={() => navigate("/exam-setup")} className="btn-primary mx-auto">
            Set Up Exam <ArrowRight size={15} />
          </button>
        </div>
      )}

      {/* Quick actions */}
      <div>
        <h3 className="font-display font-semibold text-sm text-[var(--c-muted)] uppercase tracking-widest mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map(({ to, icon: Icon, label, color, bg }) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              className={`card flex flex-col items-start gap-3 hover:border-ink-500/40 transition-all duration-200 hover:-translate-y-0.5 text-left border ${bg}`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${bg} border`}>
                <Icon size={18} className={color} />
              </div>
              <span className="font-display font-semibold text-sm text-white">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}