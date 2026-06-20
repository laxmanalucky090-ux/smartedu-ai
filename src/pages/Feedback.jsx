import { useState } from 'react';
import { sendFeedback } from '../utils/gemini';

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
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 4px', fontWeight: '800', fontSize: '28px', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>📩 Feedback & Suggestions</h2>
        <p style={{ margin: 0, color: '#64748b' }}>Help us improve SmartEdu AI</p>
      </div>

      <div style={{ background: 'white', borderRadius: '24px', padding: '36px', boxShadow: '0 4px 24px rgba(124,58,237,0.08)', border: '1px solid #ede9fe' }}>
        {sent ? (
          <div style={{ textAlign: 'center', padding: '30px' }}>
            <div style={{ fontSize: '52px', marginBottom: '16px' }}>✅</div>
            <h3 style={{ color: '#15803d', margin: '0 0 8px' }}>Thank you!</h3>
            <p style={{ color: '#64748b' }}>Your feedback has been received. We'll review it soon.</p>
            <button onClick={() => setSent(false)} style={{
              marginTop: '20px', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', color: 'white',
              border: 'none', padding: '12px 28px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontFamily: 'inherit',
            }}>Send Another</button>
          </div>
        ) : (
          <>
            <label style={{ display: 'block', fontWeight: '700', color: '#1e293b', marginBottom: '10px' }}>Your Message</label>
            <textarea
              value={message} onChange={e => setMessage(e.target.value)}
              placeholder="Tell us what you'd like to see improved, any bugs you found, or feature requests..."
              rows={6}
              style={{
                width: '100%', padding: '14px 16px', borderRadius: '14px', fontSize: '15px',
                border: '2px solid #e2e8f0', outline: 'none', fontFamily: 'inherit', resize: 'vertical',
                color: '#1e293b', background: '#fafbff', boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = '#7c3aed'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
            {error && <div style={{ marginTop: '12px', color: '#e11d48', fontSize: '14px' }}>⚠️ {error}</div>}
            <button onClick={handleSend} disabled={loading} style={{
              marginTop: '20px', width: '100%', background: loading ? '#e2e8f0' : 'linear-gradient(135deg, #7c3aed, #2563eb)',
              color: loading ? '#94a3b8' : 'white', border: 'none', padding: '16px', borderRadius: '14px',
              fontSize: '16px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
            }}>{loading ? 'Sending...' : '📤 Send Feedback'}</button>
          </>
        )}
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
        Built by Salapareddi Laxmana — laxmanalucky090@gmail.com
      </div>
    </div>
  );
}