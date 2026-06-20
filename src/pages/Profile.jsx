import { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../utils/gemini';

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
      <div style={{ width: '40px', height: '40px', border: '4px solid #ede9fe', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to{transform:rotate(360deg)} }`}</style>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", maxWidth: '700px', margin: '0 auto' }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>

      {/* HEADER */}
      <div style={{ marginBottom: '28px', animation: 'fadeUp 0.4s ease' }}>
        <h2 style={{ margin: '0 0 4px', fontWeight: '800', fontSize: '28px', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>👤 My Profile</h2>
        <p style={{ margin: 0, color: '#64748b' }}>Manage your account and view your stats</p>
      </div>

      {/* PROFILE CARD */}
      <div style={{ background: 'white', borderRadius: '24px', padding: '36px', marginBottom: '20px', boxShadow: '0 4px 24px rgba(124,58,237,0.08)', border: '1px solid #ede9fe', animation: 'fadeUp 0.5s ease 0.1s both' }}>
        
        {/* AVATAR */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: '800', fontSize: '32px',
            boxShadow: '0 8px 24px rgba(124,58,237,0.4)',
          }}>
            {profile?.user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h3 style={{ margin: '0 0 4px', fontWeight: '800', fontSize: '22px', color: '#1e293b' }}>{profile?.user?.name}</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>{profile?.user?.email}</p>
            <span style={{ display: 'inline-block', marginTop: '6px', background: 'linear-gradient(135deg, #ede9fe, #dbeafe)', color: '#4c1d95', padding: '3px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
              🎓 Student
            </span>
          </div>
        </div>

        {/* EDIT FORM */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'block', fontWeight: '700', color: '#1e293b', marginBottom: '10px', fontSize: '15px' }}>Full Name</label>
          {editing ? (
            <div style={{ display: 'flex', gap: '10px' }}>
              <input value={name} onChange={e => setName(e.target.value)}
                style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', fontSize: '15px', border: '2px solid #7c3aed', outline: 'none', fontFamily: 'inherit', color: '#1e293b', boxShadow: '0 0 0 3px rgba(124,58,237,0.1)' }}
              />
              <button onClick={handleSave} disabled={saving} style={{
                padding: '12px 24px', borderRadius: '12px', border: 'none',
                background: 'linear-gradient(135deg, #7c3aed, #2563eb)', color: 'white',
                fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit',
              }}>{saving ? 'Saving...' : 'Save'}</button>
              <button onClick={() => { setEditing(false); setName(profile?.user?.name); }} style={{
                padding: '12px 20px', borderRadius: '12px', border: '2px solid #e2e8f0',
                background: 'white', color: '#64748b', fontWeight: '700', fontSize: '14px',
                cursor: 'pointer', fontFamily: 'inherit',
              }}>Cancel</button>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8faff', borderRadius: '12px', border: '2px solid #e2e8f0' }}>
              <span style={{ color: '#1e293b', fontSize: '15px', fontWeight: '600' }}>{profile?.user?.name}</span>
              <button onClick={() => setEditing(true)} style={{
                padding: '6px 16px', borderRadius: '8px', border: '1px solid #c4b5fd',
                background: '#f5f3ff', color: '#7c3aed', fontWeight: '700', fontSize: '13px',
                cursor: 'pointer', fontFamily: 'inherit',
              }}>✏️ Edit</button>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'block', fontWeight: '700', color: '#1e293b', marginBottom: '10px', fontSize: '15px' }}>Email Address</label>
          <div style={{ padding: '12px 16px', background: '#f8faff', borderRadius: '12px', border: '2px solid #e2e8f0', color: '#64748b', fontSize: '15px' }}>
            {profile?.user?.email}
            <span style={{ marginLeft: '8px', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '700' }}>Verified</span>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: '700', color: '#1e293b', marginBottom: '10px', fontSize: '15px' }}>Member Since</label>
          <div style={{ padding: '12px 16px', background: '#f8faff', borderRadius: '12px', border: '2px solid #e2e8f0', color: '#64748b', fontSize: '15px' }}>
            📅 {profile?.user?.createdAt ? new Date(profile.user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
          </div>
        </div>

        {success && (
          <div style={{ marginTop: '16px', background: '#dcfce7', border: '1px solid #86efac', borderRadius: '12px', padding: '12px 16px', color: '#15803d', fontWeight: '600' }}>
            ✅ {success}
          </div>
        )}
        {error && (
          <div style={{ marginTop: '16px', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '12px', padding: '12px 16px', color: '#dc2626', fontWeight: '600' }}>
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* STATS CARD */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', animation: 'fadeUp 0.5s ease 0.2s both' }}>
        {[
          { icon: '📚', label: 'Study Plans', value: profile?.stats?.plans || 0, color: '#7c3aed', bg: '#f5f3ff' },
          { icon: '📝', label: 'Quizzes Taken', value: profile?.stats?.quizzes || 0, color: '#2563eb', bg: '#eff6ff' },
          { icon: '🎯', label: 'Learning Streak', value: '🔥 Active', color: '#16a34a', bg: '#f0fdf4' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'white', borderRadius: '20px', padding: '24px', textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: `1px solid ${s.bg}` }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{s.icon}</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: s.color }}>{s.value}</div>
            <div style={{ color: '#64748b', fontSize: '13px', fontWeight: '600', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}