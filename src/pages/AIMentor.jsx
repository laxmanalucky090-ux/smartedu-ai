import { useRef, useEffect, useState } from 'react';
import { mentorChat, saveChatHistory } from '../utils/gemini';

const COLORS = {
  bg: '#0A0A0A', card: '#111111', cardAlt: '#181818', cardAlt2: '#1F1F1F',
  border: 'rgba(255,255,255,0.08)',
  accent: '#D7FF3E', accentDark: '#A8E000',
  text: '#FFFFFF', textMuted: '#A1A1AA',
  error: '#F87171', errorBg: 'rgba(248,113,113,0.1)', errorBorder: 'rgba(248,113,113,0.35)',
};

export default function AIMentorPage({ language, messages, setMessages }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const formatMessage = (text) => {
    return text.split('\n').map((line, i) => {
      if (!line.trim()) return <div key={i} style={{ height: '8px' }} />;
      if (line.startsWith('**') && line.endsWith('**')) {
        return <div key={i} style={{ fontWeight: '700', color: COLORS.text, marginBottom: '4px' }}>{line.replace(/\*\*/g, '')}</div>;
      }
      if (line.startsWith('* ') || line.startsWith('- ')) {
        return (
          <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '4px', alignItems: 'flex-start' }}>
            <span style={{ color: COLORS.accent, fontWeight: '700', flexShrink: 0 }}>•</span>
            <span>{line.slice(2)}</span>
          </div>
        );
      }
      if (line.match(/^\d+\./)) {
        return (
          <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '4px', alignItems: 'flex-start' }}>
            <span style={{ color: COLORS.accent, fontWeight: '700', flexShrink: 0 }}>{line.match(/^\d+\./)[0]}</span>
            <span>{line.replace(/^\d+\./, '').trim()}</span>
          </div>
        );
      }
      return <div key={i} style={{ marginBottom: '4px', lineHeight: '1.6' }}>{line}</div>;
    });
  };

  const handleSend = async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput(''); setSaved(false);
    const newMessages = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const history = newMessages.slice(1).map(m => ({ role: m.role, content: m.content }));
      const reply = await mentorChat(msg, history, language);
      setMessages(m => [...m, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: '⚠️ Sorry, I could not respond. Please try again.' }]);
    }
    setLoading(false);
  };

  const handleSaveChat = async () => {
    if (messages.length <= 1) return;
    setSaving(true);
    try {
      const firstUserMsg = messages.find(m => m.role === 'user');
      const title = firstUserMsg ? firstUserMsg.content.slice(0, 60) : 'Conversation';
      await saveChatHistory(title, messages);
      setSaved(true);
    } catch { alert('Could not save chat. Please try again.'); }
    setSaving(false);
  };

  const suggestions = ["Explain Newton's laws simply", 'What is photosynthesis?', 'Tips for JEE preparation', 'How to solve integration?'];

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @media (max-width: 640px) {
          .mentor-header { flex-direction: column !important; gap: 12px !important; }
          .mentor-input-row { gap: 8px !important; }
          .send-btn { padding: 14px 16px !important; font-size: 13px !important; }
        }
      `}</style>

      {/* HEADER */}
      <div className="mentor-header" style={{ marginBottom: '20px', animation: 'fadeUp 0.4s ease', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontWeight: '800', fontSize: '28px', background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>🤖 AI Mentor</h2>
          <p style={{ margin: 0, color: COLORS.textMuted }}>Your personal AI tutor — available 24/7</p>
        </div>
        <button onClick={handleSaveChat} disabled={saving || messages.length <= 1} style={{
          padding: '10px 20px', borderRadius: '12px', border: `1px solid ${COLORS.border}`,
          background: saved ? 'rgba(74,222,128,0.1)' : `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`,
          color: saved ? '#4ADE80' : '#0A0A0A',
          fontWeight: '700', fontSize: '14px', cursor: (saving || messages.length <= 1) ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit', opacity: messages.length <= 1 ? 0.5 : 1,
          boxShadow: saved ? 'none' : '0 4px 12px rgba(215,255,62,0.25)',
        }}>
          {saved ? '✅ Saved!' : saving ? 'Saving...' : '💾 Save Chat'}
        </button>
      </div>

      {/* CHAT BOX */}
      <div style={{
        background: COLORS.card, borderRadius: '24px',
        boxShadow: '0 4px 30px rgba(0,0,0,0.4)',
        border: `1px solid ${COLORS.border}`, overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        height: 'calc(100vh - 200px)',
        minHeight: '400px',
      }}>

        {/* MESSAGES */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', background: COLORS.bg }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: '10px', alignItems: 'flex-end', animation: 'fadeUp 0.3s ease' }}>
              {m.role === 'assistant' && (
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0, boxShadow: '0 4px 12px rgba(215,255,62,0.3)' }}>🤖</div>
              )}
              <div style={{
                maxWidth: '75%', padding: '14px 18px',
                borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: m.role === 'user' ? `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})` : COLORS.card,
                color: m.role === 'user' ? '#0A0A0A' : '#D1D5DB',
                boxShadow: m.role === 'user' ? '0 4px 15px rgba(215,255,62,0.25)' : '0 2px 12px rgba(0,0,0,0.3)',
                fontSize: '15px', lineHeight: 1.6,
                border: m.role === 'assistant' ? `1px solid ${COLORS.border}` : 'none',
                fontWeight: m.role === 'user' ? '600' : '400',
              }}>
                {m.role === 'assistant' ? formatMessage(m.content) : m.content}
              </div>
              {m.role === 'user' && (
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '15px', flexShrink: 0 }}>U</div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🤖</div>
              <div style={{ background: COLORS.card, padding: '16px 20px', borderRadius: '18px 18px 18px 4px', border: `1px solid ${COLORS.border}` }}>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS.accent, animation: `bounce 1s ease ${i * 0.2}s infinite` }} />
                  ))}
                  <span style={{ marginLeft: '8px', color: COLORS.textMuted, fontSize: '13px' }}>AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* SUGGESTIONS */}
        {messages.length <= 1 && (
          <div style={{ padding: '12px 20px', borderTop: `1px solid ${COLORS.border}`, display: 'flex', gap: '8px', flexWrap: 'wrap', background: COLORS.card }}>
            <span style={{ fontSize: '13px', color: COLORS.textMuted, alignSelf: 'center' }}>Try:</span>
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => setInput(s)} style={{
                padding: '6px 14px', borderRadius: '20px', border: `1px solid ${COLORS.border}`,
                background: COLORS.cardAlt, color: COLORS.accent, cursor: 'pointer',
                fontSize: '13px', fontWeight: '500', fontFamily: 'inherit',
                transition: 'all 0.2s',
              }}
                onMouseOver={e => { e.currentTarget.style.borderColor = COLORS.accent; e.currentTarget.style.background = 'rgba(215,255,62,0.08)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.background = COLORS.cardAlt; }}
              >{s}</button>
            ))}
          </div>
        )}

        {/* INPUT */}
        <div className="mentor-input-row" style={{ padding: '16px 20px', borderTop: `1px solid ${COLORS.border}`, display: 'flex', gap: '12px', background: COLORS.card }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Type your question and press Enter..."
            style={{
              flex: 1, padding: '14px 18px', borderRadius: '14px', fontSize: '15px', fontFamily: 'inherit',
              border: `2px solid ${COLORS.border}`, outline: 'none',
              background: COLORS.cardAlt, color: COLORS.text,
              transition: 'all 0.2s',
            }}
            onFocus={e => { e.target.style.borderColor = COLORS.accent; e.target.style.boxShadow = '0 0 0 3px rgba(215,255,62,0.1)'; }}
            onBlur={e => { e.target.style.borderColor = COLORS.border; e.target.style.boxShadow = 'none'; }}
          />
          <button className="send-btn" onClick={handleSend} disabled={loading} style={{
            background: loading ? COLORS.cardAlt : `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`,
            color: loading ? COLORS.textMuted : '#0A0A0A', border: 'none',
            padding: '14px 24px', borderRadius: '14px', cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '700', fontSize: '15px', fontFamily: 'inherit',
            boxShadow: loading ? 'none' : '0 4px 12px rgba(215,255,62,0.25)',
            transition: 'all 0.2s', whiteSpace: 'nowrap',
          }}
            onMouseOver={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Send ✈️
          </button>
        </div>
      </div>
    </div>
  );
}