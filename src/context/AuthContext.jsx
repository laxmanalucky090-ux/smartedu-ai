import { createContext, useContext, useState, useEffect, useMemo } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("smartedu_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [examConfig, setExamConfig] = useState(() => {
    try {
      const stored = localStorage.getItem("smartedu_exam");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [progress, setProgress] = useState(() => {
    try {
      const stored = localStorage.getItem("smartedu_progress");
      return stored ? JSON.parse(stored) : {
        topics: [],
        sessionsCompleted: 0,
        totalHours: 0,
        streak: 0,
        lastStudied: null,
      };
    } catch {
      return {
        topics: [],
        sessionsCompleted: 0,
        totalHours: 0,
        streak: 0,
        lastStudied: null,
      };
    }
  });

  // ── Language preference for AI responses ──────────────────
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem("smartedu_language") || "en";
    } catch {
      return "en";
    }
  });

  // ── Study plan tasks (checklist) ───────────────────────────
  const [tasks, setTasksState] = useState(() => {
    try {
      const stored = localStorage.getItem("smartedu_tasks");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // ── Per-subject learning resources ─────────────────────────
  const [resources, setResourcesState] = useState(() => {
    try {
      const stored = localStorage.getItem("smartedu_resources");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // ── Quiz history (for adaptive difficulty) ─────────────────
  const [quizHistory, setQuizHistory] = useState(() => {
    try {
      const stored = localStorage.getItem("smartedu_quiz_history");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem("smartedu_user", JSON.stringify(user));
    else localStorage.removeItem("smartedu_user");
  }, [user]);

  useEffect(() => {
    if (examConfig) localStorage.setItem("smartedu_exam", JSON.stringify(examConfig));
  }, [examConfig]);

  useEffect(() => {
    localStorage.setItem("smartedu_progress", JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem("smartedu_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("smartedu_resources", JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem("smartedu_quiz_history", JSON.stringify(quizHistory));
  }, [quizHistory]);

  const login = (name, email) => {
    const userData = { name, email, joinedAt: new Date().toISOString() };
    setUser(userData);
    return userData;
  };

  const logout = () => {
    setUser(null);
    setExamConfig(null);
  };

  const saveExamConfig = (config) => {
    setExamConfig({ ...config, savedAt: new Date().toISOString() });
  };

  const updateProgress = (topicId, percentComplete) => {
    setProgress((prev) => {
      const existing = prev.topics.find((t) => t.id === topicId);
      const topics = existing
        ? prev.topics.map((t) =>
            t.id === topicId ? { ...t, percent: percentComplete } : t
          )
        : [...prev.topics, { id: topicId, percent: percentComplete }];

      return {
        ...prev,
        topics,
        sessionsCompleted: prev.sessionsCompleted + 1,
        lastStudied: new Date().toISOString(),
      };
    });
  };

  const setLanguage = (code) => {
    setLanguageState(code);
    try {
      localStorage.setItem("smartedu_language", code);
    } catch {
      /* ignore */
    }
  };

  // Replace the entire task list (used after generating a new plan)
  const setTasks = (newTasks) => {
    setTasksState(Array.isArray(newTasks) ? newTasks : []);
  };

  // Flip a single task's completed state — drives automatic progress
  const toggleTask = (taskId) => {
    setTasksState((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
    setProgress((prev) => ({ ...prev, lastStudied: new Date().toISOString() }));
  };

  // Auto-calculated progress: completed tasks / total tasks * 100
  const progressPercent = useMemo(() => {
    if (!tasks.length) return 0;
    const completed = tasks.filter((t) => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  }, [tasks]);

  const setResources = (newResources) => {
    setResourcesState((prev) => ({ ...prev, ...newResources }));
  };

  const addQuizResult = (result) => {
    setQuizHistory((prev) => [
      ...prev,
      { ...result, date: new Date().toISOString() },
    ].slice(-30)); // keep last 30 results
  };

  return (
    <AuthContext.Provider
      value={{
        user, login, logout,
        examConfig, saveExamConfig,
        progress, updateProgress,
        language, setLanguage,
        tasks, setTasks, toggleTask, progressPercent,
        resources, setResources,
        quizHistory, addQuizResult,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
