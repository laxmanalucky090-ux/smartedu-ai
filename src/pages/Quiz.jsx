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
    try { await saveQuizResult(subject, correct, questions.length, difficulty, questions, answers); } catch {}
  };

  const handleTryAgain = () => { setQuestions([]); setAnswers({}); setSubmitted(false); setError(''); };

  const correct = submitted ? questions.filter((q, i) => answers[i] === q.correctAnswer).length : 0;
  const scorePercent = submitted ? Math.round(correct / questions.length * 100) : 0;

  const diffConfig = {
    easy: { color: '#16a34a', bg: '#dcfce7', border: '#86efac', label: '🟢 Easy' },
    medium: { color: '#d97706', bg: '#fef3c7', border: '#fcd34d', label: '🟡 Medium' },
    hard: { color: '#dc2626', bg: '#fee2e2', border: '#fca5a5', label: '🔴 Hard' },
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", maxWidth: '900px', margin: '0 auto' }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes celebrate { 0%,100%{transform:scale(1)} 50%{transform:scale(1.03)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .option-btn:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 20px rgba(124,58,237,0.15) !important; }
      `}</style>

      {/* HEADER */}
      <div style={{ marginBottom: '28px', animation: 'fadeUp 0.4s ease' }}>
        <h2 style={{ margin: '0 0 4px', fontWeight: '800', fontSize: '30px', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>📝 Quiz Generator</h2>
        <p style={{ margin: 0, color: '#64748b', fontSize: '15px' }}>Test your knowledge with AI-generated adaptive questions</p>
      </div>

      {/* SETUP CARD */}
      <div style={{ background: 'white', borderRadius: '24px', padding: '32px', marginBottom: '24px', boxShadow: '0 4px 24px rgba(124,58,237,0.08)', border: '1px solid #ede9fe', animation: 'fadeUp 0.5s ease 0.1s both' }}>
        
        {/* SUBJECT INPUT */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontWeight: '700', color: '#1e293b', marginBottom: '10px', fontSize: '15px' }}>🎯 Subject or Topic *</label>
          <input value={subject} onChange={e => setSubject(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleGenerate()}
            placeholder="e.g. Physics, Organic Chemistry, World War II, Calculus..."
            style={{ width: '100%', padding: '14px 18px', borderRadius: '14px', fontSize: '15px', boxSizing: 'border-box', border: '2px solid #e2e8f0', outline: 'none', fontFamily: 'inherit', background: '#fafbff', color: '#1e293b', transition: 'all 0.2s' }}
            onFocus={e => { e.target.style.borderColor = '#7c3aed'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; }}
            onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
          />
        </div>

        {/* NUMBER OF QUESTIONS */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontWeight: '700', color: '#1e293b', marginBottom: '12px', fontSize: '15px' }}>📊 Number of Questions</label>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[3, 5, 10, 15, 20].map(n => (
              <button key={n} onClick={() => setNumQ(n)} style={{
                padding: '10px 22px', borderRadius: '12px', border: `2px solid ${numQ === n ? '#7c3aed' : '#e2e8f0'}`,
                background: numQ === n ? 'linear-gradient(135deg, #7c3aed, #2563eb)' : 'white',
                color: numQ === n ? 'white' : '#64748b',
                fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.2s',
                boxShadow: numQ === n ? '0 4px 12px rgba(124,58,237,0.3)' : 'none',
                transform: numQ === n ? 'translateY(-2px)' : 'translateY(0)',
              }}>{n} Qs</button>
            ))}
          </div>
        </div>

        {/* DIFFICULTY */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'block', fontWeight: '700', color: '#1e293b', marginBottom: '12px', fontSize: '15px' }}>⚡ Difficulty Level</label>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {Object.entries(diffConfig).map(([key, val]) => (
              <button key={key} onClick={() => setDifficulty(key)} style={{
                padding: '12px 24px', borderRadius: '14px',
                border: `2px solid ${difficulty === key ? val.color : '#e2e8f0'}`,
                background: difficulty === key ? val.bg : 'white',
                color: difficulty === key ? val.color : '#64748b',
                fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.2s',
                boxShadow: difficulty === key ? `0 4px 12px ${val.border}` : 'none',
                transform: difficulty === key ? 'translateY(-2px)' : 'translateY(0)',
              }}>{val.label}</button>
            ))}
          </div>
        </div>

        {error && (
          <div style={{ marginBottom: '20px', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '12px', padding: '12px 16px', color: '#e11d48', fontSize: '14px' }}>
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
            <><div style={{ width: '20px', height: '20px', border: '3px solid #94a3b8', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Generating your quiz...</>
          ) : '🚀 Generate Quiz'}
        </button>
      </div>

      {/* SCORE CARD */}
      {submitted && (
        <div style={{
          borderRadius: '24px', padding: '40px', marginBottom: '24px', textAlign: 'center',
          background: scorePercent >= 70 ? 'linear-gradient(135deg, #f0fdf4, #dcfce7)' : 'linear-gradient(135deg, #fff7f7, #fee2e2)',
          border: `2px solid ${scorePercent >= 70 ? '#86efac' : '#fca5a5'}`,
          boxShadow: `0 8px 32px ${scorePercent >= 70 ? 'rgba(22,163,74,0.15)' : 'rgba(220,38,38,0.15)'}`,
          animation: 'celebrate 0.6s ease',
        }}>
          <div style={{ fontSize: '64px', marginBottom: '12px' }}>{scorePercent >= 90 ? '🏆' : scorePercent >= 70 ? '🎉' : scorePercent >= 50 ? '📖' : '💪'}</div>
          <h2 style={{ margin: '0 0 8px', fontSize: '32px', fontWeight: '800', color: scorePercent >= 70 ? '#15803d' : '#dc2626' }}>
            {scorePercent >= 90 ? 'Outstanding!' : scorePercent >= 70 ? 'Excellent Work!' : scorePercent >= 50 ? 'Good Effort!' : 'Keep Practicing!'}
          </h2>
          <p style={{ margin: '0 0 20px', fontSize: '18px', color: '#374151' }}>
            You got <strong>{correct}</strong> out of <strong>{questions.length}</strong> questions correct
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', background: 'white', padding: '20px 36px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '24px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', fontWeight: '800', color: scorePercent >= 70 ? '#15803d' : '#dc2626', lineHeight: 1 }}>{scorePercent}%</div>
              <div style={{ color: '#64748b', fontSize: '13px', fontWeight: '600', marginTop: '4px' }}>Final Score</div>
            </div>
            <div style={{ width: '1px', height: '50px', background: '#e2e8f0' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#7c3aed', lineHeight: 1 }}>{correct}/{questions.length}</div>
              <div style={{ color: '#64748b', fontSize: '13px', fontWeight: '600', marginTop: '4px' }}>Correct</div>
            </div>
            <div style={{ width: '1px', height: '50px', background: '#e2e8f0' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: '800', color: diffConfig[difficulty].color, lineHeight: 1 }}>{diffConfig[difficulty].label}</div>
              <div style={{ color: '#64748b', fontSize: '13px', fontWeight: '600', marginTop: '4px' }}>Difficulty</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={handleTryAgain} style={{
              background: 'linear-gradient(135deg, #7c3aed, #2563eb)', color: 'white', border: 'none',
              padding: '14px 32px', borderRadius: '14px', fontSize: '15px', fontWeight: '700',
              cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 15px rgba(124,58,237,0.4)',
              transition: 'all 0.2s',
            }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >🔄 Try Same Topic</button>
            <button onClick={() => { setSubject(''); handleTryAgain(); }} style={{
              background: 'white', color: '#7c3aed', border: '2px solid #7c3aed',
              padding: '14px 32px', borderRadius: '14px', fontSize: '15px', fontWeight: '700',
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
            }}
              onMouseOver={e => { e.currentTarget.style.background = '#f5f3ff'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'white'; }}
            >📝 New Topic</button>
          </div>
        </div>
      )}

      {/* QUESTIONS */}
      {questions.map((q, i) => {
        const answered = answers[i];
        const isCorrect = answered === q.correctAnswer;
        return (
          <div key={i} style={{
            background: 'white', borderRadius: '20px', padding: '28px', marginBottom: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            border: submitted ? `2px solid ${isCorrect ? '#86efac' : '#fca5a5'}` : '2px solid #ede9fe',
            animation: `fadeUp 0.4s ease ${i * 0.05}s both`,
            transition: 'all 0.3s',
          }}>
            {/* QUESTION HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
                  background: submitted ? (isCorrect ? 'linear-gradient(135deg, #16a34a, #15803d)' : 'linear-gradient(135deg, #dc2626, #b91c1c)') : 'linear-gradient(135deg, #7c3aed, #2563eb)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: '800', fontSize: '13px',
                }}>Q{i + 1}</div>
                <p style={{ fontWeight: '700', color: '#1e293b', margin: 0, fontSize: '16px', lineHeight: 1.6 }}>{q.question}</p>
              </div>
              {submitted && <span style={{ fontSize: '28px', marginLeft: '12px', flexShrink: 0 }}>{isCorrect ? '✅' : '❌'}</span>}
            </div>

            {/* OPTIONS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {q.options.map((opt, j) => {
                let bg = '#f8fafc', border = '#e2e8f0', color = '#374151', shadow = 'none';
                if (submitted) {
                  if (opt === q.correctAnswer) { bg = '#dcfce7'; border = '#16a34a'; color = '#15803d'; shadow = '0 4px 12px rgba(22,163,74,0.2)'; }
                  else if (opt === answered && !isCorrect) { bg = '#fee2e2'; border = '#dc2626'; color = '#dc2626'; }
                } else if (answered === opt) { bg = '#ede9fe'; border = '#7c3aed'; color = '#6d28d9'; shadow = '0 4px 12px rgba(124,58,237,0.2)'; }
                return (
                  <button key={j} className={submitted ? '' : 'option-btn'} disabled={submitted}
                    onClick={() => setAnswers(a => ({ ...a, [i]: opt }))}
                    style={{
                      background: bg, border: `2px solid ${border}`, borderRadius: '14px',
                      padding: '14px 18px', textAlign: 'left', cursor: submitted ? 'default' : 'pointer',
                      fontSize: '14px', color, fontWeight: answered === opt || opt === q.correctAnswer ? '700' : '500',
                      fontFamily: 'inherit', lineHeight: 1.5, transition: 'all 0.2s', boxShadow: shadow,
                    }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: '24px', height: '24px', borderRadius: '8px', marginRight: '10px',
                      background: answered === opt || (submitted && opt === q.correctAnswer) ? 'rgba(124,58,237,0.15)' : '#f1f5f9',
                      color: '#7c3aed', fontWeight: '800', fontSize: '12px', flexShrink: 0,
                    }}>{['A', 'B', 'C', 'D'][j]}</span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* EXPLANATION */}
            {submitted && (
              <div style={{ marginTop: '18px', background: 'linear-gradient(135deg, #f0f4ff, #f5f3ff)', borderRadius: '14px', padding: '16px 20px', borderLeft: '4px solid #7c3aed' }}>
                <span style={{ fontWeight: '700', color: '#7c3aed', fontSize: '14px' }}>💡 Explanation: </span>
                <span style={{ color: '#374151', fontSize: '14px', lineHeight: 1.6 }}>{q.explanation}</span>
              </div>
            )}
          </div>
        );
      })}

      {/* SUBMIT BUTTON */}
      {questions.length > 0 && !submitted && (
        <div style={{ position: 'sticky', bottom: '20px', animation: 'fadeUp 0.4s ease' }}>
          <button onClick={handleSubmit} style={{
            background: 'linear-gradient(135deg, #16a34a, #15803d)', color: 'white', border: 'none',
            padding: '18px', borderRadius: '18px', fontSize: '17px', fontWeight: '800',
            cursor: 'pointer', width: '100%', fontFamily: 'inherit',
            boxShadow: '0 8px 24px rgba(22,163,74,0.4)',
            transition: 'all 0.3s',
          }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(22,163,74,0.5)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(22,163,74,0.4)'; }}
          >
            ✅ Submit Quiz ({Object.keys(answers).length}/{questions.length} answered)
          </button>
        </div>
      )}
    </div>
  );
}