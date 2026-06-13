import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, BrainCircuit, Bot, TrendingUp, LogOut, Zap, HelpCircle, Globe,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { LANGUAGES } from "../utils/gemini";

const NAV = [
  { to: "/dashboard",   icon: LayoutDashboard, label: "Dashboard"    },
  { to: "/exam-setup",  icon: BookOpen,         label: "Exam Setup"   },
  { to: "/study-plan",  icon: BrainCircuit,     label: "Study Plan"   },
  { to: "/quiz",        icon: HelpCircle,       label: "Quiz"         },
  { to: "/ai-mentor",   icon: Bot,              label: "AI Mentor"    },
  { to: "/progress",    icon: TrendingUp,       label: "Progress"     },
];

export default function Sidebar() {
  const { user, logout, language, setLanguage } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen bg-surface-card border-r border-surface-border shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-surface-border">
        <div className="w-8 h-8 rounded-lg bg-ink-600 flex items-center justify-center shadow-lg shadow-ink-600/30">
          <Zap size={16} className="text-white" />
        </div>
        <span className="font-display font-bold text-base text-white">SmartEdu AI</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-display font-medium transition-all duration-150 ${
                isActive
                  ? "bg-ink-600/20 text-ink-300 border border-ink-500/30"
                  : "text-[var(--c-muted)] hover:text-white hover:bg-surface"
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Language selector */}
      <div className="px-3 pt-3">
        <label className="label flex items-center gap-1.5">
          <Globe size={12} /> AI Response Language
        </label>
        <select
          className="input text-xs py-2"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>
      </div>

      {/* User */}
      <div className="px-3 py-4 border-t border-surface-border">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-ink-600/30 border border-ink-500/40 flex items-center justify-center text-ink-300 font-display font-bold text-sm">
            {user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-display font-semibold text-white truncate">{user?.name}</p>
            <p className="text-[10px] text-[var(--c-muted)] truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-display font-medium text-[var(--c-muted)] hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </aside>
  );
}
