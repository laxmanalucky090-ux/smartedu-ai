import { useState, useEffect } from 'react';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudyPlannerPage from './pages/StudyPlan';
import QuizPage from './pages/Quiz';
import AIMentorPage from './pages/AIMentor';
import ProgressPage from './pages/ProgressTracker';
import StudyHistoryPage from './pages/StudyHistory';
import QuizHistoryPage from './pages/QuizHistory';
import ChatHistoryPage from './pages/ChatHistory';
import FeedbackPage from './pages/Feedback';
import ProfilePage from './pages/Profile';
import { LANGUAGES, removeToken, getUserHistory } from './utils/gemini';

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('dashboard');
  const [language, setLanguage] = useState('English');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mentorMessages, setMentorMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your AI Mentor 🎓\n\nAsk me anything about your studies — concepts, problems, exam tips, anything!\n\nI am here to help you 24/7.' }
  ]);
  const [progress, setProgress] = useState({
    studyPlanGenerated: false,
    quizzesCompleted: 0,
    quizScores: [],
  });

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!user) return;
    getUserHistory().then(data => {
      if (data.plans?.length > 0) setProgress(p => ({ ...p, studyPlanGenerated: true }));
      if (data.quizzes?.length > 0) setProgress(p => ({
        ...p,
        quizzesCompleted: data.quizzes.length,
        quizScores: data.quizzes.map(q => Math.round((q.score / q.totalQuestions) * 100)),
      }));
    }).catch(() => {});
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    removeToken();
    setProgress({ studyPlanGenerated: false, quizzesCompleted: 0, quizScores: [] });
    setMentorMessages([{ role: 'assistant', content: 'Hello! I am your AI Mentor 🎓\n\nAsk me anything about your studies — concepts, problems, exam tips, anything!\n\nI am here to help you 24/7.' }]);
  };

  const navigateTo = (id) => {
    setPage(id);
    if (isMobile) setSidebarOpen(false);
  };

  if (!user) return <LoginPage onLogin={setUser} />;

  const navItems = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
    { id: 'study', icon: '📚', label: 'Study Plan' },
    { id: 'quiz', icon: '📝', label: 'Quiz' },
    { id: 'mentor', icon: '🤖', label: 'AI Mentor' },
    { id: 'progress', icon: '📊', label: 'Progress' },
  ];

  const secondaryItems = [
    { id: 'studyHistory', icon: '📋', label: 'Study History' },
    { id: 'quizHistory', icon: '🏆', label: 'Quiz History' },
    { id: 'chatHistory', icon: '💬', label: 'Chat History' },
    { id: 'feedback', icon: '📩', label: 'Feedback' },
  ];

  const allItems = [...navItems, ...secondaryItems, { id: 'profile', icon: '👤', label: 'My Profile' }];
  const currentPage = allItems.find(i => i.id === page);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif", background: '#f4f6fb' }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideInLeft { from{opacity:0;transform:translateX(-100%)} to{opacity:1;transform:translateX(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #c4b5fd; border-radius: 99px; }
        .nav-btn { transition: all 0.2s !important; }
        .nav-btn:hover { background: rgba(124,58,237,0.08) !important; color: #7c3aed !important; }
        .nav-btn.active { background: linear-gradient(135deg, #7c3aed, #2563eb) !important; color: white !important; box-shadow: 0 4px 15px rgba(124,58,237,0.35) !important; }
        @media (max-width: 768px) {
          .mobile-grid-2 { grid-template-columns: 1fr 1fr !important; }
          .mobile-grid-1 { grid-template-columns: 1fr !important; }
          .mobile-hide { display: none !important; }
          .mobile-full { width: 100% !important; }
        }
      `}</style>

      {/* MOBILE OVERLAY */}
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          zIndex: 90, backdropFilter: 'blur(2px)',
        }} />
      )}

      {/* SIDEBAR */}
      <div style={{
        width: '240px',
        minHeight: '100vh',
        background: 'white',
        borderRight: '1px solid #ede9fe',
        display: 'flex',
        flexDirection: 'column',
        position: isMobile ? 'fixed' : 'sticky',
        top: 0,
        left: 0,
        height: '100vh',
        overflow: 'hidden',
        boxShadow: isMobile ? '8px 0 32px rgba(0,0,0,0.15)' : '4px 0 24px rgba(124,58,237,0.04)',
        flexShrink: 0,
        zIndex: 100,
        transform: isMobile ? (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {/* LOGO */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '68px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0, boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}>🎓</div>
            <span style={{ fontWeight: '800', fontSize: '17px', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', whiteSpace: 'nowrap' }}>SmartEdu AI</span>
          </div>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b', padding: '4px' }}>✕</button>
          )}
        </div>

        {/* NAV */}
        <div style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
          <p style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '8px 8px 8px' }}>MAIN</p>
          {navItems.map(item => (
            <button key={item.id} className={`nav-btn ${page === item.id ? 'active' : ''}`}
              onClick={() => navigateTo(item.id)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 14px', borderRadius: '12px',
                border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                fontSize: '14px', fontWeight: '600', marginBottom: '4px',
                background: 'transparent', color: '#64748b',
              }}>
              <span style={{ fontSize: '18px', flexShrink: 0 }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}

          <p style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '16px 8px 8px' }}>HISTORY</p>
          {secondaryItems.map(item => (
            <button key={item.id} className={`nav-btn ${page === item.id ? 'active' : ''}`}
              onClick={() => navigateTo(item.id)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 14px', borderRadius: '12px',
                border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                fontSize: '14px', fontWeight: '600', marginBottom: '4px',
                background: 'transparent', color: '#64748b',
              }}>
              <span style={{ fontSize: '18px', flexShrink: 0 }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* USER BOTTOM */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid #f1f5f9' }}>
          <button className={`nav-btn ${page === 'profile' ? 'active' : ''}`}
            onClick={() => navigateTo('profile')} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 14px', borderRadius: '12px',
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: '14px', fontWeight: '600', marginBottom: '4px',
              background: 'transparent', color: '#64748b',
            }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '13px', flexShrink: 0 }}>
              {user.name[0].toUpperCase()}
            </div>
            <span>{user.name}</span>
          </button>
          <button className="nav-btn" onClick={handleLogout} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 14px', borderRadius: '12px',
            border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            fontSize: '14px', fontWeight: '600',
            background: 'transparent', color: '#ef4444',
          }}>
            <span style={{ fontSize: '18px', flexShrink: 0 }}>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'hidden', minWidth: 0 }}>

        {/* TOP BAR */}
        <div style={{
          height: '64px', background: 'white', borderBottom: '1px solid #ede9fe',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px', position: 'sticky', top: 0, zIndex: 40,
          boxShadow: '0 2px 12px rgba(124,58,237,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
              width: '38px', height: '38px', borderRadius: '10px', border: '1px solid #e0e7ff',
              background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '18px', color: '#7c3aed', flexShrink: 0,
            }}>☰</button>
            <h1 style={{ margin: 0, fontWeight: '800', fontSize: isMobile ? '15px' : '18px', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentPage?.icon} {currentPage?.label}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {!isMobile && (
              <select value={language} onChange={e => setLanguage(e.target.value)} style={{
                padding: '7px 12px', borderRadius: '10px', border: '1px solid #e0e7ff',
                background: 'white', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', color: '#374151', outline: 'none',
              }}>
                {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
              </select>
            )}
            <button onClick={() => navigateTo('profile')} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
              border: '1px solid #c4b5fd', borderRadius: '12px',
              padding: '7px 12px', cursor: 'pointer', fontFamily: 'inherit',
            }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '12px' }}>
                {user.name[0].toUpperCase()}
              </div>
              {!isMobile && <span style={{ fontWeight: '600', color: '#4c1d95', fontSize: '13px' }}>{user.name}</span>}
            </button>
          </div>
        </div>

        {/* PAGE CONTENT */}
        <div style={{ flex: 1, padding: isMobile ? '16px' : '28px', overflowY: 'auto' }}>
          {page === 'dashboard' && <Dashboard setPage={setPage} user={user} progress={progress} />}
          {page === 'study' && <StudyPlannerPage language={language} progress={progress} setProgress={setProgress} />}
          {page === 'quiz' && <QuizPage language={language} progress={progress} setProgress={setProgress} />}
          {page === 'mentor' && <AIMentorPage language={language} messages={mentorMessages} setMessages={setMentorMessages} />}
          {page === 'progress' && <ProgressPage progress={progress} />}
          {page === 'studyHistory' && <StudyHistoryPage />}
          {page === 'quizHistory' && <QuizHistoryPage />}
          {page === 'chatHistory' && <ChatHistoryPage />}
          {page === 'feedback' && <FeedbackPage user={user} />}
          {page === 'profile' && <ProfilePage user={user} setUser={setUser} />}
        </div>

        {/* MOBILE BOTTOM NAV */}
        {isMobile && (
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            background: 'white', borderTop: '1px solid #ede9fe',
            display: 'flex', justifyContent: 'space-around', alignItems: 'center',
            padding: '8px 0 12px', zIndex: 80,
            boxShadow: '0 -4px 20px rgba(124,58,237,0.08)',
          }}>
            {navItems.map(item => (
              <button key={item.id} onClick={() => navigateTo(item.id)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
                background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px',
                borderRadius: '12px', fontFamily: 'inherit', minWidth: '52px',
              }}>
                <span style={{ fontSize: '22px' }}>{item.icon}</span>
                <span style={{ fontSize: '10px', fontWeight: page === item.id ? '700' : '500', color: page === item.id ? '#7c3aed' : '#94a3b8' }}>
                  {item.label.split(' ')[0]}
                </span>
                {page === item.id && <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#7c3aed' }} />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}