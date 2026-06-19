import { useState, useEffect } from 'react';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudyPlannerPage from './pages/StudyPlan';
import QuizPage from './pages/Quiz';
import AIMentorPage from './pages/AIMentor';
import ProgressPage from './pages/ProgressTracker';
import { LANGUAGES, getUserHistory } from './utils/gemini';

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('dashboard');
  const [language, setLanguage] = useState('English');
  const [mentorMessages, setMentorMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your AI Mentor 🎓\n\nAsk me anything about your studies — concepts, problems, exam tips, anything!\n\nI am here to help you 24/7.' }
  ]);
  const [progress, setProgress] = useState({
    studyPlanGenerated: false,
    quizzesCompleted: 0,
    quizScores: [],
    tasksCompleted: [],
  });

  // Load history from backend after login
  useEffect(() => {
    if (!user) return;
    getUserHistory().then(data => {
      if (data.plans && data.plans.length > 0) {
        setProgress(p => ({ ...p, studyPlanGenerated: true }));
      }
      if (data.quizzes && data.quizzes.length > 0) {
        setProgress(p => ({
          ...p,
          quizzesCompleted: data.quizzes.length,
          quizScores: data.quizzes.map(q => Math.round((q.score / q.totalQuestions) * 100)),
        }));
      }
    }).catch(() => {});
  }, [user]);

  if (!user) return <LoginPage onLogin={setUser} />;

  const navItems = [
    { id: 'dashboard', label: '🏠 Home' },
    { id: 'study', label: '📚 Study Plan' },
    { id: 'quiz', label: '📝 Quiz' },
    { id: 'mentor', label: '🤖 AI Mentor' },
    { id: 'progress', label: '📊 Progress' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0fdf4 100%)', fontFamily: "'Segoe UI', sans-serif" }}>
      <style>{`
        @keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #c4b5fd; border-radius: 99px; }
      `}</style>

      <nav style={{
        background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(124,58,237,0.1)',
        padding: '0 32px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: '68px',
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 4px 24px rgba(124,58,237,0.06)',
        animation: 'slideDown 0.4s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🎓</div>
          <span style={{ fontWeight: '800', fontSize: '20px', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SmartEdu AI</span>
        </div>

        <div style={{ display: 'flex', gap: '4px', background: '#f8faff', padding: '5px', borderRadius: '14px', border: '1px solid #e0e7ff' }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setPage(item.id)} style={{
              padding: '8px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              fontWeight: page === item.id ? '700' : '500', fontSize: '14px',
              background: page === item.id ? 'linear-gradient(135deg, #7c3aed, #2563eb)' : 'transparent',
              color: page === item.id ? 'white' : '#64748b',
              transition: 'all 0.2s', fontFamily: 'inherit',
              boxShadow: page === item.id ? '0 4px 12px rgba(124,58,237,0.3)' : 'none',
            }}>
              {item.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select value={language} onChange={e => setLanguage(e.target.value)} style={{
            padding: '8px 12px', borderRadius: '10px', border: '1px solid #e0e7ff',
            background: 'white', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', color: '#374151', outline: 'none',
          }}>
            {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)', padding: '8px 14px', borderRadius: '12px', border: '1px solid #c4b5fd' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '13px' }}>
              {user.name[0].toUpperCase()}
            </div>
            <span style={{ fontWeight: '600', color: '#4c1d95', fontSize: '14px' }}>{user.name}</span>
          </div>

          <button onClick={() => { setUser(null); setMentorMessages([{ role: 'assistant', content: 'Hello! I am your AI Mentor 🎓\n\nAsk me anything about your studies — concepts, problems, exam tips, anything!\n\nI am here to help you 24/7.' }]); }} style={{
            padding: '8px 16px', borderRadius: '10px', border: '1px solid #fecdd3',
            background: '#fff1f2', color: '#e11d48', cursor: 'pointer', fontSize: '14px',
            fontWeight: '600', fontFamily: 'inherit', transition: 'all 0.2s',
          }}
            onMouseOver={e => { e.currentTarget.style.background = '#ffe4e6'; }}
            onMouseOut={e => { e.currentTarget.style.background = '#fff1f2'; }}
          >
            Logout
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        {page === 'dashboard' && <Dashboard setPage={setPage} user={user} progress={progress} />}
        {page === 'study' && <StudyPlannerPage language={language} progress={progress} setProgress={setProgress} />}
        {page === 'quiz' && <QuizPage language={language} progress={progress} setProgress={setProgress} />}
        {page === 'mentor' && <AIMentorPage language={language} messages={mentorMessages} setMessages={setMentorMessages} />}
        {page === 'progress' && <ProgressPage progress={progress} />}
      </div>
    </div>
  );
}