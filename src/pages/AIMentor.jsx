import { useRef, useEffect, useState } from 'react';
import { mentorChat, saveChatHistory } from '../utils/gemini';

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
        return <div key={i} style={{ fontWeight: '700', color: '#f1f5f9', marginBottom: '4px' }}>{line.replace(/\*\*/g, '')}</div>;
      }
      if (line.startsWith('* ') || line.startsWith('- ')) {
        return (
          <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '4px', alignItems: 'flex-start' }}>
            <span style={{ color: '#a78bfa', fontWeight: '700', flexShrink: 0 }}>•</span>
            <span>{line.slice(2)}</span>
          </div>
        );
      }
      if (line.match(/^\d+\./)) {
        return (
          <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '4px', alignItems: 'flex-start' }}>
            <span style={{ color: '#a78bfa', fontWeight: '700', flexShrink: 0 }}>{line.match(/^\d+\./)[0]}</span>
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
    setInput('');
    setSaved(false);
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
    } catch {
      alert('Could not save chat. Please try again.');
    }
    setSaving(false);
  };

  const suggestions = ["Explain Newton's laws simply", 'What is photosynthesis?', 'Tips for JEE preparation', 'How to solve integration?'];

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
      `}</style>

      <div style={{ marginBottom: '24px', animation: 'fadeUp 0.4s ease', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontWeight: '800', fontSize: '28px', background: 'linear-gradient(135deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>🤖 AI Mentor</h2>
          <p style={{ margin: 0, color: '#94a3b8' }}>Your personal AI tutor — available 24/7</p>
        </div>
        <button onClick={handleSaveChat} disabled={saving || messages.length <= 1} style={{
          padding: '10px 20px', borderRadius: '12px', border: '1px solid #3d3d5c',
          background: saved ? '#16162a' : 'linear-gradient(135deg, #7c3aed, #2563eb)',
          color: saved ? '#86efac' : 'white',
          fontWeight: '700', fontSize: '14px', cursor: (saving || messages.length <= 1) ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit', opacity: messages.length <= 1 ? 0.5 : 1,
        }}>
          {saved ? '✅ Saved' : saving ? 'Saving...' : '💾 Save Chat'}
        </button>
      </div>

      <div style={{
        background: '#16162a', borderRadius: '24px', boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
        border: '1px solid #2a2a45', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', height: '650px',
      }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', background: '#0f0f1a' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: '10px', alignItems: 'flex-end', animation: 'fadeUp 0.3s ease' }}>
              {m.role === 'assistant' && (
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0, boxShadow: '0 4px 12px rgba(124,58,237,0.4)' }}>🤖</div>
              )}
              <div style={{
                maxWidth: '75%', padding: '14px 18px',
                borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: m.role === 'user' ? 'linear-gradient(135deg, #7c3aed, #2563eb)' : '#1c1c33',
                color: m.role === 'user' ? 'white' : '#e2e8f0',
                boxShadow: m.role === 'user' ? '0 4px 15px rgba(124,58,237,0.35)' : '0 2px 12px rgba(0,0,0,0.2)',
                fontSize: '15px', lineHeight: 1.6,
                border: m.role === 'assistant' ? '1px solid #2a2a45' : 'none',
              }}>
                {m.role === 'assistant' ? formatMessage(m.content) : m.content}
              </div>
              {m.role === 'user' && (
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #f093fb, #f5576c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '15px', flexShrink: 0 }}>U</div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🤖</div>
              <div style={{ background: '#1c1c33', padding: '16px 20px', borderRadius: '18px 18px 18px 4px', boxShadow: '0 2px 12px rgba(0,0,0,0.2)', border: '1px solid #2a2a45' }}>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', animation: `bounce 1s ease ${i * 0.2}s infinite` }} />
                  ))}
                  <span style={{ marginLeft: '8px', color: '#64748b', fontSize: '13px' }}>AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {messages.length <= 1 && (
          <div style={{ padding: '12px 20px', borderTop: '1px solid #2a2a45', display: 'flex', gap: '8px', flexWrap: 'wrap', background: '#16162a' }}>
            <span style={{ fontSize: '13px', color: '#64748b', alignSelf: 'center' }}>Try:</span>
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => setInput(s)} style={{
                padding: '6px 14px', borderRadius: '20px', border: '1px solid #3d3d5c',
                background: '#1c1c33', color: '#a78bfa', cursor: 'pointer', fontSize: '13px', fontWeight: '500', fontFamily: 'inherit',
              }}>{s}</button>
            ))}
          </div>
        )}

        <div style={{ padding: '16px 20px', borderTop: '1px solid #2a2a45', display: 'flex', gap: '12px', background: '#16162a' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Type your question here and press Enter..."
            style={{
              flex: 1, padding: '14px 18px', borderRadius: '14px', fontSize: '15px', fontFamily: 'inherit',
              border: '2px solid #2a2a45', outline: 'none', background: '#0f0f1a', color: '#e2e8f0',
            }}
            onFocus={e => e.target.style.borderColor = '#7c3aed'}
            onBlur={e => e.target.style.borderColor = '#2a2a45'}
          />
          <button onClick={handleSend} disabled={loading} style={{
            background: loading ? '#2a2a45' : 'linear-gradient(135deg, #7c3aed, #2563eb)',
            color: loading ? '#64748b' : 'white', border: 'none',
            padding: '14px 24px', borderRadius: '14px', cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '700', fontSize: '15px', fontFamily: 'inherit',
          }}>
            Send ✈️
          </button>
        </div>
      </div>
    </div>
  );
}