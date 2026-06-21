import { useState, useEffect } from 'react';
import { getStudyPlanHistory, deleteStudyPlan } from '../utils/gemini';

const COLORS = {
  bg: '#0A0A0A', card: '#111111', cardAlt: '#181818',
  border: 'rgba(255,255,255,0.08)',
  accent: '#D7FF3E', accentDark: '#A8E000',
  text: '#FFFFFF', textMuted: '#A1A1AA',
  error: '#F87171', errorBg: 'rgba(248,113,113,0.1)', errorBorder: 'rgba(248,113,113,0.35)',
};

export default function StudyHistoryPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try { setPlans(await getStudyPlanHistory()); } catch {}
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this study plan permanently?')) return;
    await deleteStudyPlan(id);
    setPlans(p => p.filter(x => x._id !== id));
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @media (max-width: 640px) {
          .plan-header { flex-direction: column !important; align-items: flex-start !important; gap: 10px !important; }
          .plan-week-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 4px', fontWeight: '800', fontSize: '28px', background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>📋 Study History</h2>
        <p style={{ margin: 0, color: COLORS.textMuted }}>All your previously generated study plans</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: COLORS.textMuted }}>
          <div style={{ width: '36px', height: '36px', border: `3px solid ${COLORS.border}`, borderTopColor: COLORS.accent, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          Loading...
        </div>
      ) : plans.length === 0 ? (
        <div style={{ background: COLORS.card, borderRadius: '20px', padding: '60px 20px', textAlign: 'center', border: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: '52px', marginBottom: '16px' }}>📚</div>
          <p style={{ fontWeight: '700', color: COLORS.text, fontSize: '17px', margin: 0 }}>No study plans yet</p>
          <p style={{ color: COLORS.textMuted, marginTop: '6px', fontSize: '14px' }}>Generate your first plan from the Study Plan page!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {plans.map((p, i) => (
            <div key={p._id} style={{
              background: COLORS.card, borderRadius: '16px',
              border: `1px solid ${expanded === p._id ? COLORS.accent : COLORS.border}`,
              overflow: 'hidden', animation: `fadeUp 0.4s ease ${i * 0.05}s both`,
              transition: 'border-color 0.2s',
            }}>
              <div className="plan-header" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => setExpanded(expanded === p._id ? null : p._id)}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ margin: '0 0 4px', fontWeight: '800', color: COLORS.text, fontSize: '16px' }}>{p.examName}</h4>
                  <p style={{ margin: 0, color: COLORS.textMuted, fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.subjects?.join(', ')} • {p.level} • {new Date(p.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0, marginLeft: '12px' }}>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(p._id); }} style={{
                    background: COLORS.errorBg, color: COLORS.error, border: `1px solid ${COLORS.errorBorder}`,
                    borderRadius: '10px', padding: '7px 14px', cursor: 'pointer', fontWeight: '600', fontSize: '12px', fontFamily: 'inherit',
                  }}>🗑️</button>
                  <span style={{ color: COLORS.accent, fontSize: '18px' }}>{expanded === p._id ? '▲' : '▼'}</span>
                </div>
              </div>

              {expanded === p._id && p.planData && (
                <div style={{ padding: '0 24px 24px', borderTop: `1px solid ${COLORS.border}` }}>
                  <p style={{ color: COLORS.textMuted, margin: '16px 0', fontSize: '14px', lineHeight: 1.6 }}>{p.planData.description}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {p.planData.weeks?.map((w, j) => (
                      <div key={j} style={{ background: COLORS.cardAlt, borderRadius: '14px', padding: '16px 20px', border: `1px solid ${COLORS.border}` }}>
                        <h5 style={{ margin: '0 0 10px', fontWeight: '700', color: COLORS.accent, fontSize: '14px' }}>
                          Week {w.week}: {w.title}
                        </h5>
                        <div className="plan-week-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div>
                            <p style={{ margin: '0 0 6px', fontSize: '11px', fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '1px' }}>📌 Topics</p>
                            {w.topics?.map((t, k) => (
                              <div key={k} style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                                <span style={{ color: COLORS.accent, flexShrink: 0 }}>•</span>
                                <span style={{ color: '#D1D5DB', fontSize: '13px' }}>{t}</span>
                              </div>
                            ))}
                          </div>
                          <div>
                            <p style={{ margin: '0 0 6px', fontSize: '11px', fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '1px' }}>✅ Goals</p>
                            {w.goals?.map((g, k) => (
                              <div key={k} style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                                <span style={{ color: '#4ADE80', flexShrink: 0 }}>🎯</span>
                                <span style={{ color: '#D1D5DB', fontSize: '13px' }}>{g}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}