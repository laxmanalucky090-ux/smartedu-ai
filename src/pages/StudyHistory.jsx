import { useState, useEffect } from 'react';
import { getStudyPlanHistory, deleteStudyPlan } from '../utils/gemini';

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
      <style>{`@keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }`}</style>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 4px', fontWeight: '800', fontSize: '28px', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>📋 Study Plan History</h2>
        <p style={{ margin: 0, color: '#64748b' }}>All your previously generated study plans</p>
      </div>

      {loading ? (
        <p style={{ color: '#64748b' }}>Loading...</p>
      ) : plans.length === 0 ? (
        <div style={{ background: 'white', borderRadius: '20px', padding: '60px 20px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '52px', marginBottom: '16px' }}>📚</div>
          <p style={{ fontWeight: '700', color: '#1e293b', fontSize: '17px', margin: 0 }}>No study plans yet</p>
          <p style={{ color: '#64748b', marginTop: '6px' }}>Generate your first plan from the Study Plan page!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {plans.map((p, i) => (
            <div key={p._id} style={{
              background: 'white', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              border: '1px solid #ede9fe', overflow: 'hidden', animation: `fadeUp 0.4s ease ${i * 0.05}s both`,
            }}>
              <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => setExpanded(expanded === p._id ? null : p._id)}>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontWeight: '800', color: '#1e293b' }}>{p.examName}</h4>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
                    {p.subjects?.join(', ')} • {p.level} • {new Date(p.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(p._id); }} style={{
                    background: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3', borderRadius: '10px',
                    padding: '8px 14px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', fontFamily: 'inherit',
                  }}>🗑️ Delete</button>
                  <span style={{ color: '#7c3aed', fontSize: '20px' }}>{expanded === p._id ? '▲' : '▼'}</span>
                </div>
              </div>
              {expanded === p._id && p.planData && (
                <div style={{ padding: '0 24px 24px', borderTop: '1px solid #f1f5f9' }}>
                  <p style={{ color: '#64748b', margin: '16px 0' }}>{p.planData.description}</p>
                  {p.planData.weeks?.map((w, j) => (
                    <div key={j} style={{ background: '#fafbff', borderRadius: '12px', padding: '16px', marginBottom: '10px' }}>
                      <h5 style={{ margin: '0 0 8px', fontWeight: '700', color: '#7c3aed' }}>Week {w.week}: {w.title}</h5>
                      <p style={{ margin: '4px 0', fontSize: '13px', color: '#374151' }}><b>Topics:</b> {w.topics?.join(', ')}</p>
                      <p style={{ margin: '4px 0', fontSize: '13px', color: '#374151' }}><b>Goals:</b> {w.goals?.join(', ')}</p>
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