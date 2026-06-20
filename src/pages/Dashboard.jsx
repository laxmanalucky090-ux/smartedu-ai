export default function Dashboard({ setPage, user, progress }) {
  const cards = [
    { icon: '📚', title: 'Study Planner', desc: 'AI-generated personalized study plans for your exam', page: 'study', gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
    { icon: '📝', title: 'Quiz Generator', desc: 'Test your knowledge with adaptive AI quizzes', page: 'quiz', gradient: 'linear-gradient(135deg, #11998e, #38ef7d)' },
    { icon: '🤖', title: 'AI Mentor', desc: 'Get instant AI-powered answers to your doubts', page: 'mentor', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)' },
    { icon: '📊', title: 'Progress Tracker', desc: 'Track your study progress and performance', page: 'progress', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
  ];

  const avgScore = progress.quizScores.length > 0
    ? Math.round(progress.quizScores.reduce((a, b) => a + b, 0) / progress.quizScores.length)
    : null;

  const stats = [
    { label: 'Study Plan', value: progress.studyPlanGenerated ? '✅' : '—', sub: progress.studyPlanGenerated ? 'Generated' : 'Not yet' },
    { label: 'Quizzes Done', value: progress.quizzesCompleted, sub: 'completed' },
    { label: 'Avg Score', value: avgScore ? avgScore + '%' : '—', sub: avgScore ? (avgScore >= 70 ? 'Excellent!' : 'Keep going') : 'No quizzes yet' },
  ];

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* HERO */}
      <div style={{
        background: '#16162a',
        borderRadius: '20px', padding: '36px 44px', marginBottom: '28px',
        color: 'white', border: '1px solid #2a2a45',
        animation: 'fadeUp 0.4s ease',
      }}>
        <p style={{ margin: '0 0 8px', color: '#a78bfa', fontSize: '13px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase' }}>WELCOME BACK</p>
        <h1 style={{ margin: '0 0 10px', fontSize: '32px', fontWeight: '800', color: '#f1f5f9' }}>Hello, {user.name}! 👋</h1>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '15px' }}>Ready to continue your learning journey? Your AI mentor is waiting.</p>
      </div>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: '#16162a', borderRadius: '14px', padding: '22px',
            textAlign: 'center', border: '1px solid #2a2a45',
            animation: `fadeUp 0.4s ease ${i * 0.08}s both`,
          }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#f1f5f9' }}>{s.value}</div>
            <div style={{ fontWeight: '600', color: '#cbd5e1', marginTop: '4px', fontSize: '14px' }}>{s.label}</div>
            <div style={{ color: '#64748b', fontSize: '12px', marginTop: '2px' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* FEATURE CARDS */}
      <h2 style={{ fontWeight: '700', color: '#f1f5f9', marginBottom: '16px', fontSize: '19px' }}>What would you like to do?</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {cards.map((c, i) => (
          <div key={c.page} onClick={() => setPage(c.page)} style={{
            background: '#16162a', borderRadius: '16px', padding: '24px', cursor: 'pointer',
            border: '1px solid #2a2a45', transition: 'border-color 0.2s, background 0.2s',
            animation: `fadeUp 0.4s ease ${0.15 + i * 0.08}s both`,
            display: 'flex', alignItems: 'flex-start', gap: '16px',
          }}
            onMouseOver={e => { e.currentTarget.style.borderColor = '#3d3d5c'; e.currentTarget.style.background = '#1c1c33'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = '#2a2a45'; e.currentTarget.style.background = '#16162a'; }}
          >
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px', background: c.gradient,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0,
            }}>
              {c.icon}
            </div>
            <div>
              <h3 style={{ margin: '0 0 6px', color: '#f1f5f9', fontWeight: '700', fontSize: '16px' }}>{c.title}</h3>
              <p style={{ margin: '0 0 12px', color: '#94a3b8', fontSize: '13px', lineHeight: 1.5 }}>{c.desc}</p>
              <span style={{ color: '#a78bfa', fontSize: '13px', fontWeight: '600' }}>Get Started →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}