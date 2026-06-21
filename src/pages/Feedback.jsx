import { useState } from 'react';
import { sendFeedback } from '../utils/gemini';

const COLORS = {
  bg: '#0A0A0A', card: '#111111', cardAlt: '#181818',
  border: 'rgba(255,255,255,0.08)',
  accent: '#D7FF3E', accentDark: '#A8E000',
  text: '#FFFFFF', textMuted: '#A1A1AA',
  error: '#F87171', errorBg: 'rgba(248,113,113,0.1)', errorBorder: 'rgba(248,113,113,0.35)',
  success: '#4ADE80', successBg: 'rgba(74,222,128,0.1)',
};

export default function FeedbackPage({ user }) {
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!message.trim()) return setError('Please write a message');
    setError(''); setLoading(true);
    try {
      await sendFeedback(user?.name, user?.email, message);
      setSent(true); setMessage('');
    } catch { setError('Failed to send. Try again.'); }
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", maxWidth: '700px', margin: '0 auto' }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes celebrate { 0%,100%{transform:scale(1)} 50%{transform:scale(1.03)} }
      `}</style>

      {/* HEADER */}
      <div style={{ marginBottom: '24px', animation: 'fadeUp 0.4s ease' }}>
        <h2 style={{ margin: '0 0 4px', fontWeight: '800', fontSize: '28px', background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>📩 Feedback</h2>
        <p style={{ margin: 0, color: COLORS.textMuted }}>Help us improve SmartEdu AI</p>
      </div>

      <div style={{ background: COLORS.card, borderRadius: '24px', padding: '32px', border: `1px solid ${COLORS.border}`, boxShadow: '0 4px 24px rgba(0,0,0,0.3)', animation: 'fadeUp 0.5s ease 0.1s both' }}>
        {sent ? (
          <div style={{ textAlign: 'center', padding: '20px', animation: 'celebrate 0.5s ease' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
            <h3 style={{ color: COLORS.success, margin: '0 0 8px', fontSize: '22px', fontWeight: '800' }}>Thank you!</h3>
            <p style={{ color: COLORS.textMuted, marginBottom: '24px' }}>Your feedback has been received. We'll review it soon.</p>
            <button onClick={() => setSent(false)} style={{
              background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`, color: '#0A0A0A',
              border: 'none', padding: '14px 32px', borderRadius: '14px', cursor: 'pointer',
              fontWeight: '700', fontSize: '15px', fontFamily: 'inherit',
              boxShadow: '0 4px 12px rgba(215,255,62,0.25)',
            }}>Send Another</button>
          </div>
        ) : (
          <>
            {/* USER INFO */}
            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', padding: '14px 16px', background: COLORS.cardAlt, borderRadius: '14px', border: `1px solid ${COLORS.border}` }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A0A0A', fontWeight: '800', fontSize: '16px', flexShrink: 0 }}>
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: '700', color: COLORS.text, fontSize: '14px' }}>{user.name}</p>
                  <p style={{ margin: 0, color: COLORS.textMuted, fontSize: '12px' }}>{user.email}</p>
                </div>
              </div>
            )}

            <label style={{ display: 'block', fontWeight: '700', color: COLORS.textMuted, marginBottom: '10px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Message</label>
            <textarea
              value={message} onChange={e => setMessage(e.target.value)}
              placeholder="Tell us what you'd like to see improved, any bugs you found, or feature requests..."
              rows={6}
              style={{
                width: '100%', padding: '14px 16px', borderRadius: '14px', fontSize: '15px',
                border: `2px solid ${COLORS.border}`, outline: 'none', fontFamily: 'inherit', resize: 'vertical',
                color: COLORS.text, background: COLORS.cardAlt, boxSizing: 'border-box',
                lineHeight: 1.6, transition: 'all 0.2s',
              }}
              onFocus={e => { e.target.style.borderColor = COLORS.accent; e.target.style.boxShadow = '0 0 0 3px rgba(215,255,62,0.1)'; }}
              onBlur={e => { e.target.style.borderColor = COLORS.border; e.target.style.boxShadow = 'none'; }}
            />

            {error && (
              <div style={{ marginTop: '12px', background: COLORS.errorBg, border: `1px solid ${COLORS.errorBorder}`, borderRadius: '10px', padding: '10px 14px', color: COLORS.error, fontSize: '14px' }}>
                ⚠️ {error}
              </div>
            )}

            <button onClick={handleSend} disabled={loading} style={{
              marginTop: '20px', width: '100%',
              background: loading ? COLORS.cardAlt : `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`,
              color: loading ? COLORS.textMuted : '#0A0A0A',
              border: 'none', padding: '16px', borderRadius: '14px',
              fontSize: '16px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              boxShadow: loading ? 'none' : '0 8px 24px rgba(215,255,62,0.25)',
              transition: 'all 0.2s',
            }}
              onMouseOver={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {loading ? (
                <><div style={{ width: '18px', height: '18px', border: '2px solid #6B7280', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Sending...</>
              ) : '📤 Send Feedback'}
            </button>
          </>
        )}
      </div>

      {/* CONTACT */}
      <div style={{ marginTop: '20px', textAlign: 'center', padding: '16px', background: COLORS.card, borderRadius: '16px', border: `1px solid ${COLORS.border}` }}>
        <p style={{ margin: 0, color: COLORS.textMuted, fontSize: '13px' }}>
          Built by <span style={{ color: COLORS.accent, fontWeight: '700' }}>Salapareddi Laxmana</span> •{' '}
          <a href="mailto:salapareddilaxmana@gmail.com" style={{ color: COLORS.accent, textDecoration: 'none', fontWeight: '600' }}>
            salapareddilaxmana@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}