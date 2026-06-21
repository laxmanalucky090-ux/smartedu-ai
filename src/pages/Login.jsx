import { useState, useEffect } from 'react';
import { loginUser, registerUser } from '../utils/gemini';

const COLORS = {
  bgDark: '#0A0A0A',
  panelLight: '#FAFAF8',
  toggleTrack: '#F1F1EC',
  accent: '#D7FF3E',
  accentDark: '#A8E000',
  textDark: '#0A0A0A',
  textMutedOnLight: '#6B7280',
  textMutedOnDark: 'rgba(255,255,255,0.6)',
  borderLight: '#E5E7EB',
  error: '#E11D48',
  errorBg: '#FFF1F2',
  errorBorder: '#FECDD3',
};

const FieldError = ({ message }) =>
  message ? (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', color: COLORS.error, fontSize: '13px', fontWeight: 600 }}>
      <span>⚠</span><span>{message}</span>
    </div>
  ) : null;

const FEATURES = [
  { icon: '📖', text: 'Custom plans for JEE, NEET, UPSC & more' },
  { icon: '🧠', text: '24/7 AI mentor to clear every doubt' },
  { icon: '🧩', text: 'Smart quizzes that adapt to your weak spots' },
  { icon: '📊', text: 'Progress saved — never lose your streak' },
];

