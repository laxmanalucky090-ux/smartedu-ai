import { useState } from 'react';
import { generateQuiz, saveQuizResult } from '../utils/gemini';

export default function QuizPage({ language, progress, setProgress }) {
  const [subject, setSubject] = useState('');
  const [numQ, setNumQ] = useState(5);
  const [difficulty, setDifficulty] = useState('medium');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!subject.trim()) return setError('Please enter a subject.');
    setError(''); setLoading(true); setQuestions([]); setAnswers({}); setSubmitted(false);
    try {
      const qs = await generateQuiz(subject, numQ, difficulty, language);
      if (!qs || qs.length === 0) throw new Error('No questions returned');
      setQuestions(qs);
    } catch { setError('Failed to generate quiz. Please try again.'); }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) return setError('Please answer all questions before submitting.');
    setError(''); setSubmitted(true);
    const correct = questions.filter((q, i) => answers[i] === q.correctAnswer).length;
    const score = Math.round((correct / questions.length) * 100);
    setProgress(p => ({ ...p, quizzesCompleted: p.quizzesCompleted + 1, quizScores: [...p.quizScores, score] }));
    try {
    await saveQuizResult(subject, correct, questions.length, difficulty, questions, answers);
    } catch {}
  };

  const handleTryAgain = () => {
    setQuestions([]);
    setAnswers({});
    setSubmitted(false);
    setError('');
  };

  const correct = submitted ? questions.filter((q, i) => answers[i] === q.correctAnswer).length : 0;
  const scorePercent = submitted ? Math.round(correct / questions.length * 100) : 0;

  return (
    <div>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes celebrate { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
      `}</style>

      <div style={{ marginBottom: '24px', animation: 'fadeUp 0.4s ease' }}>
        <h2 style={{ margin: '0 0 4px', fontWeight: '800', fontSize: '28px', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>📝 Quiz Generator</h2>
        <p style={{ margin: 0, color: '#64748b' }}>Test your knowledge with AI-generated questions</p>
      </div>

      <div style={{ background: 'white', borderRadius: '24px', padding: '28px', marginBottom: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid rgba(124,58,237,0.08)', animation: 'fadeUp 0.5s ease 0.1s both' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 2, minWidth: '200px' }}>
            <label style={{ display: 'block', fontWeight: '700', color: '#374151', marginBottom: '8px', fontSize: '14px' }}>Subject *</label>
            <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Physics, Mathematics, Biology"
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', fontSize: '15px', boxSizing: 'border-box', border: '2px solid #e5e7eb', outline: 'none', fontFamily: 'inherit', background: '#fafbff' }}
              onFocus={e => e.target.style.borderColor = '#7c3aed'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
          </div>
          <div style={{ minWidth: '130px' }}>
            <label style={{ display: 'block', fontWeight: '700', color: '#374151', marginBottom: '8px', fontSize: '14px' }}>Questions</label>
            <select value={numQ} onChange={e => setNumQ(Number(e.target.value))}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', fontSize: '15px', border: '2px solid #e5e7eb', outline: 'none', fontFamily: 'inherit', background: '#fafbff', cursor: 'pointer' }}>
              {[3, 5, 10, 15, 20].map(n => <option key={n} value={n}>{n} Questions</option>)}
            </select>
          </div>
          <div style={{ minWidth: '130px' }}>
            <label style={{ display: 'block', fontWeight: '700', color: '#374151', marginBottom: '8px', fontSize: '14px' }}>Difficulty</label>
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', fontSize: '15px', border: '2px solid #e5e7eb', outline: 'none', fontFamily: 'inherit', background: '#fafbff', cursor: 'pointer' }}>
              <option value="easy">🟢 Easy</option>
              <option value="medium">🟡 Medium</option>
              <option value="hard">🔴 Hard</option>
            </select>
          </div>
          <button onClick={handleGenerate} disabled={loading} style={{
            background: loading ? '#e5e7eb' : 'linear-gradient(135deg, #7c3aed, #2563eb)',
            color: loading ? '#9ca3af' : 'white', border: 'none', padding: '12px 28px',
            borderRadius: '12px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '700', fontSize: '15px', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap',
          }}>
            {loading ? <><div style={{ width: '16px', height: '16px', border: '2px solid #9ca3af', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Generating...</> : '🚀 Generate Quiz'}
          </button>
        </div>
        {error && <div style={{ marginTop: '16px', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '12px', padding: '12px 16px', color: '#dc2626', fontSize: '14px' }}>⚠️ {error}</div>}
      </div>

      {submitted && (
        <div style={{
          borderRadius: '24px', padding: '36px', marginBottom: '24px', textAlign: 'center',
          background: scorePercent >= 70 ? 'linear-gradient(135deg, #dcfce7, #bbf7d0)' : 'linear-gradient(135deg, #fee2e2, #fecaca)',
          border: `2px solid ${scorePercent >= 70 ? '#86efac' : '#fca5a5'}`,
          animation: 'celebrate 0.6s ease',
        }}>
          <div style={{ fontSize: '56px', marginBottom: '12px' }}>{scorePercent >= 70 ? '🎉' : '📖'}</div>
          <h2 style={{ margin: '0 0 8px', fontSize: '32px', fontWeight: '800', color: scorePercent >= 70 ? '#15803d' : '#dc2626' }}>
            {scorePercent >= 70 ? 'Excellent Work!' : 'Keep Practicing!'}
          </h2>
          <p style={{ margin: '0 0 16px', fontSize: '20px', color: '#374151' }}>
            You scored <strong>{correct}/{questions.length}</strong> correctly
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: 'white', padding: '16px 32px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
            <span style={{ fontSize: '40px', fontWeight: '800', color: scorePercent >= 70 ? '#15803d' : '#dc2626' }}>{scorePercent}%</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '700', color: '#374151' }}>Score</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>{scorePercent >= 90 ? 'Outstanding!' : scorePercent >= 70 ? 'Good job!' : 'Room to improve'}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={handleTryAgain} style={{
              background: 'linear-gradient(135deg, #7c3aed, #2563eb)', color: 'white', border: 'none',
              padding: '14px 32px', borderRadius: '14px', fontSize: '16px', fontWeight: '700',
              cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 15px rgba(124,58,237,0.4)',
            }}>
              🔄 Try Again
            </button>
            <button onClick={() => { setSubject(''); handleTryAgain(); }} style={{
              background: 'white', color: '#7c3aed', border: '2px solid #7c3aed',
              padding: '14px 32px', borderRadius: '14px', fontSize: '16px', fontWeight: '700',
              cursor: 'pointer', fontFamily: 'inherit',
            }}>
              📝 New Quiz
            </button>
          </div>
        </div>
      )}

      {questions.map((q, i) => {
        const answered = answers[i];
        const isCorrect = answered === q.correctAnswer;
        return (
          <div key={i} style={{
            background: 'white', borderRadius: '20px', padding: '24px', marginBottom: '16px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
            borderLeft: submitted ? `5px solid ${isCorrect ? '#16a34a' : '#dc2626'}` : '5px solid #7c3aed',
            animation: `fadeUp 0.4s ease ${i * 0.05}s both`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <p style={{ fontWeight: '700', color: '#1e293b', margin: 0, fontSize: '16px', flex: 1, lineHeight: 1.5 }}>
                <span style={{ color: '#7c3aed', marginRight: '8px' }}>Q{i + 1}.</span>{q.question}
              </p>
              {submitted && <span style={{ fontSize: '24px', marginLeft: '12px' }}>{isCorrect ? '✅' : '❌'}</span>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {q.options.map((opt, j) => {
                let bg = '#f8fafc'; let border = '#e2e8f0'; let color = '#374151';
                if (submitted) {
                  if (opt === q.correctAnswer) { bg = '#dcfce7'; border = '#86efac'; color = '#15803d'; }
                  else if (opt === answered && !isCorrect) { bg = '#fee2e2'; border = '#fca5a5'; color = '#dc2626'; }
                } else if (answered === opt) { bg = '#ede9fe'; border = '#7c3aed'; color = '#6d28d9'; }
                return (
                  <button key={j} disabled={submitted} onClick={() => setAnswers(a => ({ ...a, [i]: opt }))}
                    style={{ background: bg, border: `2px solid ${border}`, borderRadius: '12px', padding: '12px 16px', textAlign: 'left', cursor: submitted ? 'default' : 'pointer', fontSize: '14px', color, fontWeight: answered === opt ? '700' : '400', fontFamily: 'inherit', lineHeight: 1.4 }}
                    onMouseOver={e => { if (!submitted) e.currentTarget.style.borderColor = '#7c3aed'; }}
                    onMouseOut={e => { if (!submitted && answered !== opt) e.currentTarget.style.borderColor = '#e2e8f0'; }}
                  >
                    <span style={{ color: '#9ca3af', marginRight: '8px' }}>{['A', 'B', 'C', 'D'][j]}.</span>
                    {opt}
                  </button>
                );
              })}
            </div>
            {submitted && (
              <div style={{ marginTop: '16px', background: '#f0f4ff', borderRadius: '12px', padding: '14px 18px', borderLeft: '4px solid #2563eb' }}>
                <span style={{ fontWeight: '700', color: '#1e40af' }}>💡 Explanation: </span>
                <span style={{ color: '#374151', fontSize: '14px' }}>{q.explanation}</span>
              </div>
            )}
          </div>
        );
      })}

      {questions.length > 0 && !submitted && (
        <button onClick={handleSubmit} style={{
          background: 'linear-gradient(135deg, #16a34a, #15803d)', color: 'white', border: 'none',
          padding: '16px', borderRadius: '16px', fontSize: '17px', fontWeight: '800',
          cursor: 'pointer', width: '100%', fontFamily: 'inherit',
          boxShadow: '0 4px 15px rgba(22,163,74,0.3)',
        }}>
          ✅ Submit Quiz ({Object.keys(answers).length}/{questions.length} answered)
        </button>
      )}
    </div>
  );
}