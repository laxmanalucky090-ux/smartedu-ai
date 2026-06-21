import { useState } from 'react';
import { generateStudyPlan, generateResources } from '../utils/gemini';

const COLORS = {
  bg: '#0A0A0A',
  card: '#111111',
  cardAlt: '#181818',
  cardAlt2: '#1F1F1F',
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.18)',
  accent: '#D7FF3E',
  accentDark: '#A8E000',
  text: '#FFFFFF',
  textMuted: '#A1A1AA',
  error: '#F87171',
  errorBg: 'rgba(248,113,113,0.1)',
  errorBorder: 'rgba(248,113,113,0.35)',
};

export default function StudyPlannerPage({ language, progress, setProgress }) {
  const [form, setForm] = useState({
    examName: '', examDate: '', expectedMarks: '',
    subjects: [], subjectInput: '', weakTopics: '',
    dailyHours: '4', level: 'beginner',
  });
  const [plan, setPlan] = useState(null);
  const [resources, setResources] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('plan');

  const levels = [
    { id: 'beginner', icon: '🌱', label: 'Beginner', desc: 'Just started', color: '#4ADE80' },
    { id: 'intermediate', icon: '📈', label: 'Intermediate', desc: 'Know basics', color: '#FBBF24' },
    { id: 'advanced', icon: '🔥', label: 'Advanced', desc: 'Strong foundation', color: '#F87171' },
  ];

  const popularSubjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'History', 'Geography', 'Computer Science', 'Economics'];

  const addSubject = (sub) => {
    const s = sub.trim();
    if (s && !form.subjects.includes(s)) setForm(f => ({ ...f, subjects: [...f.subjects, s], subjectInput: '' }));
  };

  const removeSubject = (sub) => setForm(f => ({ ...f, subjects: f.subjects.filter(s => s !== sub) }));

  const handleGenerate = async () => {
    if (!form.examName) return setError('Please enter your exam name.');
    if (form.subjects.length === 0) return setError('Please add at least one subject.');
    setError(''); setLoading(true); setPlan(null); setResources(null);
    try {
      const subjectsStr = form.subjects.join(', ');
      const [planData, resData] = await Promise.all([
        generateStudyPlan(form.examName, form.examDate, form.expectedMarks, subjectsStr, form.weakTopics, form.dailyHours, language, form.level),
        generateResources(subjectsStr, form.examName, language),
      ]);
      setPlan(planData); setResources(resData);
      setProgress(p => ({ ...p, studyPlanGenerated: true }));
      setTab('plan');
    } catch { setError('Failed to generate. Please try again.'); }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%', padding: '13px 16px', borderRadius: '12px', fontSize: '15px',
    boxSizing: 'border-box', border: `2px solid ${COLORS.border}`, outline: 'none',
    fontFamily: 'inherit', background: COLORS.cardAlt, color: COLORS.text, transition: 'all 0.2s',
  };

  const focusAccent = (e) => { e.target.style.borderColor = COLORS.accent; e.target.style.boxShadow = '0 0 0 3px rgba(215,255,62,0.15)'; };
  const blurAccent = (e) => { e.target.style.borderColor = COLORS.border; e.target.style.boxShadow = 'none'; };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", maxWidth: '900px', margin: '0 auto' }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .sp-levels { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .sp-meta-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
        .sp-week-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media (max-width: 640px) {
          .sp-levels { grid-template-columns: 1fr; }
          .sp-meta-row { grid-template-columns: 1fr; }
          .sp-week-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* HEADER */}
      <div style={{ marginBottom: '28px', animation: 'fadeUp 0.4s ease' }}>
        <h2 style={{ margin: '0 0 6px', fontWeight: '800', fontSize: '28px', background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          📚 Study Planner
        </h2>
        <p style={{ margin: 0, color: COLORS.textMuted, fontSize: '15px' }}>Tell us about your exam — AI will build your perfect study plan</p>
      </div>

      {/* FORM CARD */}
      <div style={{ background: COLORS.card, borderRadius: '24px', padding: '36px', marginBottom: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.3)', border: `1px solid ${COLORS.border}`, animation: 'fadeUp 0.5s ease 0.1s both' }}>

        {/* EXAM NAME */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'block', fontWeight: '700', color: COLORS.text, marginBottom: '10px', fontSize: '15px' }}>
            🎯 Exam Name <span style={{ color: COLORS.error }}>*</span>
          </label>
          <input style={inputStyle} placeholder="e.g. JEE Main, NEET, GATE, UPSC, Class 12 Boards..."
            value={form.examName} onChange={e => setForm(f => ({ ...f, examName: e.target.value }))}
            onFocus={focusAccent} onBlur={blurAccent}
          />
        </div>

        {/* LEVEL */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'block', fontWeight: '700', color: COLORS.text, marginBottom: '12px', fontSize: '15px' }}>
            📊 Your Current Level <span style={{ color: COLORS.error }}>*</span>
          </label>
          <div className="sp-levels">
            {levels.map(l => (
              <div key={l.id} onClick={() => setForm(f => ({ ...f, level: l.id }))} style={{
                padding: '18px 16px', borderRadius: '16px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.25s',
                border: `2px solid ${form.level === l.id ? l.color : COLORS.border}`,
                background: form.level === l.id ? `${l.color}1a` : COLORS.cardAlt,
                boxShadow: form.level === l.id ? `0 6px 20px ${l.color}33` : 'none',
                transform: form.level === l.id ? 'translateY(-3px)' : 'translateY(0)',
              }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{l.icon}</div>
                <div style={{ fontWeight: '800', color: form.level === l.id ? l.color : COLORS.text, fontSize: '15px', marginBottom: '4px' }}>{l.label}</div>
                <div style={{ color: COLORS.textMuted, fontSize: '12px' }}>{l.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SUBJECTS */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'block', fontWeight: '700', color: COLORS.text, marginBottom: '12px', fontSize: '15px' }}>
            📖 Subjects <span style={{ color: COLORS.error }}>*</span>
            <span style={{ color: COLORS.accent, fontWeight: '700', fontSize: '13px', marginLeft: '8px', background: 'rgba(215,255,62,0.1)', padding: '2px 10px', borderRadius: '20px' }}>{form.subjects.length} added</span>
          </label>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
            {popularSubjects.map(s => (
              <button key={s} onClick={() => addSubject(s)} style={{
                padding: '7px 16px', borderRadius: '20px',
                border: `2px solid ${form.subjects.includes(s) ? COLORS.accent : COLORS.border}`,
                background: form.subjects.includes(s) ? `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})` : COLORS.cardAlt,
                color: form.subjects.includes(s) ? '#0A0A0A' : COLORS.textMuted,
                cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: 'inherit', transition: 'all 0.2s',
                boxShadow: form.subjects.includes(s) ? '0 4px 12px rgba(215,255,62,0.3)' : 'none',
              }}>{form.subjects.includes(s) ? '✓ ' : '+ '}{s}</button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <input style={{ ...inputStyle, flex: 1 }} placeholder="Add custom subject and press Enter..."
              value={form.subjectInput} onChange={e => setForm(f => ({ ...f, subjectInput: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && addSubject(form.subjectInput)}
              onFocus={focusAccent} onBlur={blurAccent}
            />
            <button onClick={() => addSubject(form.subjectInput)} style={{
              padding: '13px 22px', borderRadius: '12px', border: 'none',
              background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`,
              color: '#0A0A0A', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px',
              boxShadow: '0 4px 12px rgba(215,255,62,0.3)', flexShrink: 0,
            }}>+ Add</button>
          </div>

          {form.subjects.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '14px' }}>
              {form.subjects.map(s => (
                <span key={s} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: 'rgba(215,255,62,0.08)', color: COLORS.accent,
                  padding: '7px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600',
                  border: '1px solid rgba(215,255,62,0.25)', animation: 'slideIn 0.2s ease',
                }}>
                  {s}
                  <button onClick={() => removeSubject(s)} style={{
                    background: 'rgba(215,255,62,0.15)', border: 'none', color: COLORS.accent, cursor: 'pointer',
                    width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '14px', fontWeight: '800', padding: 0,
                  }}>×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* DATE + SCORE + HOURS */}
        <div className="sp-meta-row" style={{ marginBottom: '28px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '700', color: COLORS.text, marginBottom: '10px', fontSize: '14px' }}>📅 Exam Date</label>
            <input style={{ ...inputStyle, colorScheme: 'dark' }} type="date" value={form.examDate}
              onChange={e => setForm(f => ({ ...f, examDate: e.target.value }))}
              onFocus={focusAccent} onBlur={blurAccent}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '700', color: COLORS.text, marginBottom: '10px', fontSize: '14px' }}>🎯 Target Score</label>
            <input style={inputStyle} placeholder="e.g. 150/200 or 95%"
              value={form.expectedMarks} onChange={e => setForm(f => ({ ...f, expectedMarks: e.target.value }))}
              onFocus={focusAccent} onBlur={blurAccent}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '700', color: COLORS.text, marginBottom: '10px', fontSize: '14px' }}>⏱️ Daily Hours</label>
            <select value={form.dailyHours} onChange={e => setForm(f => ({ ...f, dailyHours: e.target.value }))}
              style={{ ...inputStyle, cursor: 'pointer' }}>
              {[1,2,3,4,5,6,7,8,10,12].map(h => <option key={h} value={h}>{h} hr{h > 1 ? 's' : ''}/day</option>)}
            </select>
          </div>
        </div>

        {/* WEAK TOPICS */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'block', fontWeight: '700', color: COLORS.text, marginBottom: '10px', fontSize: '15px' }}>
            ⚠️ Weak Topics
            <span style={{ color: COLORS.textMuted, fontWeight: '400', fontSize: '13px', marginLeft: '8px' }}>optional — AI will focus extra time here</span>
          </label>
          <input style={inputStyle} placeholder="e.g. Thermodynamics, Organic Chemistry, Integration, Genetics..."
            value={form.weakTopics} onChange={e => setForm(f => ({ ...f, weakTopics: e.target.value }))}
            onFocus={focusAccent} onBlur={blurAccent}
          />
        </div>

        {error && (
          <div style={{ marginBottom: '20px', background: COLORS.errorBg, border: `1px solid ${COLORS.errorBorder}`, borderRadius: '12px', padding: '14px 18px', color: COLORS.error, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            ⚠️ {error}
          </div>
        )}

        <button onClick={handleGenerate} disabled={loading} style={{
          width: '100%', background: loading ? '#2A2A2A' : `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`,
          color: loading ? '#6B7280' : '#0A0A0A', border: 'none', padding: '18px',
          borderRadius: '16px', fontSize: '17px', fontWeight: '800', cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
          boxShadow: loading ? 'none' : '0 8px 28px rgba(215,255,62,0.35)',
        }}
          onMouseOver={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; } }}
          onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          {loading ? (
            <><div style={{ width: '22px', height: '22px', border: '3px solid #6B7280', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />AI is building your personalized plan...</>
          ) : '🚀 Generate My Study Plan'}
        </button>
      </div>

      {/* RESULTS */}
      {(plan || resources) && (
        <div style={{ background: COLORS.card, borderRadius: '24px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.3)', border: `1px solid ${COLORS.border}`, animation: 'fadeUp 0.5s ease' }}>

          {/* TABS */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', background: COLORS.cardAlt, padding: '6px', borderRadius: '16px', width: 'fit-content', border: `1px solid ${COLORS.border}` }}>
            {[{ id: 'plan', label: '📋 Study Plan' }, { id: 'resources', label: '📖 Resources' }].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: '10px 28px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                fontWeight: '700', fontSize: '14px', fontFamily: 'inherit', transition: 'all 0.2s',
                background: tab === t.id ? `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})` : 'transparent',
                color: tab === t.id ? '#0A0A0A' : COLORS.textMuted,
                boxShadow: tab === t.id ? '0 4px 12px rgba(215,255,62,0.3)' : 'none',
              }}>{t.label}</button>
            ))}
          </div>

          {tab === 'plan' && plan && (
            <div>
              {/* PLAN HEADER */}
              <div style={{ background: 'linear-gradient(135deg, #0A0A0A, #1A1A0A)', borderRadius: '20px', padding: '32px', marginBottom: '24px', color: 'white', position: 'relative', overflow: 'hidden', border: `1px solid ${COLORS.border}` }}>
                <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(215,255,62,0.08)' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h3 style={{ margin: '0 0 10px', fontWeight: '800', fontSize: '22px' }}>{plan.title}</h3>
                  <p style={{ margin: '0 0 20px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, fontSize: '15px' }}>{plan.description}</p>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(215,255,62,0.1)', color: COLORS.accent, padding: '8px 18px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', border: '1px solid rgba(215,255,62,0.25)' }}>
                    ⏱️ Total Duration: {plan.totalDuration}
                  </span>
                </div>
              </div>

              {/* WEEKS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {plan.weeks?.map((w, i) => (
                  <div key={i} style={{
                    borderRadius: '20px', padding: '24px', border: `1px solid ${COLORS.border}`,
                    background: COLORS.cardAlt,
                    transition: 'all 0.2s', animation: `fadeUp 0.4s ease ${i * 0.08}s both`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '14px', flexShrink: 0,
                        background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#0A0A0A', fontWeight: '800', fontSize: '13px',
                        boxShadow: '0 4px 12px rgba(215,255,62,0.3)',
                      }}>W{w.week}</div>
                      <div>
                        <h4 style={{ margin: 0, fontWeight: '800', color: COLORS.text, fontSize: '17px' }}>{w.title}</h4>
                        <p style={{ margin: 0, color: COLORS.textMuted, fontSize: '13px' }}>Week {w.week} Plan</p>
                      </div>
                    </div>
                    <div className="sp-week-grid">
                      <div style={{ background: COLORS.cardAlt2, borderRadius: '14px', padding: '16px', border: `1px solid ${COLORS.border}` }}>
                        <p style={{ margin: '0 0 12px', fontWeight: '700', color: COLORS.accent, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>📌 Topics to Cover</p>
                        {w.topics?.map((t, j) => (
                          <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS.accent, flexShrink: 0, marginTop: '6px' }} />
                            <span style={{ color: '#D1D5DB', fontSize: '14px', lineHeight: 1.5 }}>{t}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ background: COLORS.cardAlt2, borderRadius: '14px', padding: '16px', border: `1px solid ${COLORS.border}` }}>
                        <p style={{ margin: '0 0 12px', fontWeight: '700', color: '#93C5FD', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>✅ Weekly Goals</p>
                        {w.goals?.map((g, j) => (
                          <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
                            <span style={{ fontSize: '14px', flexShrink: 0 }}>🎯</span>
                            <span style={{ color: '#D1D5DB', fontSize: '14px', lineHeight: 1.5 }}>{g}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'resources' && resources && (
            <div>
              <h3 style={{ margin: '0 0 20px', fontWeight: '800', fontSize: '22px', color: COLORS.text }}>📖 Recommended Resources</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {resources.map((r, i) => {
                  const typeConfig = {
                    book: { icon: '📚', color: '#C4B5FD', bg: 'rgba(196,181,253,0.08)', border: 'rgba(196,181,253,0.3)' },
                    youtube: { icon: '▶️', color: '#FCA5A5', bg: 'rgba(252,165,165,0.08)', border: 'rgba(252,165,165,0.3)' },
                    website: { icon: '🌐', color: '#93C5FD', bg: 'rgba(147,197,253,0.08)', border: 'rgba(147,197,253,0.3)' },
                    course: { icon: '🎓', color: '#86EFAC', bg: 'rgba(134,239,172,0.08)', border: 'rgba(134,239,172,0.3)' },
                  };
                  const config = typeConfig[r.type] || typeConfig.website;
                  const link = r.url || r.link || r.channelUrl || null;
                  return (
                    <div key={i} style={{
                      background: COLORS.cardAlt, borderRadius: '16px', padding: '20px 24px',
                      border: `1px solid ${config.border}`, display: 'flex',
                      flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
                      animation: `fadeUp 0.4s ease ${i * 0.06}s both`,
                    }}>
                      <div style={{ display: 'flex', gap: '14px', flex: 1, minWidth: '200px' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: config.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0, border: `1px solid ${config.border}` }}>
                          {config.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 6px', color: COLORS.text, fontWeight: '700', fontSize: '15px' }}>{r.title}</h4>
                          <p style={{ margin: '0 0 8px', color: COLORS.textMuted, fontSize: '13px', lineHeight: 1.6 }}>{r.description}</p>
                          {link && (
                            <a href={link} target="_blank" rel="noopener noreferrer" style={{
                              display: 'inline-flex', alignItems: 'center', gap: '6px',
                              color: config.color, fontSize: '13px', fontWeight: '700', textDecoration: 'none',
                            }}>Open ↗</a>
                          )}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0, alignItems: 'flex-end' }}>
                        <span style={{ background: config.bg, color: config.color, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', border: `1px solid ${config.border}` }}>{r.type}</span>
                        {r.subject && <span style={{ background: COLORS.cardAlt2, color: COLORS.textMuted, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>{r.subject}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}