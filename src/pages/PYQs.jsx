import { useState } from 'react';
import { generatePYQs } from '../utils/gemini';

const COLORS = {
  bg: '#0A0A0A', card: '#111111', cardAlt: '#181818',
  border: 'rgba(255,255,255,0.08)',
  accent: '#D7FF3E', accentDark: '#A8E000',
  text: '#FFFFFF', textMuted: '#A1A1AA',
  success: '#4ADE80', successBg: 'rgba(74,222,128,0.1)',
  error: '#F87171', errorBg: 'rgba(248,113,113,0.1)', errorBorder: 'rgba(248,113,113,0.35)',
};

export default function PYQsPage({ language }) {
  const [examName, setExamName] = useState('');
  const [subject, setSubject] = useState('');
  const [numQ, setNumQ] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(null);

  const popularExams = ['JEE Main', 'NEET', 'UPSC', 'GATE', 'CAT', 'Class 12 Boards', 'Class 10 Boards'];

  const handleGenerate = async () => {
    if (!examName.trim()) return setError('Please enter or select an exam.');
    if (!subject.trim()) return setError('Please enter a subject.');
    setError(''); setLoading(true); setQuestions([]); setExpanded(null);
    try {
      const qs = await generatePYQs(examName, subject, numQ, language);
      if (!qs || qs.length === 0) throw new Error('No questions returned');
      setQuestions(qs);
    } catch {
      setError('Failed to generate PYQs. Please try again.');
    }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%', padding: '13px 16px', borderRadius: '12px', fontSize: '15px',
    boxSizing: 'border-box', border: `2px solid ${COLORS.border}`, outline: 'none',
    fontFamily: 'inherit', background: COLORS.cardAlt, color: COLORS.text, transition: 'all 0.2s',
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ marginBottom: '24px', animation: 'fadeUp 0.4s ease' }}>
        <h2 style={{ margin: '0 0 4px', fontWeight: '800', fontSize: '28px', background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          📜 Previous Year Questions
        </h2>
        <p style={{ margin: 0, color: COLORS.textMuted, fontSize: '14px' }}>Practice with exam-pattern questions and detailed step-by-step explanations</p>
      </div>

      {/* FORM */}
      <div style={{ background: COLORS.card, borderRadius: '20px', padding: '28px', marginBottom: '24px', border: `1px solid ${COLORS.border}`, animation: 'fadeUp 0.5s ease 0.1s both' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: '700', color: COLORS.text, marginBottom: '10px', fontSize: '14px' }}>🎯 Exam</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
            {popularExams.map(e => (
              <button key={e} onClick={() => setExamName(e)} style={{
                padding: '6px 14px', borderRadius: '20px', border: `1px solid ${examName === e ? COLORS.accent : COLORS.border}`,
                background: examName === e ? COLORS.accent : COLORS.cardAlt,
                color: examName === e ? '#0A0A0A' : COLORS.textMuted,
                cursor: 'pointer', fontSize: '13px', fontWeight: '600', fontFamily: 'inherit',
              }}>{e}</button>
            ))}
          </div>
          <input style={inputStyle} placeholder="Or type your exam name..."
            value={examName} onChange={e => setExamName(e.target.value)}
            onFocus={e => e.target.style.borderColor = COLORS.accent}
            onBlur={e => e.target.style.borderColor = COLORS.border}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '700', color: COLORS.text, marginBottom: '10px', fontSize: '14px' }}>📖 Subject</label>
            <input style={inputStyle} placeholder="e.g. Physics, Mathematics, History..."
              value={subject} onChange={e => setSubject(e.target.value)}
              onFocus={e => e.target.style.borderColor = COLORS.accent}
              onBlur={e => e.target.style.borderColor = COLORS.border}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '700', color: COLORS.text, marginBottom: '10px', fontSize: '14px' }}># Questions</label>
            <select value={numQ} onChange={e => setNumQ(Number(e.target.value))} style={{ ...inputStyle, cursor: 'pointer' }}>
              {[5, 10, 15, 20].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        {error && (
          <div style={{ marginBottom: '16px', background: COLORS.errorBg, border: `1px solid ${COLORS.errorBorder}`, borderRadius: '12px', padding: '12px 16px', color: COLORS.error, fontSize: '14px' }}>
            ⚠️ {error}
          </div>
        )}

        <button onClick={handleGenerate} disabled={loading} style={{
          width: '100%', background: loading ? COLORS.cardAlt : `linear-gradient(135deg, ${COLORS.accentDark}, ${COLORS.accent})`,
          color: loading ? COLORS.textMuted : '#0A0A0A', border: 'none', padding: '15px',
          borderRadius: '14px', fontSize: '16px', fontWeight: '800', cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
        }}>
          {loading ? (
            <>
              <div style={{ width: '18px', height: '18px', border: '3px solid rgba(0,0,0,0.3)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              Generating PYQs...
            </>
          ) : '📜 Generate Previous Year Questions'}
        </button>
      </div>

      {/* RESULTS */}
      {questions.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', animation: 'fadeUp 0.5s ease' }}>
          {questions.map((q, i) => (
            <div key={i} style={{
              background: COLORS.card, borderRadius: '16px',
              border: `1px solid ${expanded === i ? COLORS.accent : COLORS.border}`,
              overflow: 'hidden', transition: 'border-color 0.2s',
            }}>
              <div onClick={() => setExpanded(expanded === i ? null : i)} style={{
                padding: '18px 22px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{ background: 'rgba(215,255,62,0.12)', color: COLORS.accent, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>Q{i + 1}</span>
                    {q.year && <span style={{ color: COLORS.textMuted, fontSize: '12px' }}>📅 {q.year}</span>}
                  </div>
                  <p style={{ margin: 0, color: COLORS.text, fontSize: '15px', fontWeight: '600', lineHeight: 1.5 }}>{q.question}</p>
                </div>
                <span style={{ color: COLORS.accent, fontSize: '18px', flexShrink: 0 }}>{expanded === i ? '▲' : '▼'}</span>
              </div>

              {expanded === i && (
                <div style={{ padding: '0 22px 22px', borderTop: `1px solid ${COLORS.border}` }}>
                  <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    {q.options?.map((opt, j) => (
                      <div key={j} style={{
                        padding: '10px 14px', borderRadius: '10px', fontSize: '14px',
                        background: opt === q.correctAnswer ? COLORS.successBg : COLORS.cardAlt,
                        border: `1px solid ${opt === q.correctAnswer ? 'rgba(74,222,128,0.35)' : COLORS.border}`,
                        color: opt === q.correctAnswer ? COLORS.success : '#D1D5DB',
                        fontWeight: opt === q.correctAnswer ? '700' : '400',
                      }}>
                        {opt === q.correctAnswer ? '✅ ' : ''}{opt}
                      </div>
                    ))}
                  </div>
                  <div style={{ background: COLORS.cardAlt, borderRadius: '12px', padding: '16px 18px', border: `1px solid ${COLORS.border}` }}>
                    <p style={{ margin: '0 0 8px', fontWeight: '700', color: COLORS.accent, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>📝 Step-by-Step Explanation</p>
                    <p style={{ margin: 0, color: '#D1D5DB', fontSize: '14px', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{q.explanation}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}