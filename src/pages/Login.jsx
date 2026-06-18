import { useState, useEffect } from 'react';

export default function LoginPage({ onLogin }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleLogin = () => {
    if (!name.trim()) return setError('Please enter your name');
    if (!password.trim()) return setError('Please enter a password');
    onLogin({ name: name.trim() });
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', fontFamily: "'Segoe UI', sans-serif", overflow: 'hidden',
    }}>
      {/* LEFT PANEL */}
      <div style={{
        flex: 1, background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start',
        padding: '60px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Animated background circles */}
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: `${120 + i * 80}px`, height: `${120 + i * 80}px`,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.05)',
            top: `${10 + i * 12}%`, left: `${-5 + i * 8}%`,
            animation: `pulse ${3 + i}s ease-in-out infinite alternate`,
          }} />
        ))}
        <style>{`
          @keyframes pulse { from { transform: scale(1); opacity: 0.3; } to { transform: scale(1.05); opacity: 0.1; } }
          @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        `}</style>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '500px', opacity: mounted ? 1 : 0, transition: 'opacity 0.8s ease' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px', animation: 'float 3s ease-in-out infinite' }}>🎓</div>
          <div style={{ color: '#a78bfa', fontSize: '13px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>
            AI-POWERED LEARNING
          </div>
          <h1 style={{ color: 'white', fontSize: '52px', fontWeight: '800', lineHeight: 1.1, marginBottom: '24px', margin: '0 0 24px' }}>
            Learn Smarter,<br />
            <span style={{ background: 'linear-gradient(90deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Not Harder.
            </span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px', lineHeight: 1.7, marginBottom: '48px' }}>
            Your personalized AI mentor that adapts to your learning style, generates custom study plans, and helps you ace every exam.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { icon: '📚', text: 'Personalized Study Plans for JEE, NEET & more' },
              { icon: '🧠', text: 'AI Mentor available 24/7 to solve your doubts' },
              { icon: '📝', text: 'Smart quizzes that adapt to your weak areas' },
              { icon: '📊', text: 'Real-time progress tracking & analytics' },
            ].map((f, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                animation: `fadeUp 0.6s ease ${0.2 + i * 0.1}s both`,
              }}>
                <div style={{ fontSize: '24px', width: '44px', height: '44px', background: 'rgba(167,139,250,0.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{f.icon}</div>
                <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '15px' }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{
        width: '480px', background: '#ffffff', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '60px 48px', boxShadow: '-20px 0 60px rgba(0,0,0,0.15)',
      }}>
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#0f0c29', margin: '0 0 8px' }}>Welcome back 👋</h2>
          <p style={{ color: '#64748b', fontSize: '16px', margin: 0 }}>Sign in to continue your learning journey</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px', fontSize: '14px' }}>Your Name</label>
            <input
              value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. Laxman"
              style={{
                width: '100%', padding: '14px 16px', borderRadius: '12px', fontSize: '16px', boxSizing: 'border-box',
                border: '2px solid #e5e7eb', outline: 'none', transition: 'border-color 0.2s',
                fontFamily: 'inherit',
              }}
              onFocus={e => e.target.style.borderColor = '#7c3aed'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px', fontSize: '14px' }}>Password</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Enter any password"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{
                width: '100%', padding: '14px 16px', borderRadius: '12px', fontSize: '16px', boxSizing: 'border-box',
                border: '2px solid #e5e7eb', outline: 'none', transition: 'border-color 0.2s',
                fontFamily: 'inherit',
              }}
              onFocus={e => e.target.style.borderColor = '#7c3aed'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '12px 16px', color: '#dc2626', fontSize: '14px' }}>
              ⚠️ {error}
            </div>
          )}

          <button onClick={handleLogin} style={{
            background: 'linear-gradient(135deg, #7c3aed, #2563eb)', color: 'white', border: 'none',
            padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s', letterSpacing: '0.5px',
          }}
            onMouseOver={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 25px rgba(124,58,237,0.4)'; }}
            onMouseOut={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}
          >
            Start Learning →
          </button>
        </div>

        <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '13px', marginTop: '24px' }}>
          Enter any name and password to continue
        </p>

        <div style={{ marginTop: '48px', padding: '20px', background: '#f8faff', borderRadius: '12px', border: '1px solid #e0e7ff' }}>
          <p style={{ margin: '0 0 8px', fontWeight: '700', color: '#4338ca', fontSize: '14px' }}>🚀 Trusted by students</p>
          <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Join thousands of students preparing for JEE, NEET, GATE and more with AI-powered guidance.</p>
        </div>
      </div>
    </div>
  );
}
