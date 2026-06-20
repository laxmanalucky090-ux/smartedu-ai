import { useState, useEffect } from 'react';
import { getQuizHistory, deleteQuiz } from '../utils/gemini';

export default function QuizHistoryPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try { setQuizzes(await getQuizHistory()); } catch {}
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this quiz result permanently?')) return;
    await deleteQuiz(id);
    setQuizzes(q => q.filter(x => x._id !== id));
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      <style>{`@keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }`}</style>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 4px', fontWeight: '800', fontSize: '28px', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>📝 Quiz History</h2>
        <p style={{ margin: 0, color: '#64748b' }}>All your quiz attempts and scores</p>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {quizzes.map((q, i) => {
            const pct = Math.round((q.score / q.totalQuestions) * 100);
            return (
              <div key={q._id} style={{
                background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                border: `1px solid ${pct >= 70 ? '#bbf7d0' : '#fecaca'}`, animation: `fadeUp 0.4s ease ${i * 0.05}s both`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h4 style={{ margin: 0, fontWeight: '800', color: '#1e293b' }}>{q.subject}</h4>
                  <button onClick={() => handleDelete(q._id)} style={{
                    background: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3', borderRadius: '8px',
                    padding: '4px 10px', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit',
                  }}>🗑️</button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '32px', fontWeight: '800', color: pct >= 70 ? '#15803d' : '#dc2626' }}>{pct}%</span>
                  <span style={{ color: '#64748b', fontSize: '13px' }}>{q.score}/{q.totalQuestions} correct</span>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ background: '#f1f5f9', color: '#475569', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600' }}>{q.difficulty}</span>
                  <span style={{ background: '#f1f5f9', color: '#475569', padding: '3px 10px', borderRadius: '12px', fontSize: '11px' }}>{new Date(q.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}