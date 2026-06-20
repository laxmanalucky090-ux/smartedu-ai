import { useState, useEffect } from 'react';
import { getChatHistory, deleteChat } from '../utils/gemini';

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
      <style>{`@keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }`}</style>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 4px', fontWeight: '800', fontSize: '28px', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>💬 Chat History</h2>
        <p style={{ margin: 0, color: '#64748b' }}>Your saved conversations with AI Mentor</p>
      </div>

      {loading ? (
        <p style={{ color: '#64748b' }}>Loading...</p>
      ) : chats.length === 0 ? (
        <div style={{ background: 'white', borderRadius: '20px', padding: '60px 20px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '52px', marginBottom: '16px' }}>💬</div>
          <p style={{ fontWeight: '700', color: '#1e293b', fontSize: '17px', margin: 0 }}>No saved chats yet</p>
          <p style={{ color: '#64748b', marginTop: '6px' }}>Save a conversation from the AI Mentor page!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {chats.map((c, i) => (
            <div key={c._id} style={{
              background: 'white', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              border: '1px solid #ede9fe', overflow: 'hidden', animation: `fadeUp 0.4s ease ${i * 0.05}s both`,
            }}>
              <div style={{ padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => setExpanded(expanded === c._id ? null : c._id)}>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontWeight: '700', color: '#1e293b', fontSize: '15px' }}>{c.title || 'Conversation'}</h4>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '12px' }}>{c.messages?.length || 0} messages • {new Date(c.createdAt).toLocaleDateString()}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(c._id); }} style={{
                    background: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3', borderRadius: '10px',
                    padding: '6px 12px', cursor: 'pointer', fontWeight: '600', fontSize: '12px', fontFamily: 'inherit',
                  }}>🗑️</button>
                  <span style={{ color: '#7c3aed' }}>{expanded === c._id ? '▲' : '▼'}</span>
                </div>
              </div>
              {expanded === c._id && (
                <div style={{ padding: '0 22px 20px', borderTop: '1px solid #f1f5f9', maxHeight: '300px', overflowY: 'auto' }}>
                  {c.messages?.map((m, j) => (
                    <div key={j} style={{ margin: '12px 0', display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                      <div style={{
                        maxWidth: '75%', padding: '10px 14px', borderRadius: '12px', fontSize: '13px',
                        background: m.role === 'user' ? '#7c3aed' : '#f1f5f9',
                        color: m.role === 'user' ? 'white' : '#1e293b',
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