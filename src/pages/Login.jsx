import { useState, useEffect } from 'react';
import { loginUser, registerUser } from '../utils/gemini';

export default function LoginPage({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async () => {
    setError('');
    if (!email || !password) return setError('Please fill all fields');
    if (isRegister && !name) return setError('Please enter your name');
    setLoading(true);
    try {
      const user = isRegister
        ? await registerUser(name, email, password)
        : await loginUser(email, password);
      onLogin(user);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Try again.');
    }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%', padding: '14px 16px', borderRadius: '12px', fontSize: '15px',
    boxSizing: 'border-box', border: '2px solid #e5e7eb', outline: 'none',
    fontFamily: 'inherit', color: '#1e293b', background: 'white', transition: 'all 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif", background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>

      {isMobile ? (
        /* MOBILE LAYOUT */
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '0' }}>
          {/* MOBILE HEADER */}
          <div style={{ padding: '40px 24px 32px', textAlign: 'center', animation: 'fadeUp 0.5s ease' }}>
            <div style={{ fontSize: '56px', marginBottom: '12px', animation: 'float 3s ease-in-out infinite' }}>🎓</div>
            <h1 style={{ color: 'white', fontSize: '28px', fontWeight: '800', margin: '0 0 8px', lineHeight: 1.2 }}>
              SmartEdu AI
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: 0 }}>
              Your AI-powered study companion
            </p>
          </div>

          {/* MOBILE FORM CARD */}
          <div style={{
            flex: 1, background: 'white', borderRadius: '28px 28px 0 0',
            padding: '32px 24px 40px', animation: 'fadeUp 0.5s ease 0.1s both',
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f0c29', margin: '0 0 6px' }}>
              {isRegister ? 'Create Account 🚀' : 'Welcome back 👋'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 24px' }}>
              {isRegister ? 'Join thousands of students learning smarter' : 'Sign in to continue your journey'}
            </p>

            {/* TOGGLE */}
            <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '12px', padding: '4px', marginBottom: '24px' }}>
              {['Login', 'Register'].map((t, i) => (
                <button key={t} onClick={() => { setIsRegister(i === 1); setError(''); }} style={{
                  flex: 1, padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                  fontWeight: '700', fontSize: '14px', fontFamily: 'inherit', transition: 'all 0.2s',
                  background: (i === 0 && !isRegister) || (i === 1 && isRegister) ? 'white' : 'transparent',
                  color: (i === 0 && !isRegister) || (i === 1 && isRegister) ? '#7c3aed' : '#64748b',
                  boxShadow: (i === 0 && !isRegister) || (i === 1 && isRegister) ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                }}>{t}</button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {isRegister && (
                <div>
                  <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px', fontSize: '14px' }}>Full Name</label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Laxman Kumar"
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = '#7c3aed'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }} />
                </div>
              )}
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px', fontSize: '14px' }}>Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = '#7c3aed'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px', fontSize: '14px' }}>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder={isRegister ? 'Minimum 6 characters' : 'Enter your password'}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = '#7c3aed'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }} />
              </div>

              {error && (
                <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '10px', padding: '12px 16px', color: '#e11d48', fontSize: '14px' }}>
                  ⚠️ {error}
                </div>
              )}

              <button onClick={handleSubmit} disabled={loading} style={{
                background: loading ? '#e5e7eb' : 'linear-gradient(135deg, #7c3aed, #2563eb)',
                color: loading ? '#9ca3af' : 'white', border: 'none', padding: '16px',
                borderRadius: '14px', fontSize: '16px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                boxShadow: loading ? 'none' : '0 8px 24px rgba(124,58,237,0.35)',
                marginTop: '4px',
              }}>
                {loading ? (
                  <><div style={{ width: '18px', height: '18px', border: '2px solid #9ca3af', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Please wait...</>
                ) : isRegister ? 'Create Account →' : 'Start Learning →'}
              </button>
            </div>

            {/* FEATURES */}
            <div style={{ marginTop: '28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { icon: '📚', text: 'AI Study Plans' },
                { icon: '🧠', text: '24/7 AI Mentor' },
                { icon: '📝', text: 'Smart Quizzes' },
                { icon: '📊', text: 'Progress Tracking' },
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8faff', padding: '10px 12px', borderRadius: '12px', border: '1px solid #e0e7ff' }}>
                  <span style={{ fontSize: '18px' }}>{f.icon}</span>
                  <span style={{ color: '#4c1d95', fontSize: '12px', fontWeight: '600' }}>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* DESKTOP LAYOUT */
        <div style={{ minHeight: '100vh', display: 'flex' }}>
          {/* LEFT PANEL */}
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
            padding: '60px', position: 'relative', overflow: 'hidden',
          }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{
                position: 'absolute', width: `${120 + i * 80}px`, height: `${120 + i * 80}px`,
                borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)',
                top: `${10 + i * 12}%`, left: `${-5 + i * 8}%`,
              }} />
            ))}
            <div style={{ position: 'relative', zIndex: 1, maxWidth: '500px', animation: 'fadeUp 0.6s ease' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px', animation: 'float 3s ease-in-out infinite' }}>🎓</div>
              <div style={{ color: '#a78bfa', fontSize: '13px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>AI-POWERED LEARNING</div>
              <h1 style={{ color: 'white', fontSize: '48px', fontWeight: '800', lineHeight: 1.1, margin: '0 0 24px' }}>
                Learn Smarter,<br />
                <span style={{ background: 'linear-gradient(90deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Not Harder.</span>
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '17px', lineHeight: 1.7, marginBottom: '40px' }}>
                Your personalized AI mentor that adapts to your learning style, generates custom study plans, and helps you ace every exam.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { icon: '📚', text: 'Personalized Study Plans for JEE, NEET & more' },
                  { icon: '🧠', text: 'AI Mentor available 24/7 to solve your doubts' },
                  { icon: '📝', text: 'Smart quizzes that adapt to your weak areas' },
                  { icon: '💾', text: 'Your history saved — pick up where you left off' },
                ].map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', animation: `fadeUp 0.6s ease ${0.2 + i * 0.1}s both` }}>
                    <div style={{ fontSize: '22px', width: '42px', height: '42px', background: 'rgba(167,139,250,0.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{f.icon}</div>
                    <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '15px' }}>{f.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div style={{ width: '480px', background: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 48px', boxShadow: '-20px 0 60px rgba(0,0,0,0.15)' }}>
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '30px', fontWeight: '800', color: '#0f0c29', margin: '0 0 8px' }}>
                {isRegister ? 'Create Account 🚀' : 'Welcome back 👋'}
              </h2>
              <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>
                {isRegister ? 'Join thousands of students learning smarter' : 'Sign in to continue your learning journey'}
              </p>
            </div>

            <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '12px', padding: '4px', marginBottom: '28px' }}>
              {['Login', 'Register'].map((t, i) => (
                <button key={t} onClick={() => { setIsRegister(i === 1); setError(''); }} style={{
                  flex: 1, padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                  fontWeight: '700', fontSize: '15px', fontFamily: 'inherit', transition: 'all 0.2s',
                  background: (i === 0 && !isRegister) || (i === 1 && isRegister) ? 'white' : 'transparent',
                  color: (i === 0 && !isRegister) || (i === 1 && isRegister) ? '#7c3aed' : '#64748b',
                  boxShadow: (i === 0 && !isRegister) || (i === 1 && isRegister) ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                }}>{t}</button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {isRegister && (
                <div>
                  <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px', fontSize: '14px' }}>Full Name</label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Laxman Kumar"
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = '#7c3aed'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }} />
                </div>
              )}
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px', fontSize: '14px' }}>Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = '#7c3aed'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px', fontSize: '14px' }}>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder={isRegister ? 'Minimum 6 characters' : 'Enter your password'}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = '#7c3aed'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }} />
              </div>

              {error && (
                <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '10px', padding: '12px 16px', color: '#e11d48', fontSize: '14px' }}>
                  ⚠️ {error}
                </div>
              )}

              <button onClick={handleSubmit} disabled={loading} style={{
                background: loading ? '#e5e7eb' : 'linear-gradient(135deg, #7c3aed, #2563eb)',
                color: loading ? '#9ca3af' : 'white', border: 'none', padding: '16px',
                borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                boxShadow: loading ? 'none' : '0 8px 24px rgba(124,58,237,0.35)',
              }}>
                {loading ? (
                  <><div style={{ width: '18px', height: '18px', border: '2px solid #9ca3af', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Please wait...</>
                ) : isRegister ? 'Create Account →' : 'Start Learning →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}