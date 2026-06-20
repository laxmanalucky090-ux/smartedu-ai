import { useState, useEffect } from 'react';
import { getQuizHistory, deleteQuiz } from '../utils/gemini';

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
        <style>{`@keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }`}</style>
        
        {/* BACK BUTTON */}
        <button onClick={() => setSelected(null)} style={{
          display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px',
          background: 'white', border: '2px solid #e0e7ff', borderRadius: '12px',
          padding: '10px 20px', cursor: 'pointer', fontWeight: '700', color: '#7c3aed',
          fontSize: '14px', fontFamily: 'inherit',
        }}>← Back to History</button>

        {/* SCORE CARD */}
        <div style={{
          borderRadius: '24px', padding: '36px', marginBottom: '24px', textAlign: 'center',
          background: pct >= 70 ? 'linear-gradient(135deg, #dcfce7, #bbf7d0)' : 'linear-gradient(135deg, #fee2e2, #fecaca)',
          border: `2px solid ${pct >= 70 ? '#86efac' : '#fca5a5'}`,
        }}>
          <div style={{ fontSize: '52px', marginBottom: '12px' }}>{pct >= 70 ? '🎉' : '📖'}</div>
          <h2 style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: '800', color: pct >= 70 ? '#15803d' : '#dc2626' }}>
            {selected.subject}
          </h2>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: 'white', padding: '16px 32px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', margin: '12px 0' }}>
            <span style={{ fontSize: '40px', fontWeight: '800', color: pct >= 70 ? '#15803d' : '#dc2626' }}>{pct}%</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '700', color: '#374151' }}>{selected.score}/{selected.totalQuestions} correct</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>{selected.difficulty} • {new Date(selected.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {/* QUESTIONS DETAIL */}
        {selected.questions && selected.questions.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {selected.questions.map((q, i) => {
              const userAnswer = selected.userAnswers?.[i];
              const isCorrect = userAnswer === q.correctAnswer;
              return (
                <div key={i} style={{
                  background: 'white', borderRadius: '20px', padding: '24px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                  borderLeft: `5px solid ${isCorrect ? '#16a34a' : '#dc2626'}`,
                  animation: `fadeUp 0.4s ease ${i * 0.05}s both`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <p style={{ fontWeight: '700', color: '#1e293b', margin: 0, fontSize: '16px', flex: 1, lineHeight: 1.5 }}>
                      <span style={{ color: '#7c3aed', marginRight: '8px' }}>Q{i + 1}.</span>{q.question}
                    </p>
                    <span style={{ fontSize: '24px', marginLeft: '12px' }}>{isCorrect ? '✅' : '❌'}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                    {q.options.map((opt, j) => {
                      let bg = '#f8fafc', border = '#e2e8f0', color = '#374151';
                      if (opt === q.correctAnswer) { bg = '#dcfce7'; border = '#86efac'; color = '#15803d'; }
                      else if (opt === userAnswer && !isCorrect) { bg = '#fee2e2'; border = '#fca5a5'; color = '#dc2626'; }
                      return (
                        <div key={j} style={{ background: bg, border: `2px solid ${border}`, borderRadius: '12px', padding: '12px 16px', fontSize: '14px', color, fontWeight: opt === q.correctAnswer || opt === userAnswer ? '700' : '400', lineHeight: 1.4 }}>
                          <span style={{ color: '#9ca3af', marginRight: '8px' }}>{['A', 'B', 'C', 'D'][j]}.</span>
                          {opt}
                          {opt === q.correctAnswer && <span style={{ marginLeft: '8px' }}>✓</span>}
                          {opt === userAnswer && !isCorrect && <span style={{ marginLeft: '8px' }}>✗</span>}
                        </div>
                      );
                    })}
                  </div>

                  {!userAnswer && (
                    <div style={{ marginBottom: '12px', background: '#fef3c7', borderRadius: '10px', padding: '10px 14px', color: '#d97706', fontSize: '13px', fontWeight: '600' }}>
                      ⚠️ Not answered
                    </div>
                  )}

                  <div style={{ background: '#f0f4ff', borderRadius: '12px', padding: '14px 18px', borderLeft: '4px solid #2563eb' }}>
                    <span style={{ fontWeight: '700', color: '#1e40af' }}>💡 Explanation: </span>
                    <span style={{ color: '#374151', fontSize: '14px' }}>{q.explanation}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: '20px', padding: '40px', textAlign: 'center', color: '#64748b' }}>
            <p>Detailed questions not available for this quiz (taken before update).</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      <style>{`@keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }`}</style>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 4px', fontWeight: '800', fontSize: '28px', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>📝 Quiz History</h2>
        <p style={{ margin: 0, color: '#64748b' }}>Click any quiz to see full details and review your answers</p>
      </div>

      {loading ? (
        <p style={{ color: '#64748b' }}>Loading...</p>
      ) : quizzes.length === 0 ? (
        <div style={{ background: 'white', borderRadius: '20px', padding: '60px 20px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '52px', marginBottom: '16px' }}>📝</div>
          <p style={{ fontWeight: '700', color: '#1e293b', fontSize: '17px', margin: 0 }}>No quizzes taken yet</p>
          <p style={{ color: '#64748b', marginTop: '6px' }}>Take your first quiz from the Quiz page!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {quizzes.map((q, i) => {
            const pct = Math.round((q.score / q.totalQuestions) * 100);
            return (
              <div key={q._id} onClick={() => setSelected(q)} style={{
                background: 'white', borderRadius: '20px', padding: '24px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)', cursor: 'pointer',
                border: `2px solid ${pct >= 70 ? '#bbf7d0' : '#fecaca'}`,
                animation: `fadeUp 0.4s ease ${i * 0.05}s both`,
                transition: 'all 0.2s',
              }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(124,58,237,0.15)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <h4 style={{ margin: 0, fontWeight: '800', color: '#1e293b', fontSize: '16px' }}>{q.subject}</h4>
                  <button onClick={(e) => handleDelete(q._id, e)} style={{
                    background: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3',
                    borderRadius: '8px', padding: '4px 10px', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit',
                  }}>🗑️</button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '36px', fontWeight: '800', color: pct >= 70 ? '#15803d' : '#dc2626' }}>{pct}%</span>
                  <div>
                    <div style={{ color: '#374151', fontSize: '14px', fontWeight: '600' }}>{q.score}/{q.totalQuestions} correct</div>
                    <div style={{ color: '#94a3b8', fontSize: '12px' }}>{q.difficulty}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ background: '#f1f5f9', color: '#475569', padding: '3px 10px', borderRadius: '12px', fontSize: '11px' }}>{new Date(q.createdAt).toLocaleDateString()}</span>
                  <span style={{ color: '#7c3aed', fontSize: '13px', fontWeight: '700' }}>View Details →</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}