import { useState, useEffect } from 'react';
import { getQuizHistory, deleteQuiz } from '../utils/gemini';

const COLORS = {
  bg: '#0A0A0A', card: '#111111', cardAlt: '#181818',
  border: 'rgba(255,255,255,0.08)',
  accent: '#D7FF3E', accentDark: '#A8E000',
  text: '#FFFFFF', textMuted: '#A1A1AA',
  error: '#F87171', errorBg: 'rgba(248,113,113,0.1)', errorBorder: 'rgba(248,113,113,0.35)',
  success: '#4ADE80', successBg: 'rgba(74,222,128,0.1)', successBorder: 'rgba(74,222,128,0.35)',
};

export default function QuizHistoryPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try { setQuizzes(await getQuizHistory()); } catch {}
    setLoading(false);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Delete this quiz result permanently?')) return;
    await deleteQuiz(id);
    setQuizzes(q => q.filter(x => x._id !== id));
    if (selected?._id === id) setSelected(null);
  };

  if (selected) {
    const pct = Math.round((selected.score / selected.totalQuestions) * 100);
    return (
      <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>
        <style>{`
          @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
          @media (max-width: 640px) {
            .options-grid { grid-template-columns: 1fr !important; }
            .score-row { flex-direction: column !important; gap: 12px !important; }
            .score-divider { display: none !important; }
          }
        `}</style>

        {/* BACK */}
        <button onClick={() => setSelected(null)} style={{
          display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px',
          background: COLORS.cardAlt, border: `1px solid ${COLORS.border}`, borderRadius: '12px',
          padding: '10px 20px', cursor: 'pointer', fontWeight: '700', color: COLORS.accent,
          fontSize: '14px', fontFamily: 'inherit', transition: 'all 0.2s',
        }}
          onMouseOver={e => e.currentTarget.style.borderColor = COLORS.accent}
          onMouseOut={e => e.currentTarget.style.borderColor = COLORS.border}
        >← Back to History</button>

        {/* SCORE CARD */}
        <div style={{
          borderRadius: '24px', padding: '36px', marginBottom: '24px', textAlign: 'center',
          background: pct >= 70 ? COLORS.successBg : COLORS.errorBg,
          border: `2px solid ${pct >= 70 ? COLORS.successBorder : COLORS.errorBorder}`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.3)`,
        }}>
          <div style={{ fontSize: '52px', marginBottom: '12px' }}>{pct >= 70 ? '🎉' : '📖'}</div>
          <h2 style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: '800', color: pct >= 70 ? COLORS.success : COLORS.error }}>
            {selected.subject}
          </h2>
          <div className="score-row" style={{ display: 'inline-flex', alignItems: 'center', gap: '20px', background: COLORS.card, padding: '16px 28px', borderRadius: '16px', margin: '16px 0', border: `1px solid ${COLORS.border}` }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: '800', color: pct >= 70 ? COLORS.success : COLORS.error }}>{pct}%</div>
              <div style={{ color: COLORS.textMuted, fontSize: '12px', fontWeight: '600' }}>Score</div>
            </div>
            <div className="score-divider" style={{ width: '1px', height: '40px', background: COLORS.border }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '800', color: COLORS.accent }}>{selected.score}/{selected.totalQuestions}</div>
              <div style={{ color: COLORS.textMuted, fontSize: '12px', fontWeight: '600' }}>Correct</div>
            </div>
            <div className="score-divider" style={{ width: '1px', height: '40px', background: COLORS.border }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: COLORS.text }}>{selected.difficulty}</div>
              <div style={{ color: COLORS.textMuted, fontSize: '12px', fontWeight: '600' }}>Difficulty</div>
            </div>
          </div>
          <p style={{ margin: 0, color: COLORS.textMuted, fontSize: '13px' }}>{new Date(selected.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        {/* QUESTIONS */}
        {selected.questions && selected.questions.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {selected.questions.map((q, i) => {
              const userAnswer = selected.userAnswers?.[i];
              const isCorrect = userAnswer === q.correctAnswer;
              return (
                <div key={i} style={{
                  background: COLORS.card, borderRadius: '20px', padding: '24px',
                  border: `2px solid ${isCorrect ? COLORS.successBorder : COLORS.errorBorder}`,
                  animation: `fadeUp 0.4s ease ${i * 0.05}s both`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
                        background: isCorrect ? COLORS.successBg : COLORS.errorBg,
                        border: `1px solid ${isCorrect ? COLORS.successBorder : COLORS.errorBorder}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: isCorrect ? COLORS.success : COLORS.error, fontWeight: '800', fontSize: '13px',
                      }}>Q{i + 1}</div>
                      <p style={{ fontWeight: '700', color: COLORS.text, margin: 0, fontSize: '15px', lineHeight: 1.6 }}>{q.question}</p>
                    </div>
                    <span style={{ fontSize: '24px', marginLeft: '12px', flexShrink: 0 }}>{isCorrect ? '✅' : '❌'}</span>
                  </div>

                  <div className="options-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                    {q.options.map((opt, j) => {
                      let bg = COLORS.cardAlt, border = COLORS.border, color = '#D1D5DB';
                      if (opt === q.correctAnswer) { bg = COLORS.successBg; border = COLORS.successBorder; color = COLORS.success; }
                      else if (opt === userAnswer && !isCorrect) { bg = COLORS.errorBg; border = COLORS.errorBorder; color = COLORS.error; }
                      return (
                        <div key={j} style={{ background: bg, border: `2px solid ${border}`, borderRadius: '12px', padding: '12px 14px', fontSize: '13px', color, fontWeight: opt === q.correctAnswer || opt === userAnswer ? '700' : '400', lineHeight: 1.4 }}>
                          <span style={{ color: COLORS.accent, marginRight: '8px', fontWeight: '800' }}>{['A', 'B', 'C', 'D'][j]}.</span>
                          {opt}
                          {opt === q.correctAnswer && <span style={{ marginLeft: '6px' }}>✓</span>}
                          {opt === userAnswer && !isCorrect && <span style={{ marginLeft: '6px' }}>✗</span>}
                        </div>
                      );
                    })}
                  </div>

                  {!userAnswer && (
                    <div style={{ marginBottom: '12px', background: 'rgba(251,191,36,0.1)', borderRadius: '10px', padding: '10px 14px', color: '#FBBF24', fontSize: '13px', fontWeight: '600', border: '1px solid rgba(251,191,36,0.3)' }}>
                      ⚠️ Not answered
                    </div>
                  )}

                  <div style={{ background: 'rgba(215,255,62,0.05)', borderRadius: '12px', padding: '14px 18px', borderLeft: `4px solid ${COLORS.accent}` }}>
                    <span style={{ fontWeight: '700', color: COLORS.accent, fontSize: '14px' }}>💡 Explanation: </span>
                    <span style={{ color: '#D1D5DB', fontSize: '14px', lineHeight: 1.6 }}>{q.explanation}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ background: COLORS.card, borderRadius: '20px', padding: '40px', textAlign: 'center', border: `1px solid ${COLORS.border}` }}>
            <div style={{ fontSize: '44px', marginBottom: '12px' }}>📊</div>
            <p style={{ color: COLORS.textMuted, margin: 0 }}>Detailed questions not available for this quiz.</p>
            <p style={{ color: COLORS.textMuted, fontSize: '13px', marginTop: '8px' }}>Take a new quiz to see full details!</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @media (max-width: 640px) {
          .quiz-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 4px', fontWeight: '800', fontSize: '28px', background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>🏆 Quiz History</h2>
        <p style={{ margin: 0, color: COLORS.textMuted }}>Click any quiz to see full details and review your answers</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: COLORS.textMuted }}>
          <div style={{ width: '36px', height: '36px', border: `3px solid ${COLORS.border}`, borderTopColor: COLORS.accent, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          Loading...
        </div>
      ) : quizzes.length === 0 ? (
        <div style={{ background: COLORS.card, borderRadius: '20px', padding: '60px 20px', textAlign: 'center', border: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: '52px', marginBottom: '16px' }}>📝</div>
          <p style={{ fontWeight: '700', color: COLORS.text, fontSize: '17px', margin: 0 }}>No quizzes taken yet</p>
          <p style={{ color: COLORS.textMuted, marginTop: '6px', fontSize: '14px' }}>Take your first quiz from the Quiz page!</p>
        </div>
      ) : (
        <div className="quiz-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {quizzes.map((q, i) => {
            const pct = Math.round((q.score / q.totalQuestions) * 100);
            return (
              <div key={q._id} onClick={() => setSelected(q)} style={{
                background: COLORS.card, borderRadius: '20px', padding: '22px', cursor: 'pointer',
                border: `2px solid ${pct >= 70 ? COLORS.successBorder : COLORS.errorBorder}`,
                animation: `fadeUp 0.4s ease ${i * 0.05}s both`,
                transition: 'all 0.2s',
              }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(215,255,62,0.1)'; e.currentTarget.style.borderColor = COLORS.accent; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = pct >= 70 ? COLORS.successBorder : COLORS.errorBorder; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <h4 style={{ margin: 0, fontWeight: '800', color: COLORS.text, fontSize: '15px' }}>{q.subject}</h4>
                  <button onClick={(e) => handleDelete(q._id, e)} style={{
                    background: COLORS.errorBg, color: COLORS.error, border: `1px solid ${COLORS.errorBorder}`,
                    borderRadius: '8px', padding: '4px 10px', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit',
                  }}>🗑️</button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <span style={{ fontSize: '32px', fontWeight: '800', color: pct >= 70 ? COLORS.success : COLORS.error }}>{pct}%</span>
                  <div>
                    <div style={{ color: COLORS.text, fontSize: '13px', fontWeight: '600' }}>{q.score}/{q.totalQuestions} correct</div>
                    <div style={{ color: COLORS.textMuted, fontSize: '12px' }}>{q.difficulty}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ background: COLORS.cardAlt, color: COLORS.textMuted, padding: '3px 10px', borderRadius: '12px', fontSize: '11px', border: `1px solid ${COLORS.border}` }}>{new Date(q.createdAt).toLocaleDateString()}</span>
                  <span style={{ color: COLORS.accent, fontSize: '13px', fontWeight: '700' }}>View Details →</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}