export default function LoginPage({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '', password: '', general: '' });
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const switchMode = (toRegister) => {
    setIsRegister(toRegister);
    setErrors({ name: '', email: '', password: '', general: '' });
  };

  const validate = () => {
    const next = { name: '', email: '', password: '', general: '' };
    let valid = true;

    if (isRegister) {
      if (!name.trim()) {
        next.name = 'Please enter your name';
        valid = false;
      } else if (name.trim().length < 2) {
        next.name = 'Name must be at least 2 characters';
        valid = false;
      }
    }

    if (!email.trim()) {
      next.email = 'Email is required';
      valid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        next.email = 'Enter a valid email like name@example.com';
        valid = false;
      }
    }

    if (!password) {
      next.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      next.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(next);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setErrors(e => ({ ...e, general: '' }));
    try {
      const user = isRegister
        ? await registerUser(name.trim(), email.trim(), password)
        : await loginUser(email.trim(), password);
      onLogin(user);
    } catch (err) {
      setErrors(e => ({ ...e, general: err.response?.data?.error || 'Something went wrong. Try again.' }));
    }
    setLoading(false);
  };

  const fieldStyle = (hasError) => ({
    width: '100%', padding: '14px 16px', borderRadius: '12px', fontSize: '15px',
    boxSizing: 'border-box', border: `2px solid ${hasError ? COLORS.error : COLORS.borderLight}`,
    outline: 'none', fontFamily: 'inherit', color: COLORS.textDark, background: '#FFFFFF',
    transition: 'all 0.2s',
  });

  const focusField = (e, hasError) => {
    if (hasError) return;
    e.target.style.borderColor = COLORS.textDark;
    e.target.style.boxShadow = `0 0 0 3px rgba(215,255,62,0.3)`;
  };
  const blurField = (e, hasError) => {
    e.target.style.borderColor = hasError ? COLORS.error : COLORS.borderLight;
    e.target.style.boxShadow = 'none';
  };

  const labelStyle = { display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px', fontSize: '14px' };

  const toggleTabStyle = (active) => ({
    flex: 1, padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer',
    fontWeight: '700', fontSize: '14px', fontFamily: 'inherit', transition: 'all 0.2s',
    background: active ? COLORS.bgDark : 'transparent',
    color: active ? '#FFFFFF' : COLORS.textMutedOnLight,
    boxShadow: active ? '0 2px 8px rgba(0,0,0,0.25)' : 'none',
  });

  const submitButtonStyle = (radius) => ({
    background: loading ? '#D1D5DB' : COLORS.accent,
    color: loading ? '#9CA3AF' : COLORS.textDark,
    border: 'none', padding: '16px',
    borderRadius: radius, fontSize: '16px', fontWeight: '800', cursor: loading ? 'not-allowed' : 'pointer',
    fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
    boxShadow: loading ? 'none' : '0 8px 24px rgba(215,255,62,0.35)',
    width: '100%',
  });

  const GeneralError = errors.general ? (
    <div style={{ background: COLORS.errorBg, border: `1px solid ${COLORS.errorBorder}`, borderRadius: '10px', padding: '12px 16px', color: COLORS.error, fontSize: '14px' }}>
      ⚠️ {errors.general}
    </div>
  ) : null;

  const SubmitButton = ({ radius }) => (
    <button onClick={handleSubmit} disabled={loading} style={submitButtonStyle(radius)}>
      {loading ? (
        <><div style={{ width: '18px', height: '18px', border: '2px solid #9ca3af', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Please wait...</>
      ) : isRegister ? 'Create account →' : 'Sign in →'}
    </button>
  );

  const TopBar = () => (
    <div style={{
      height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: isMobile ? '0 16px' : '0 40px', borderBottom: '1px solid rgba(0,0,0,0.06)',
      background: COLORS.panelLight, flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: COLORS.bgDark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px' }}>🎓</div>
        <span style={{ fontWeight: '800', fontSize: isMobile ? '15px' : '17px', color: COLORS.textDark }}>SmartEdu<span style={{ color: '#9CA3AF' }}>.AI</span></span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '999px', background: '#F1F1EC', fontSize: '12px', fontWeight: '700', color: '#374151' }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
        {!isMobile && 'AI · '}Online
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif", display: 'flex', flexDirection: 'column', background: COLORS.panelLight }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        * { box-sizing: border-box; }
      `}</style>

      <TopBar />

      {isMobile ? (
        /* MOBILE LAYOUT */
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* DARK HERO */}
          <div style={{ background: COLORS.bgDark, padding: '32px 24px 36px', animation: 'fadeUp 0.5s ease' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(215,255,62,0.12)', border: `1px solid rgba(215,255,62,0.3)`, color: COLORS.accent, fontSize: '11px', fontWeight: '700', letterSpacing: '1px', padding: '6px 12px', borderRadius: '999px', marginBottom: '16px' }}>
              ✦ AI-POWERED LEARNING
            </div>
            <h1 style={{ color: 'white', fontSize: '28px', fontWeight: '800', margin: '0 0 4px', lineHeight: 1.2 }}>
              Study smarter.<br />Score higher.<br />
              <span style={{ background: COLORS.accent, color: COLORS.textDark, padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '2px' }}>No guesswork.</span>
            </h1>
            <p style={{ color: COLORS.textMutedOnDark, fontSize: '14px', margin: '14px 0 0', lineHeight: 1.6 }}>
              An AI mentor that builds your study plan, drills your weak topics, and tracks your progress.
            </p>
          </div>

          {/* LIGHT FORM SHEET */}
          <div style={{ flex: 1, background: COLORS.panelLight, borderRadius: '28px 28px 0 0', marginTop: '-20px', padding: '32px 24px 40px', animation: 'fadeUp 0.5s ease 0.1s both', position: 'relative' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: COLORS.textDark, margin: '0 0 6px' }}>
              {isRegister ? 'Create your account' : 'Welcome back'}
            </h2>
            <p style={{ color: COLORS.textMutedOnLight, fontSize: '14px', margin: '0 0 24px' }}>
              {isRegister ? 'Join thousands of students prepping the smart way.' : 'Sign in to keep your streak alive.'}
            </p>

            <div style={{ display: 'flex', background: COLORS.toggleTrack, borderRadius: '12px', padding: '4px', marginBottom: '24px' }}>
              <button onClick={() => switchMode(false)} style={toggleTabStyle(!isRegister)}>Sign in</button>
              <button onClick={() => switchMode(true)} style={toggleTabStyle(isRegister)}>Create account</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {isRegister && (
                <div>
                  <label style={labelStyle}>Full name</label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Laxman Kumar"
                    style={fieldStyle(!!errors.name)}
                    onFocus={e => focusField(e, !!errors.name)}
                    onBlur={e => blurField(e, !!errors.name)} />
                  <FieldError message={errors.name} />
                </div>
              )}
              <div>
                <label style={labelStyle}>Email address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                  style={fieldStyle(!!errors.email)}
                  onFocus={e => focusField(e, !!errors.email)}
                  onBlur={e => blurField(e, !!errors.email)} />
                <FieldError message={errors.email} />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder={isRegister ? 'Minimum 6 characters' : 'Enter your password'}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  style={fieldStyle(!!errors.password)}
                  onFocus={e => focusField(e, !!errors.password)}
                  onBlur={e => blurField(e, !!errors.password)} />
                <FieldError message={errors.password} />
              </div>

              {GeneralError}
              <SubmitButton radius="14px" />
            </div>

            <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {FEATURES.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(215,255,62,0.1)', padding: '10px 12px', borderRadius: '12px', border: '1px solid rgba(215,255,62,0.25)' }}>
                  <span style={{ fontSize: '16px' }}>{f.icon}</span>
                  <span style={{ color: COLORS.textDark, fontSize: '11px', fontWeight: '600' }}>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* DESKTOP LAYOUT */
        <div style={{ flex: 1, display: 'flex' }}>
          {/* LEFT DARK PANEL */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', position: 'relative', overflow: 'hidden', background: COLORS.bgDark }}>
            <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 75% 30%, rgba(215,255,62,0.08), transparent 55%)` }} />
            <div style={{ position: 'relative', zIndex: 1, maxWidth: '500px', animation: 'fadeUp 0.6s ease' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(215,255,62,0.12)', border: `1px solid rgba(215,255,62,0.3)`, color: COLORS.accent, fontSize: '12px', fontWeight: '700', letterSpacing: '1.5px', padding: '7px 14px', borderRadius: '999px', marginBottom: '24px' }}>
                ✦ AI-POWERED LEARNING
              </div>
              <h1 style={{ color: 'white', fontSize: '48px', fontWeight: '800', lineHeight: 1.1, margin: '0 0 24px' }}>
                Study smarter.<br />Score higher.<br />
                <span style={{ background: COLORS.accent, color: COLORS.textDark, padding: '2px 10px', borderRadius: '6px', display: 'inline-block', marginTop: '6px' }}>No guesswork.</span>
              </h1>
              <p style={{ color: COLORS.textMutedOnDark, fontSize: '17px', lineHeight: 1.7, marginBottom: '40px' }}>
                An AI mentor that builds your study plan, drills your weak topics, and tracks your progress — so every hour you study actually counts.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '60px' }}>
                {FEATURES.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', animation: `fadeUp 0.6s ease ${0.2 + i * 0.1}s both` }}>
                    <div style={{ fontSize: '20px', width: '40px', height: '40px', background: '#171717', border: '1px solid rgba(215,255,62,0.25)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{f.icon}</div>
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px' }}>{f.text}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px' }}>
                <div style={{ width: '24px', height: '1px', background: 'rgba(255,255,255,0.3)' }} />
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                  Trusted by students · JEE / NEET / UPSC / SSC
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT LIGHT PANEL */}
          <div style={{ width: '440px', minWidth: '340px', background: COLORS.panelLight, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 40px', boxShadow: '-20px 0 60px rgba(0,0,0,0.06)' }}>
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '30px', fontWeight: '800', color: COLORS.textDark, margin: '0 0 8px' }}>
                {isRegister ? 'Create your account' : 'Welcome back'}
              </h2>
              <p style={{ color: COLORS.textMutedOnLight, fontSize: '15px', margin: 0 }}>
                {isRegister ? 'Join thousands of students prepping the smart way.' : 'Sign in to keep your streak alive.'}
              </p>
            </div>

            <div style={{ display: 'flex', background: COLORS.toggleTrack, borderRadius: '12px', padding: '4px', marginBottom: '28px' }}>
              <button onClick={() => switchMode(false)} style={toggleTabStyle(!isRegister)}>Sign in</button>
              <button onClick={() => switchMode(true)} style={toggleTabStyle(isRegister)}>Create account</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {isRegister && (
                <div>
                  <label style={labelStyle}>Full name</label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Laxman Kumar"
                    style={fieldStyle(!!errors.name)}
                    onFocus={e => focusField(e, !!errors.name)}
                    onBlur={e => blurField(e, !!errors.name)} />
                  <FieldError message={errors.name} />
                </div>
              )}
              <div>
                <label style={labelStyle}>Email address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                  style={fieldStyle(!!errors.email)}
                  onFocus={e => focusField(e, !!errors.email)}
                  onBlur={e => blurField(e, !!errors.email)} />
                <FieldError message={errors.email} />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder={isRegister ? 'Minimum 6 characters' : 'Enter your password'}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  style={fieldStyle(!!errors.password)}
                  onFocus={e => focusField(e, !!errors.password)}
                  onBlur={e => blurField(e, !!errors.password)} />
                <FieldError message={errors.password} />
              </div>

              {GeneralError}
              <SubmitButton radius="12px" />
            </div>

            <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '12px', marginTop: '20px' }}>
              By continuing you agree to our friendly Terms & Privacy.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}