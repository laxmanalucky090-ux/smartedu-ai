import { useState } from 'react';
import { generateQuiz, saveQuizResult } from '../utils/gemini';

const COLORS = {
  card: '#111111',
  cardAlt: '#181818',
  border: 'rgba(255,255,255,0.08)',
  accent: '#D7FF3E',
  accentDark: '#A8E000',
  text: '#FFFFFF',
  textMuted: '#A1A1AA',
  error: '#F87171',
  errorBg: 'rgba(248,113,113,0.1)',
  errorBorder: 'rgba(248,113,113,0.35)',
};

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
      if (qs.length < numQ) {
        setError(`Heads up: you asked for ${numQ} questions but only ${qs.length} were generated. You can still take the quiz below.`);
      }
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
    easy: { color: '#4ADE80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.35)', label: '🟢 Easy' },
    medium: { color: '#FBBF24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.35)', label: '🟡 Medium' },
    hard: { color: '#F87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.35)', label: '🔴 Hard' },
  };

  const focusAccent = (e) => { e.target.style.borderColor = COLORS.accent; e.target.style.boxShadow = '0 0 0 3px rgba(215,255,62,0.15)'; };
  const blurAccent = (e) => { e.target.style.borderColor = COLORS.border; e.target.style.boxShadow = 'none'; };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", maxWidth: '900px', margin: '0 auto' }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes celebrate { 0%,100%{transform:scale(1)} 50%{transform:scale(1.03)} }
        .option-btn:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 20px rgba(215,255,62,0.1) !important; }
        .quiz-options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .quiz-score-row { display: inline-flex; align-items: center; gap: 16px; flex-wrap: wrap; justify-content: center; }
        @media (max-width: 560px) {
          .quiz-options-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* HEADER */}
      <div style={{ marginBottom: '28px', animation: 'fadeUp 0.4s ease' }}>
        <h2 style={{ margin: '0 0 4px', fontWeight: '800', fontSize: '28px', background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>📝 Quiz Generator</h2>
        <p style={{ margin: 0, color: COLORS.textMuted, fontSize: '15px' }}>Test your knowledge with AI-generated adaptive questions</p>
      </div>

      {/* SETUP CARD */}
      <div style={{ background: COLORS.card, borderRadius: '24px', padding: '32px', marginBottom: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.3)', border: `1px solid ${COLORS.border}`, animation: 'fadeUp 0.5s ease 0.1s both' }}>

        {/* SUBJECT INPUT */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontWeight: '700', color: COLORS.text, marginBottom: '10px', fontSize: '15px' }}>🎯 Subject or Topic *</label>
          <input value={subject} onChange={e => setSubject(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleGenerate()}
            placeholder="e.g. Physics, Organic Chemistry, World War II, Calculus..."
            style={{ width: '100%', padding: '14px 18px', borderRadius: '14px', fontSize: '15px', boxSizing: 'border-box', border: `2px solid ${COLORS.border}`, outline: 'none', fontFamily: 'inherit', background: COLORS.cardAlt, color: COLORS.text, transition: 'all 0.2s' }}
            onFocus={focusAccent} onBlur={blurAccent}
          />
        </div>

        {/* NUMBER OF QUESTIONS */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontWeight: '700', color: COLORS.text, marginBottom: '12px', fontSize: '15px' }}>📊 Number of Questions</label>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[3, 5, 10, 15, 20].map(n => (
              <button key={n} onClick={() => setNumQ(n)} style={{
                padding: '10px 22px', borderRadius: '12px', border: `2px solid ${numQ === n ? COLORS.accent : COLORS.border}`,
                background: numQ === n ? `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})` : COLORS.cardAlt,
                color: numQ === n ? '#0A0A0A' : COLORS.textMuted,
                fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.2s',
                boxShadow: numQ === n ? '0 4px 12px rgba(215,255,62,0.3)' : 'none',
                transform: numQ === n ? 'translateY(-2px)' : 'translateY(0)',
              }}>{n} Qs</button>
            ))}
          </div>
        </div>

        {/* DIFFICULTY */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'block', fontWeight: '700', color: COLORS.text, marginBottom: '12px', fontSize: '15px' }}>⚡ Difficulty Level</label>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {Object.entries(diffConfig).map(([key, val]) => (
              <button key={key} onClick={() => setDifficulty(key)} style={{
                padding: '12px 24px', borderRadius: '14px',
                border: `2px solid ${difficulty === key ? val.color : COLORS.border}`,
                background: difficulty === key ? val.bg : COLORS.cardAlt,
                color: difficulty === key ? val.color : COLORS.textMuted,
                fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.2s',
                boxShadow: difficulty === key ? `0 4px 12px ${val.border}` : 'none',
                transform: difficulty === key ? 'translateY(-2px)' : 'translateY(0)',
              }}>{val.label}</button>
            ))}
          </div>
        </div>

        {error && (
          <div style={{ marginBottom: '20px', background: COLORS.errorBg, border: `1px solid ${COLORS.errorBorder}`, borderRadius: '12px', padding: '12px 16px', color: COLORS.error, fontSize: '14px' }}>
            ⚠️ {error}
          </div>
        )}

        <button onClick={handleGenerate} disabled={loading} style={{
          width: '100%', background: loading ? '#2A2A2A' : `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`,
          color: loading ? '#6B7280' : '#0A0A0A', border: 'none', padding: '16px',
          borderRadius: '14px', fontSize: '17px', fontWeight: '800', cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
          boxShadow: loading ? 'none' : '0 8px 24px rgba(215,255,62,0.3)',
        }}
          onMouseOver={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; } }}
          onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          {loading ? (
            <><div style={{ width: '20px', height: '20px', border: '3px solid #6B7280', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Generating your quiz...</>
          ) : '🚀 Generate Quiz'}
        </button>
      </div>

      {/* SCORE CARD */}
      {submitted && (
        <div style={{
          borderRadius: '24px', padding: '40px', marginBottom: '24px', textAlign: 'center',
          background: scorePercent >= 70 ? 'rgba(74,222,128,0.06)' : 'rgba(248,113,165,0.06)',
          border: `2px solid ${scorePercent >= 70 ? 'rgba(74,222,128,0.35)' : 'rgba(248,113,113,0.35)'}`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.3)`,
          animation: 'celebrate 0.6s ease',
        }}>
          <div style={{ fontSize: '64px', marginBottom: '12px' }}>{scorePercent >= 90 ? '🏆' : scorePercent >= 70 ? '🎉' : scorePercent >= 50 ? '📖' : '💪'}</div>
          <h2 style={{ margin: '0 0 8px', fontSize: '32px', fontWeight: '800', color: scorePercent >= 70 ? '#4ADE80' : '#F87171' }}>
            {scorePercent >= 90 ? 'Outstanding!' : scorePercent >= 70 ? 'Excellent Work!' : scorePercent >= 50 ? 'Good Effort!' : 'Keep Practicing!'}
          </h2>
          <p style={{ margin: '0 0 20px', fontSize: '18px', color: '#D1D5DB' }}>
            You got <strong>{correct}</strong> out of <strong>{questions.length}</strong> questions correct
          </p>
          <div className="quiz-score-row" style={{ background: COLORS.cardAlt, padding: '20px 36px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', marginBottom: '24px', border: `1px solid ${COLORS.border}` }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', fontWeight: '800', color: scorePercent >= 70 ? '#4ADE80' : '#F87171', lineHeight: 1 }}>{scorePercent}%</div>
              <div style={{ color: COLORS.textMuted, fontSize: '13px', fontWeight: '600', marginTop: '4px' }}>Final Score</div>
            </div>
            <div style={{ width: '1px', height: '50px', background: COLORS.border }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: '800', color: COLORS.accent, lineHeight: 1 }}>{correct}/{questions.length}</div>
              <div style={{ color: COLORS.textMuted, fontSize: '13px', fontWeight: '600', marginTop: '4px' }}>Correct</div>
            </div>
            <div style={{ width: '1px', height: '50px', background: COLORS.border }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: '800', color: diffConfig[difficulty].color, lineHeight: 1 }}>{diffConfig[difficulty].label}</div>
              <div style={{ color: COLORS.textMuted, fontSize: '13px', fontWeight: '600', marginTop: '4px' }}>Difficulty</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={handleTryAgain} style={{
              background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`, color: '#0A0A0A', border: 'none',
              padding: '14px 32px', borderRadius: '14px', fontSize: '15px', fontWeight: '700',
              cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 15px rgba(215,255,62,0.3)',
              transition: 'all 0.2s',
            }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >🔄 Try Same Topic</button>
            <button onClick={() => { setSubject(''); handleTryAgain(); }} style={{
              background: 'transparent', color: COLORS.accent, border: `2px solid ${COLORS.accent}`,
              padding: '14px 32px', borderRadius: '14px', fontSize: '15px', fontWeight: '700',
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
            }}
              onMouseOver={e => { e.currentTarget.style.background = 'rgba(215,255,62,0.08)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}
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
            background: COLORS.card, borderRadius: '20px', padding: '28px', marginBottom: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            border: submitted ? `2px solid ${isCorrect ? 'rgba(74,222,128,0.4)' : 'rgba(248,113,113,0.4)'}` : `2px solid ${COLORS.border}`,
            animation: `fadeUp 0.4s ease ${i * 0.05}s both`,
            transition: 'all 0.3s',
          }}>
            {/* QUESTION HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
                  background: submitted ? (isCorrect ? 'linear-gradient(135deg, #4ADE80, #16a34a)' : 'linear-gradient(135deg, #F87171, #dc2626)') : `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: submitted ? 'white' : '#0A0A0A', fontWeight: '800', fontSize: '13px',
                }}>Q{i + 1}</div>
                <p style={{ fontWeight: '700', color: COLORS.text, margin: 0, fontSize: '16px', lineHeight: 1.6 }}>{q.question}</p>
              </div>
              {submitted && <span style={{ fontSize: '28px', marginLeft: '12px', flexShrink: 0 }}>{isCorrect ? '✅' : '❌'}</span>}
            </div>

            {/* OPTIONS */}
            <div className="quiz-options-grid">
              {q.options.map((opt, j) => {
                let bg = COLORS.cardAlt, border = COLORS.border, color = '#D1D5DB', shadow = 'none';
                if (submitted) {
                  if (opt === q.correctAnswer) { bg = 'rgba(74,222,128,0.1)'; border = '#4ADE80'; color = '#4ADE80'; shadow = '0 4px 12px rgba(74,222,128,0.15)'; }
                  else if (opt === answered && !isCorrect) { bg = 'rgba(248,113,113,0.1)'; border = '#F87171'; color = '#F87171'; }
                } else if (answered === opt) { bg = 'rgba(215,255,62,0.1)'; border = COLORS.accent; color = COLORS.accent; shadow = '0 4px 12px rgba(215,255,62,0.15)'; }
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
                      background: answered === opt || (submitted && opt === q.correctAnswer) ? 'rgba(215,255,62,0.15)' : 'rgba(255,255,255,0.06)',
                      color: COLORS.accent, fontWeight: '800', fontSize: '12px', flexShrink: 0,
                    }}>{['A', 'B', 'C', 'D'][j]}</span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* EXPLANATION */}
            {submitted && (
              <div style={{ marginTop: '18px', background: 'rgba(215,255,62,0.05)', borderRadius: '14px', padding: '16px 20px', borderLeft: `4px solid ${COLORS.accent}` }}>
                <span style={{ fontWeight: '700', color: COLORS.accent, fontSize: '14px' }}>💡 Explanation: </span>
                <span style={{ color: '#D1D5DB', fontSize: '14px', lineHeight: 1.6 }}>{q.explanation}</span>
              </div>
            )}
          </div>
        );
      })}

      {/* SUBMIT BUTTON */}
      {questions.length > 0 && !submitted && (
        <div style={{ position: 'sticky', bottom: '20px', animation: 'fadeUp 0.4s ease' }}>
          <button onClick={handleSubmit} style={{
            background: 'linear-gradient(135deg, #4ADE80, #16a34a)', color: '#0A0A0A', border: 'none',
            padding: '18px', borderRadius: '18px', fontSize: '17px', fontWeight: '800',
            cursor: 'pointer', width: '100%', fontFamily: 'inherit',
            boxShadow: '0 8px 24px rgba(74,222,128,0.3)',
            transition: 'all 0.3s',
          }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            ✅ Submit Quiz ({Object.keys(answers).length}/{questions.length} answered)
          </button>
        </div>
      )}
    </div>
  );
}