export default function Dashboard({ setPage, user, progress }) {
  const cards = [
    { icon: '📚', title: 'Study Planner', desc: 'AI-generated personalized study plans for your exam', page: 'study', gradient: 'linear-gradient(135deg, #667eea, #764ba2)', glow: '124,58,237' },
    { icon: '📝', title: 'Quiz Generator', desc: 'Test your knowledge with adaptive AI quizzes', page: 'quiz', gradient: 'linear-gradient(135deg, #11998e, #38ef7d)', glow: '16,185,129' },
    { icon: '🤖', title: 'AI Mentor', desc: 'Get instant AI-powered answers to your doubts', page: 'mentor', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)', glow: '236,72,153' },
    { icon: '📊', title: 'Progress Tracker', desc: 'Track your study progress and performance', page: 'progress', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)', glow: '56,189,248' },
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
    <div style={{ fontFamily: "'Segoe UI', sans-serif", position: 'relative' }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulseGlow { 0%,100% { opacity:0.5; transform:scale(1); } 50% { opacity:0.8; transform:scale(1.08); } }
      `}</style>

      {/* AURORA BACKGROUND GLOWS */}
      <div style={{ position: 'fixed', top: '10%', left: '15%', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.18), transparent 70%)', filter: 'blur(40px)', zIndex: -1, pointerEvents: 'none', animation: 'pulseGlow 8s ease-in-out infinite' }} />
      <div style={{ position: 'fixed', top: '30%', right: '10%', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.15), transparent 70%)', filter: 'blur(40px)', zIndex: -1, pointerEvents: 'none', animation: 'pulseGlow 10s ease-in-out infinite 1s' }} />
      <div style={{ position: 'fixed', bottom: '5%', left: '40%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.12), transparent 70%)', filter: 'blur(40px)', zIndex: -1, pointerEvents: 'none', animation: 'pulseGlow 9s ease-in-out infinite 2s' }} />

      {/* HERO */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1340, #2d1f5c 50%, #1e1654)',
        borderRadius: '24px', padding: '40px 48px', marginBottom: '32px',
        color: 'white', position: 'relative', overflow: 'hidden',
        animation: 'fadeUp 0.5s ease',
        border: '1px solid #3d3d5c',
        boxShadow: '0 20px 60px rgba(124,58,237,0.25)',
      }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-40px', width: '240px', height: '240px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.35), transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-40px', right: '120px', width: '160px', height: '160px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(96,165,250,0.3), transparent 70%)' }} />
        <div style={{ position: 'absolute', top: '20px', left: '-30px', width: '140px', height: '140px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.25), transparent 70%)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ margin: '0 0 8px', color: '#c4b5fd', fontSize: '14px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase' }}>WELCOME BACK</p>
          <h1 style={{ margin: '0 0 12px', fontSize: '36px', fontWeight: '800' }}>Hello, {user.name}! 👋</h1>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '16px' }}>Ready to continue your learning journey? Your AI mentor is waiting.</p>
        </div>
      </div>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: 'linear-gradient(160deg, #1c1c33, #16162a)', borderRadius: '16px', padding: '24px',
            boxShadow: '0 8px 24px rgba(124,58,237,0.12), 0 2px 8px rgba(0,0,0,0.3)', textAlign: 'center',
            animation: `fadeUp 0.5s ease ${i * 0.1}s both`,
            border: '1px solid #2a2a45', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #7c3aed, #2563eb, #ec4899)' }} />
            <div style={{ fontSize: '32px', fontWeight: '800', background: 'linear-gradient(135deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
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
            background: 'linear-gradient(160deg, #1c1c33, #16162a)', borderRadius: '20px', padding: '28px', cursor: 'pointer',
            boxShadow: `0 8px 24px rgba(${c.glow},0.1), 0 2px 10px rgba(0,0,0,0.3)`, transition: 'all 0.3s',
            border: '1px solid #2a2a45',
            animation: `fadeUp 0.5s ease ${0.2 + i * 0.1}s both`,
            display: 'flex', alignItems: 'flex-start', gap: '20px',
            position: 'relative', overflow: 'hidden',
          }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 20px 45px rgba(${c.glow},0.3), 0 4px 16px rgba(0,0,0,0.4)`; e.currentTarget.style.borderColor = `rgba(${c.glow},0.4)`; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 8px 24px rgba(${c.glow},0.1), 0 2px 10px rgba(0,0,0,0.3)`; e.currentTarget.style.borderColor = '#2a2a45'; }}
          >
            <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '140px', height: '140px', borderRadius: '50%', background: `radial-gradient(circle, rgba(${c.glow},0.18), transparent 70%)`, pointerEvents: 'none' }} />
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px', background: c.gradient,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0,
              boxShadow: `0 6px 18px rgba(${c.glow},0.45)`, position: 'relative', zIndex: 1,
            }}>
              {c.icon}
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h3 style={{ margin: '0 0 8px', color: '#f1f5f9', fontWeight: '700', fontSize: '18px' }}>{c.title}</h3>
              <p style={{ margin: '0 0 16px', color: '#94a3b8', fontSize: '14px', lineHeight: 1.6 }}>{c.desc}</p>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                background: `rgba(${c.glow},0.15)`,
                color: '#e2e8f0', fontSize: '13px', fontWeight: '700',
                padding: '6px 14px', borderRadius: '20px',
                border: `1px solid rgba(${c.glow},0.3)`,
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