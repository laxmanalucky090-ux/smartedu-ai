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
        background: 'linear-gradient(135deg, #0f0c29, #302b63)',
        borderRadius: '24px', padding: '40px 48px', marginBottom: '32px',
        color: 'white', position: 'relative', overflow: 'hidden',
        animation: 'fadeUp 0.5s ease',
        border: '1px solid #2a2a45',
      }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(167,139,250,0.15)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', right: '100px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(96,165,250,0.1)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ margin: '0 0 8px', color: '#a78bfa', fontSize: '14px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase' }}>WELCOME BACK</p>
          <h1 style={{ margin: '0 0 12px', fontSize: '36px', fontWeight: '800' }}>Hello, {user.name}! 👋</h1>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.65)', fontSize: '16px' }}>Ready to continue your learning journey? Your AI mentor is waiting.</p>
        </div>
      </div>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: '#16162a', borderRadius: '16px', padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)', textAlign: 'center',
            animation: `fadeUp 0.5s ease ${i * 0.1}s both`,
            border: '1px solid #2a2a45',
          }}>
            <div style={{ fontSize: '32px', fontWeight: '800', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
            <div style={{ fontWeight: '700', color: '#f1f5f9', marginTop: '4px' }}>{s.label}</div>
            <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '2px' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* FEATURE CARDS */}
      <h2 style={{ fontWeight: '800', color: '#f1f5f9', marginBottom: '20px', fontSize: '22px' }}>What would you like to do?</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {cards.map((c, i) => (
          <div key={c.page} onClick={() => setPage(c.page)} style={{
            background: '#16162a', borderRadius: '20px', padding: '28px', cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)', transition: 'all 0.3s',
            border: '1px solid #2a2a45',
            animation: `fadeUp 0.5s ease ${0.2 + i * 0.1}s both`,
            display: 'flex', alignItems: 'flex-start', gap: '20px',
          }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(124,58,237,0.25)'; e.currentTarget.style.borderColor = '#3d3d5c'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)'; e.currentTarget.style.borderColor = '#2a2a45'; }}
          >
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px', background: c.gradient,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}>
              {c.icon}
            </div>
            <div>
              <h3 style={{ margin: '0 0 8px', color: '#f1f5f9', fontWeight: '700', fontSize: '18px' }}>{c.title}</h3>
              <p style={{ margin: '0 0 16px', color: '#94a3b8', fontSize: '14px', lineHeight: 1.6 }}>{c.desc}</p>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                background: 'rgba(124,58,237,0.15)',
                color: '#a78bfa', fontSize: '13px', fontWeight: '700',
                padding: '6px 14px', borderRadius: '20px',
                border: '1px solid rgba(124,58,237,0.25)',
              }}>
                Get Started →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}