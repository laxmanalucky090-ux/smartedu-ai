import { useState } from 'react';
import { generateStudyPlan, generateResources } from '../utils/gemini';

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
    { id: 'beginner', label: '🌱 Beginner', desc: 'Just started' },
    { id: 'intermediate', label: '📈 Intermediate', desc: 'Know basics' },
    { id: 'advanced', label: '🔥 Advanced', desc: 'Strong foundation' },
  ];

  const popularSubjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'History', 'Geography', 'Computer Science', 'Economics'];

  const addSubject = (sub) => {
    const s = sub.trim();
    if (s && !form.subjects.includes(s)) {
      setForm(f => ({ ...f, subjects: [...f.subjects, s], subjectInput: '' }));
    }
  };

  const removeSubject = (sub) => setForm(f => ({ ...f, subjects: f.subjects.filter(s => s !== sub) }));

  const handleGenerate = async () => {
    if (!form.examName) return setError('Please enter your exam name.');
    if (form.subjects.length === 0) return setError('Please add at least one subject.');
    setError(''); setLoading(true); setPlan(null); setResources(null);
    try {
      const subjectsStr = form.subjects.join(', ');
      const [planData, resData] = await Promise.all([
        generateStudyPlan(form.examName, form.examDate, form.expectedMarks, subjectsStr, form.weakTopics, form.dailyHours, language),
        generateResources(subjectsStr, language),
      ]);
      setPlan(planData); setResources(resData);
      setProgress(p => ({ ...p, studyPlanGenerated: true }));
      setTab('plan');
    } catch { setError('Failed to generate. Please try again.'); }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%', padding: '13px 16px', borderRadius: '12px', fontSize: '15px',
    boxSizing: 'border-box', border: '2px solid #e2e8f0', outline: 'none',
    fontFamily: 'inherit', background: 'white', color: '#1e293b', transition: 'all 0.2s',
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
      `}</style>

      {/* HEADER */}
      <div style={{ marginBottom: '28px', animation: 'fadeUp 0.4s ease' }}>
        <h2 style={{ margin: '0 0 6px', fontWeight: '800', fontSize: '30px', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          📚 Study Planner
        </h2>
        <p style={{ margin: 0, color: '#64748b', fontSize: '15px' }}>Tell us about your exam — we'll build a personalized AI study plan</p>
      </div>

      {/* FORM CARD */}
      <div style={{ background: 'white', borderRadius: '24px', padding: '36px', marginBottom: '24px', boxShadow: '0 4px 24px rgba(124,58,237,0.08)', border: '1px solid #ede9fe', animation: 'fadeUp 0.5s ease 0.1s both' }}>

        {/* EXAM NAME */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontWeight: '700', color: '#1e293b', marginBottom: '10px', fontSize: '15px' }}>
            🎯 Exam Name <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input style={inputStyle} placeholder="e.g. JEE Main, NEET, GATE, UPSC, Class 12 Boards..."
            value={form.examName} onChange={e => setForm(f => ({ ...f, examName: e.target.value }))}
            onFocus={e => { e.target.style.borderColor = '#7c3aed'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; }}
            onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
          />
        </div>

        {/* CURRENT LEVEL */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontWeight: '700', color: '#1e293b', marginBottom: '10px', fontSize: '15px' }}>
            📊 Your Current Level <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {levels.map(l => (
              <div key={l.id} onClick={() => setForm(f => ({ ...f, level: l.id }))} style={{
                padding: '16px', borderRadius: '14px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                border: `2px solid ${form.level === l.id ? '#7c3aed' : '#e2e8f0'}`,
                background: form.level === l.id ? 'linear-gradient(135deg, #f5f3ff, #ede9fe)' : 'white',
                boxShadow: form.level === l.id ? '0 4px 15px rgba(124,58,237,0.2)' : 'none',
                transform: form.level === l.id ? 'translateY(-2px)' : 'translateY(0)',
              }}>
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>{l.label.split(' ')[0]}</div>
                <div style={{ fontWeight: '700', color: form.level === l.id ? '#7c3aed' : '#1e293b', fontSize: '14px' }}>{l.label.split(' ').slice(1).join(' ')}</div>
                <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>{l.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SUBJECTS */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontWeight: '700', color: '#1e293b', marginBottom: '10px', fontSize: '15px' }}>
            📖 Subjects <span style={{ color: '#ef4444' }}>*</span>
            <span style={{ color: '#94a3b8', fontWeight: '400', fontSize: '13px', marginLeft: '8px' }}>({form.subjects.length} added)</span>
          </label>

          {/* Quick add chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
            {popularSubjects.map(s => (
              <button key={s} onClick={() => addSubject(s)} style={{
                padding: '6px 14px', borderRadius: '20px', border: `1px solid ${form.subjects.includes(s) ? '#7c3aed' : '#e2e8f0'}`,
                background: form.subjects.includes(s) ? '#7c3aed' : 'white',
                color: form.subjects.includes(s) ? 'white' : '#475569',
                cursor: 'pointer', fontSize: '13px', fontWeight: '500', fontFamily: 'inherit', transition: 'all 0.2s',
              }}>{form.subjects.includes(s) ? '✓ ' : '+ '}{s}</button>
            ))}
          </div>

          {/* Custom subject input */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <input style={{ ...inputStyle, flex: 1 }} placeholder="Add custom subject..."
              value={form.subjectInput} onChange={e => setForm(f => ({ ...f, subjectInput: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && addSubject(form.subjectInput)}
              onFocus={e => { e.target.style.borderColor = '#7c3aed'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
            <button onClick={() => addSubject(form.subjectInput)} style={{
              padding: '13px 20px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
              color: 'white', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px',
            }}>Add</button>
          </div>

          {/* Added subjects */}
          {form.subjects.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
              {form.subjects.map(s => (
                <span key={s} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  background: 'linear-gradient(135deg, #ede9fe, #dbeafe)', color: '#4c1d95',
                  padding: '6px 14px', borderRadius: '20px', fontSize: '14px', fontWeight: '600',
                  border: '1px solid #c4b5fd',
                }}>
                  {s}
                  <button onClick={() => removeSubject(s)} style={{
                    background: 'none', border: 'none', color: '#7c3aed', cursor: 'pointer',
                    fontSize: '16px', lineHeight: 1, padding: '0', fontWeight: '700',
                  }}>×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* DATE + SCORE + HOURS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '700', color: '#1e293b', marginBottom: '10px', fontSize: '15px' }}>📅 Exam Date</label>
            <input style={{ ...inputStyle, colorScheme: 'light' }} type="date" value={form.examDate}
              onChange={e => setForm(f => ({ ...f, examDate: e.target.value }))}
              onFocus={e => { e.target.style.borderColor = '#7c3aed'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '700', color: '#1e293b', marginBottom: '10px', fontSize: '15px' }}>🎯 Target Score</label>
            <input style={inputStyle} placeholder="e.g. 150/200 or 95%"
              value={form.expectedMarks} onChange={e => setForm(f => ({ ...f, expectedMarks: e.target.value }))}
              onFocus={e => { e.target.style.borderColor = '#7c3aed'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '700', color: '#1e293b', marginBottom: '10px', fontSize: '15px' }}>⏱️ Daily Study Hours</label>
            <select value={form.dailyHours} onChange={e => setForm(f => ({ ...f, dailyHours: e.target.value }))}
              style={{ ...inputStyle, cursor: 'pointer' }}>
              {[1,2,3,4,5,6,7,8,10,12].map(h => <option key={h} value={h}>{h} hour{h > 1 ? 's' : ''}/day</option>)}
            </select>
          </div>
        </div>

        {/* WEAK TOPICS */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'block', fontWeight: '700', color: '#1e293b', marginBottom: '10px', fontSize: '15px' }}>
            ⚠️ Weak Topics <span style={{ color: '#94a3b8', fontWeight: '400', fontSize: '13px' }}>(optional — we'll focus extra time here)</span>
          </label>
          <input style={inputStyle} placeholder="e.g. Thermodynamics, Organic Chemistry, Integration, Genetics..."
            value={form.weakTopics} onChange={e => setForm(f => ({ ...f, weakTopics: e.target.value }))}
            onFocus={e => { e.target.style.borderColor = '#7c3aed'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; }}
            onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
          />
        </div>

        {error && (
          <div style={{ marginBottom: '20px', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '12px', padding: '12px 16px', color: '#e11d48', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ⚠️ {error}
          </div>
        )}

        <button onClick={handleGenerate} disabled={loading} style={{
          width: '100%', background: loading ? '#e2e8f0' : 'linear-gradient(135deg, #7c3aed, #2563eb)',
          color: loading ? '#94a3b8' : 'white', border: 'none', padding: '16px',
          borderRadius: '14px', fontSize: '17px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
          boxShadow: loading ? 'none' : '0 8px 24px rgba(124,58,237,0.35)',
        }}
          onMouseOver={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(124,58,237,0.45)'; } }}
          onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = loading ? 'none' : '0 8px 24px rgba(124,58,237,0.35)'; }}
        >
          {loading ? (
            <>
              <div style={{ width: '20px', height: '20px', border: '3px solid #94a3b8', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              AI is building your personalized plan...
            </>
          ) : '🚀 Generate My Study Plan'}
        </button>
      </div>

      {/* RESULTS */}
      {(plan || resources) && (
        <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 24px rgba(124,58,237,0.08)', border: '1px solid #ede9fe', animation: 'fadeUp 0.5s ease' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', background: '#f8faff', padding: '6px', borderRadius: '16px', width: 'fit-content' }}>
            {[{ id: 'plan', label: '📋 Study Plan' }, { id: 'resources', label: '📖 Resources' }].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: '10px 28px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                fontWeight: '700', fontSize: '14px', fontFamily: 'inherit', transition: 'all 0.2s',
                background: tab === t.id ? 'linear-gradient(135deg, #7c3aed, #2563eb)' : 'transparent',
                color: tab === t.id ? 'white' : '#64748b',
                boxShadow: tab === t.id ? '0 4px 12px rgba(124,58,237,0.3)' : 'none',
              }}>{t.label}</button>
            ))}
          </div>

          {tab === 'plan' && plan && (
            <div>
              <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)', borderRadius: '18px', padding: '28px', marginBottom: '24px', color: 'white' }}>
                <h3 style={{ margin: '0 0 8px', fontWeight: '800', fontSize: '22px' }}>{plan.title}</h3>
                <p style={{ margin: '0 0 16px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>{plan.description}</p>
                <span style={{ background: 'rgba(167,139,250,0.2)', color: '#c4b5fd', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', border: '1px solid rgba(167,139,250,0.3)' }}>
                  ⏱️ Total Duration: {plan.totalDuration}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {plan.weeks?.map((w, i) => (
                  <div key={i} style={{
                    borderRadius: '18px', padding: '24px', border: '1px solid #ede9fe',
                    background: i % 2 === 0 ? 'linear-gradient(135deg, #fafbff, #f5f3ff)' : 'linear-gradient(135deg, #f0fdf4, #f5f3ff)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
                        background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '14px',
                      }}>W{w.week}</div>
                      <h4 style={{ margin: 0, fontWeight: '800', color: '#1e293b', fontSize: '17px' }}>{w.title}</h4>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div>
                        <p style={{ margin: '0 0 10px', fontWeight: '700', color: '#7c3aed', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>📌 Topics to Cover</p>
                        {w.topics?.map((t, j) => (
                          <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '7px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#7c3aed', flexShrink: 0, marginTop: '6px' }} />
                            <span style={{ color: '#374151', fontSize: '14px', lineHeight: 1.5 }}>{t}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <p style={{ margin: '0 0 10px', fontWeight: '700', color: '#2563eb', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>✅ Weekly Goals</p>
                        {w.goals?.map((g, j) => (
                          <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '7px' }}>
                            <span style={{ fontSize: '14px', flexShrink: 0 }}>🎯</span>
                            <span style={{ color: '#374151', fontSize: '14px', lineHeight: 1.5 }}>{g}</span>
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
              <h3 style={{ margin: '0 0 20px', fontWeight: '800', fontSize: '22px', color: '#1e293b' }}>📖 Recommended Resources by Subject</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {resources.map((r, i) => (
                  <div key={i} style={{
                    background: 'linear-gradient(135deg, #f0fdf4, #f0f9ff)', borderRadius: '16px',
                    padding: '20px 24px', borderLeft: '4px solid #16a34a',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px',
                  }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 6px', color: '#15803d', fontWeight: '700', fontSize: '16px' }}>{r.title}</h4>
                      <p style={{ margin: 0, color: '#374151', fontSize: '14px', lineHeight: 1.6 }}>{r.description}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0, alignItems: 'flex-end' }}>
                      <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>{r.type}</span>
                      {r.subject && <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>{r.subject}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}