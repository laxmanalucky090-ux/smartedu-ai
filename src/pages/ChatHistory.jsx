import { useState, useEffect } from 'react';
import { getChatHistory, deleteChat } from '../utils/gemini';

const COLORS = {
  bg: '#0A0A0A', card: '#111111', cardAlt: '#181818',
  border: 'rgba(255,255,255,0.08)',
  accent: '#D7FF3E', accentDark: '#A8E000',
  text: '#FFFFFF', textMuted: '#A1A1AA',
  error: '#F87171', errorBg: 'rgba(248,113,113,0.1)',
};

export default function ChatHistoryPage() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try { setChats(await getChatHistory()); } catch {}
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this chat permanently?')) return;
    await deleteChat(id);
    setChats(c => c.filter(x => x._id !== id));
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @media (max-width: 640px) {
          .chat-header { flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; }
        }
      `}</style>

      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 4px', fontWeight: '800', fontSize: '28px', background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>💬 Chat History</h2>
        <p style={{ margin: 0, color: COLORS.textMuted }}>Your saved conversations with AI Mentor</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: COLORS.textMuted }}>
          <div style={{ width: '36px', height: '36px', border: `3px solid ${COLORS.border}`, borderTopColor: COLORS.accent, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          Loading...
        </div>
      ) : chats.length === 0 ? (
        <div style={{ background: COLORS.card, borderRadius: '20px', padding: '60px 20px', textAlign: 'center', border: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: '52px', marginBottom: '16px' }}>💬</div>
          <p style={{ fontWeight: '700', color: COLORS.text, fontSize: '17px', margin: 0 }}>No saved chats yet</p>
          <p style={{ color: COLORS.textMuted, marginTop: '6px', fontSize: '14px' }}>Save a conversation from the AI Mentor page!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {chats.map((c, i) => (
            <div key={c._id} style={{
              background: COLORS.card, borderRadius: '16px',
              border: `1px solid ${expanded === c._id ? COLORS.accent : COLORS.border}`,
              overflow: 'hidden', animation: `fadeUp 0.4s ease ${i * 0.05}s both`,
              transition: 'border-color 0.2s',
            }}>
              <div className="chat-header" style={{ padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => setExpanded(expanded === c._id ? null : c._id)}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ margin: '0 0 4px', fontWeight: '700', color: COLORS.text, fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title || 'Conversation'}</h4>
                  <p style={{ margin: 0, color: COLORS.textMuted, fontSize: '12px' }}>{c.messages?.length || 0} messages • {new Date(c.createdAt).toLocaleDateString()}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0, marginLeft: '12px' }}>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(c._id); }} style={{
                    background: COLORS.errorBg, color: COLORS.error, border: `1px solid rgba(248,113,113,0.35)`,
                    borderRadius: '10px', padding: '6px 12px', cursor: 'pointer', fontWeight: '600', fontSize: '12px', fontFamily: 'inherit',
                  }}>🗑️</button>
                  <span style={{ color: COLORS.accent, fontSize: '14px' }}>{expanded === c._id ? '▲' : '▼'}</span>
                </div>
              </div>
              {expanded === c._id && (
                <div style={{ padding: '0 20px 20px', borderTop: `1px solid ${COLORS.border}`, maxHeight: '320px', overflowY: 'auto' }}>
                  {c.messages?.map((m, j) => (
                    <div key={j} style={{ margin: '12px 0', display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                      <div style={{
                        maxWidth: '75%', padding: '10px 14px', borderRadius: '12px', fontSize: '13px', lineHeight: 1.5,
                        background: m.role === 'user' ? `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})` : COLORS.cardAlt,
                        color: m.role === 'user' ? '#0A0A0A' : '#D1D5DB',
                        border: m.role === 'assistant' ? `1px solid ${COLORS.border}` : 'none',
                        fontWeight: m.role === 'user' ? '600' : '400',
                      }}>{m.content}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}