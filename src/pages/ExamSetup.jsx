import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, ArrowRight, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const EXAM_PRESETS = [
  "JEE Main", "JEE Advanced", "NEET", "UPSC CSE", "CAT", "GATE",
  "Class 10 Board", "Class 12 Board", "SAT", "GRE", "GMAT", "Custom",
];

export default function ExamSetup() {
  const { examConfig, saveExamConfig } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    examName:   examConfig?.examName   ?? "",
    subjects:   examConfig?.subjects   ?? "",
    examDate:   examConfig?.examDate   ?? "",
    dailyHours: examConfig?.dailyHours ?? "4",
    weakTopics: examConfig?.weakTopics ?? "",
    goal:       examConfig?.goal       ?? "",
  });

  const [saved, setSaved]   = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.examName.trim()) e.examName = "Exam name is required";
    if (!form.subjects.trim()) e.subjects = "At least one subject is required";
    if (!form.examDate)        e.examDate = "Exam date is required";
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    saveExamConfig(form);
    setSaved(true);
    setTimeout(() => navigate("/study-plan"), 1200);
  };

  return (
    <div className="flex-1 p-6 lg:p-8 animate-fade-up max-w-2xl">
      <div className="flex items-center gap-3 mb-2">
        <BookOpen size={22} className="text-ink-400" />
        <h1 className="font-display font-bold text-2xl text-white">Exam Setup</h1>
      </div>
      <p className="text-[var(--c-muted)] text-sm mb-8">
        Configure your exam details so SmartEdu AI can personalise your study plan.
      </p>

      {saved ? (
        <div className="card bg-emerald-500/10 border-emerald-500/30 flex items-center gap-4 py-6">
          <CheckCircle2 size={28} className="text-emerald-400" />
          <div>
            <p className="font-display font-semibold text-white">Exam saved!</p>
            <p className="text-sm text-[var(--c-muted)]">Redirecting to your study plan…</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Exam name */}
          <div>
            <label className="label">Exam / Course name *</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {EXAM_PRESETS.map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setForm({ ...form, examName: p === "Custom" ? "" : p })}
                  className={`badge cursor-pointer transition-all duration-150 ${
                    form.examName === p
                      ? "bg-ink-600/20 border-ink-500/50 text-ink-300"
                      : "border-surface-border text-[var(--c-muted)] hover:border-ink-500/40 hover:text-white"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <input
              className="input"
              placeholder="Or type your exam name…"
              value={form.examName}
              onChange={(e) => setForm({ ...form, examName: e.target.value })}
            />
            {errors.examName && <p className="text-red-400 text-xs mt-1">{errors.examName}</p>}
          </div>

          {/* Subjects */}
          <div>
            <label className="label">Subjects / Topics *</label>
            <input
              className="input"
              placeholder="e.g. Physics, Chemistry, Mathematics"
              value={form.subjects}
              onChange={(e) => setForm({ ...form, subjects: e.target.value })}
            />
            {errors.subjects && <p className="text-red-400 text-xs mt-1">{errors.subjects}</p>}
          </div>

          {/* Two column */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Exam date *</label>
              <input
                type="date"
                className="input"
                value={form.examDate}
                onChange={(e) => setForm({ ...form, examDate: e.target.value })}
              />
              {errors.examDate && <p className="text-red-400 text-xs mt-1">{errors.examDate}</p>}
            </div>
            <div>
              <label className="label">Daily study hours</label>
              <select
                className="input"
                value={form.dailyHours}
                onChange={(e) => setForm({ ...form, dailyHours: e.target.value })}
              >
                {["1","2","3","4","5","6","7","8"].map((h) => (
                  <option key={h} value={h}>{h} hour{h !== "1" ? "s" : ""}/day</option>
                ))}
              </select>
            </div>
          </div>

          {/* Weak topics */}
          <div>
            <label className="label">Weak topics (optional)</label>
            <input
              className="input"
              placeholder="e.g. Thermodynamics, Organic Chemistry, Integration"
              value={form.weakTopics}
              onChange={(e) => setForm({ ...form, weakTopics: e.target.value })}
            />
            <p className="text-[10px] text-[var(--c-muted)] mt-1">
              AI will allocate extra time to these topics.
            </p>
          </div>

          {/* Goal */}
          <div>
            <label className="label">Target / Goal (optional)</label>
            <input
              className="input"
              placeholder="e.g. Score above 95%, qualify top 1000 rank"
              value={form.goal}
              onChange={(e) => setForm({ ...form, goal: e.target.value })}
            />
          </div>

          <button type="submit" className="btn-primary py-3">
            Save & Generate Plan <ArrowRight size={16} />
          </button>
        </form>
      )}
    </div>
  );
}
