const COLORS = {
  bg: '#0A0A0A',
  card: '#111111',
  border: 'rgba(255,255,255,0.08)',
  accent: '#D7FF3E',
  accentDark: '#A8E000',
  text: '#FFFFFF',
  textMuted: '#A1A1AA',
};

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
    <div>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .dash-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; }
        .dash-cards-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        @media (max-width: 700px) {
          .dash-stats-grid { grid-template-columns: 1fr 1fr; }
          .dash-cards-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 420px) {
          .dash-stats-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* HERO */}
      <div style={{
        background: 'linear-gradient(135deg, #0A0A0A, #151507)',
        borderRadius: '24px', padding: '40px 48px', marginBottom: '32px',
        color: 'white', position: 'relative', overflow: 'hidden',
        animation: 'fadeUp 0.5s ease', border: `1px solid ${COLORS.border}`,
      }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(215,255,62,0.1)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', right: '100px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(215,255,62,0.06)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ margin: '0 0 8px', color: COLORS.accent, fontSize: '14px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase' }}>WELCOME BACK</p>
          <h1 style={{ margin: '0 0 12px', fontSize: '36px', fontWeight: '800' }}>Hello, {user.name}! 👋</h1>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.65)', fontSize: '16px' }}>Ready to continue your learning journey? Your AI mentor is waiting.</p>
        </div>
      </div>

      {/* STATS */}
      <div className="dash-stats-grid">
        {stats.map((s, i) => (
          <div key={i} style={{
            background: COLORS.card, borderRadius: '16px', padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)', textAlign: 'center',
            animation: `fadeUp 0.5s ease ${i * 0.1}s both`,
            border: `1px solid ${COLORS.border}`,
          }}>
            <div style={{ fontSize: '32px', fontWeight: '800', background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
            <div style={{ fontWeight: '700', color: COLORS.text, marginTop: '4px' }}>{s.label}</div>
            <div style={{ color: COLORS.textMuted, fontSize: '13px', marginTop: '2px' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* FEATURE CARDS */}
      <h2 style={{ fontWeight: '800', color: COLORS.text, marginBottom: '20px', fontSize: '22px' }}>What would you like to do?</h2>
      <div className="dash-cards-grid">
        {cards.map((c, i) => (
          <div key={c.page} onClick={() => setPage(c.page)} style={{
            background: COLORS.card, borderRadius: '20px', padding: '28px', cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)', transition: 'all 0.3s',
            border: `1px solid ${COLORS.border}`,
            animation: `fadeUp 0.5s ease ${0.2 + i * 0.1}s both`,
            display: 'flex', alignItems: 'flex-start', gap: '20px',
          }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(215,255,62,0.12)'; e.currentTarget.style.borderColor = 'rgba(215,255,62,0.3)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)'; e.currentTarget.style.borderColor = COLORS.border; }}
          >
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px', background: c.gradient,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0,
            }}>
              {c.icon}
            </div>
            <div>
              <h3 style={{ margin: '0 0 8px', color: COLORS.text, fontWeight: '700', fontSize: '18px' }}>{c.title}</h3>
              <p style={{ margin: '0 0 16px', color: COLORS.textMuted, fontSize: '14px', lineHeight: 1.6 }}>{c.desc}</p>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                background: 'rgba(215,255,62,0.1)',
                color: COLORS.accent, fontSize: '13px', fontWeight: '700',
                padding: '6px 14px', borderRadius: '20px',
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