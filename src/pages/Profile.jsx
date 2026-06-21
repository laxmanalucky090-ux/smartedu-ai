import { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../utils/gemini';

const COLORS = {
  bg: '#0A0A0A', card: '#111111', cardAlt: '#181818',
  border: 'rgba(255,255,255,0.08)',
  accent: '#D7FF3E', accentDark: '#A8E000',
  text: '#FFFFFF', textMuted: '#A1A1AA',
  error: '#F87171', errorBg: 'rgba(248,113,113,0.1)', errorBorder: 'rgba(248,113,113,0.35)',
  success: '#4ADE80', successBg: 'rgba(74,222,128,0.1)', successBorder: 'rgba(74,222,128,0.35)',
};

export default function ProfilePage({ user, setUser }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getUserProfile();
      setProfile(data);
      setName(data.user.name);
    } catch {}
    setLoading(false);
  };

  const handleSave = async () => {
    if (!name.trim()) return setError('Name cannot be empty');
    setSaving(true); setError(''); setSuccess('');
    try {
      const data = await updateUserProfile(name);
      setProfile(p => ({ ...p, user: data.user }));
      setUser(u => ({ ...u, name: data.user.name }));
      setEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch { setError('Failed to update. Try again.'); }
    setSaving(false);
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
      <style>{`@keyframes spin { to{transform:rotate(360deg)} }`}</style>
      <div style={{ width: '40px', height: '40px', border: `4px solid ${COLORS.border}`, borderTopColor: COLORS.accent, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", maxWidth: '700px', margin: '0 auto' }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @media (max-width: 640px) {
          .profile-stats { grid-template-columns: 1fr !important; }
          .profile-edit-row { flex-direction: column !important; }
          .profile-edit-row button { width: 100% !important; }
          .profile-avatar-row { flex-direction: column !important; align-items: center !important; text-align: center !important; }
        }
      `}</style>

      {/* HEADER */}
      <div style={{ marginBottom: '24px', animation: 'fadeUp 0.4s ease' }}>
        <h2 style={{ margin: '0 0 4px', fontWeight: '800', fontSize: '28px', background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>👤 My Profile</h2>
        <p style={{ margin: 0, color: COLORS.textMuted }}>Manage your account and view your stats</p>
      </div>

      {/* PROFILE CARD */}
      <div style={{ background: COLORS.card, borderRadius: '24px', padding: '32px', marginBottom: '20px', border: `1px solid ${COLORS.border}`, animation: 'fadeUp 0.5s ease 0.1s both', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>

        {/* AVATAR ROW */}
        <div className="profile-avatar-row" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%', flexShrink: 0,
            background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#0A0A0A', fontWeight: '800', fontSize: '32px',
            boxShadow: '0 8px 24px rgba(215,255,62,0.3)',
          }}>
            {profile?.user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h3 style={{ margin: '0 0 4px', fontWeight: '800', fontSize: '20px', color: COLORS.text }}>{profile?.user?.name}</h3>
            <p style={{ margin: 0, color: COLORS.textMuted, fontSize: '14px' }}>{profile?.user?.email}</p>
            <span style={{ display: 'inline-block', marginTop: '6px', background: 'rgba(215,255,62,0.1)', color: COLORS.accent, padding: '3px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', border: `1px solid rgba(215,255,62,0.25)` }}>
              🎓 Student
            </span>
          </div>
        </div>

        {/* NAME FIELD */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: '700', color: COLORS.textMuted, marginBottom: '8px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Full Name</label>
          {editing ? (
            <div className="profile-edit-row" style={{ display: 'flex', gap: '10px' }}>
              <input value={name} onChange={e => setName(e.target.value)}
                style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', fontSize: '15px', border: `2px solid ${COLORS.accent}`, outline: 'none', fontFamily: 'inherit', color: COLORS.text, background: COLORS.cardAlt, boxShadow: '0 0 0 3px rgba(215,255,62,0.1)' }}
              />
              <button onClick={handleSave} disabled={saving} style={{
                padding: '12px 24px', borderRadius: '12px', border: 'none',
                background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`, color: '#0A0A0A',
                fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: '0 4px 12px rgba(215,255,62,0.25)',
              }}>{saving ? 'Saving...' : 'Save'}</button>
              <button onClick={() => { setEditing(false); setName(profile?.user?.name); }} style={{
                padding: '12px 20px', borderRadius: '12px', border: `1px solid ${COLORS.border}`,
                background: COLORS.cardAlt, color: COLORS.textMuted, fontWeight: '700', fontSize: '14px',
                cursor: 'pointer', fontFamily: 'inherit',
              }}>Cancel</button>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: COLORS.cardAlt, borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
              <span style={{ color: COLORS.text, fontSize: '15px', fontWeight: '600' }}>{profile?.user?.name}</span>
              <button onClick={() => setEditing(true)} style={{
                padding: '6px 16px', borderRadius: '8px', border: `1px solid rgba(215,255,62,0.35)`,
                background: 'rgba(215,255,62,0.08)', color: COLORS.accent, fontWeight: '700', fontSize: '13px',
                cursor: 'pointer', fontFamily: 'inherit',
              }}>✏️ Edit</button>
            </div>
          )}
        </div>

        {/* EMAIL */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: '700', color: COLORS.textMuted, marginBottom: '8px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Email Address</label>
          <div style={{ padding: '12px 16px', background: COLORS.cardAlt, borderRadius: '12px', border: `1px solid ${COLORS.border}`, color: COLORS.textMuted, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {profile?.user?.email}
            <span style={{ background: COLORS.successBg, color: COLORS.success, padding: '2px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', border: `1px solid ${COLORS.successBorder}` }}>✓ Verified</span>
          </div>
        </div>

        {/* MEMBER SINCE */}
        <div>
          <label style={{ display: 'block', fontWeight: '700', color: COLORS.textMuted, marginBottom: '8px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Member Since</label>
          <div style={{ padding: '12px 16px', background: COLORS.cardAlt, borderRadius: '12px', border: `1px solid ${COLORS.border}`, color: COLORS.textMuted, fontSize: '15px' }}>
            📅 {profile?.user?.createdAt ? new Date(profile.user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
          </div>
        </div>

        {success && <div style={{ marginTop: '16px', background: COLORS.successBg, border: `1px solid ${COLORS.successBorder}`, borderRadius: '12px', padding: '12px 16px', color: COLORS.success, fontWeight: '600' }}>✅ {success}</div>}
        {error && <div style={{ marginTop: '16px', background: COLORS.errorBg, border: `1px solid ${COLORS.errorBorder}`, borderRadius: '12px', padding: '12px 16px', color: COLORS.error, fontWeight: '600' }}>⚠️ {error}</div>}
      </div>

      {/* STATS */}
      <div className="profile-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', animation: 'fadeUp 0.5s ease 0.2s both' }}>
        {[
          { icon: '📚', label: 'Study Plans', value: profile?.stats?.plans || 0, color: COLORS.accent },
          { icon: '📝', label: 'Quizzes Taken', value: profile?.stats?.quizzes || 0, color: '#60a5fa' },
          { icon: '🔥', label: 'Status', value: 'Active', color: '#4ADE80' },
        ].map((s, i) => (
          <div key={i} style={{ background: COLORS.card, borderRadius: '20px', padding: '20px', textAlign: 'center', border: `1px solid ${COLORS.border}`, boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: s.color }}>{s.value}</div>
            <div style={{ color: COLORS.textMuted, fontSize: '12px', fontWeight: '600', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}