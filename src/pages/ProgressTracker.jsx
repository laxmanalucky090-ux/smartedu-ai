import { useState, useEffect } from 'react';

const COLORS = {
  bg: '#0A0A0A', card: '#111111', cardAlt: '#181818',
  border: 'rgba(255,255,255,0.08)',
  accent: '#D7FF3E', accentDark: '#A8E000',
  text: '#FFFFFF', textMuted: '#A1A1AA',
  success: '#4ADE80', successBg: 'rgba(74,222,128,0.1)',
  error: '#F87171', errorBg: 'rgba(248,113,113,0.1)',
};

export default function ProgressPage({ progress }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const avgScore = progress.quizScores.length > 0
    ? Math.round(progress.quizScores.reduce((a, b) => a + b, 0) / progress.quizScores.length)
    : 0;

  const overall = Math.round(
    (progress.studyPlanGenerated ? 33 : 0) +
    (Math.min(progress.quizzesCompleted, 3) / 3 * 34) +
    (avgScore * 0.33)
  );

  const bar = (val, color) => (
    <div style={{ background: COLORS.cardAlt, borderRadius: '99px', height: '8px', overflow: 'hidden', marginTop: '10px', border: `1px solid ${COLORS.border}` }}>
      <div style={{ width: `${val}%`, background: color, height: '100%', borderRadius: '99px', transition: 'width 1s ease' }} />
    </div>
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", maxWidth: '900px', margin: '0 auto' }}>
      <style>{`@keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }`}</style>

      <div style={{ marginBottom: '20px', animation: 'fadeUp 0.4s ease' }}>
        <h2 style={{ margin: '0 0 4px', fontWeight: '800', fontSize: isMobile ? '22px' : '28px', background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>📊 Progress Tracker</h2>
        <p style={{ margin: 0, color: COLORS.textMuted, fontSize: '14px' }}>Track your learning journey</p>
      </div>

      {/* OVERALL PROGRESS */}
      <div style={{
        background: COLORS.card,
        borderRadius: '20px', padding: isMobile ? '24px' : '32px 40px', marginBottom: '16px',
        display: 'flex', alignItems: 'center', gap: isMobile ? '20px' : '40px',
        animation: 'fadeUp 0.5s ease 0.1s both',
        border: `1px solid ${COLORS.border}`,
        flexDirection: isMobile ? 'column' : 'row',
        textAlign: isMobile ? 'center' : 'left',
      }}>
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{
            width: isMobile ? '100px' : '120px',
            height: isMobile ? '100px' : '120px',
            borderRadius: '50%',
            background: `conic-gradient(${COLORS.accent} ${overall * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 0 8px rgba(215,255,62,0.08)`,
            margin: isMobile ? '0 auto' : '0',
          }}>
            <div style={{
              width: isMobile ? '74px' : '90px',
              height: isMobile ? '74px' : '90px',
              borderRadius: '50%', background: COLORS.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
            }}>
              <span style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '900', color: COLORS.text }}>{overall}%</span>
            </div>
          </div>
        </div>
        <div>
          <p style={{ margin: '0 0 6px', color: COLORS.accent, fontSize: '12px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>OVERALL PROGRESS</p>
          <h2 style={{ margin: '0 0 8px', fontSize: isMobile ? '18px' : '24px', fontWeight: '800', color: COLORS.text }}>
            {overall < 30 ? 'Just Getting Started 🚀' : overall < 60 ? 'Making Progress 📈' : overall < 90 ? 'Almost There! 🔥' : 'Outstanding! 🏆'}
          </h2>
          <p style={{ margin: 0, color: COLORS.textMuted, fontSize: '14px', lineHeight: 1.6 }}>
            {overall < 30 ? 'Generate a study plan and take some quizzes to get started!' : 'You are doing great! Keep up the momentum.'}
          </p>
        </div>
      </div>

      {/* CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        {/* STUDY PLAN CARD */}
        <div style={{ background: COLORS.card, borderRadius: '16px', padding: '20px', border: `1px solid ${COLORS.border}`, animation: 'fadeUp 0.5s ease 0.2s both' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontWeight: '800', color: COLORS.text, fontSize: '15px' }}>📚 Study Plan</h3>
            <span style={{
              padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
              background: progress.studyPlanGenerated ? COLORS.successBg : COLORS.errorBg,
              color: progress.studyPlanGenerated ? COLORS.success : COLORS.error,
            }}>
              {progress.studyPlanGenerated ? '✅ Done' : '❌ Pending'}
            </span>
          </div>
          <p style={{ margin: '0 0 10px', color: COLORS.textMuted, fontSize: '13px', lineHeight: 1.6 }}>
            {progress.studyPlanGenerated ? 'Your personalized study plan has been generated!' : 'Generate your study plan to get started.'}
          </p>
          {bar(progress.studyPlanGenerated ? 100 : 0, `linear-gradient(90deg, ${COLORS.accentDark}, ${COLORS.accent})`)}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
            <span style={{ fontSize: '12px', color: COLORS.textMuted }}>Progress</span>
            <span style={{ fontSize: '12px', fontWeight: '700', color: COLORS.accent }}>{progress.studyPlanGenerated ? '100%' : '0%'}</span>
          </div>
        </div>

        {/* QUIZZES CARD */}
        <div style={{ background: COLORS.card, borderRadius: '16px', padding: '20px', border: `1px solid ${COLORS.border}`, animation: 'fadeUp 0.5s ease 0.3s both' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontWeight: '800', color: COLORS.text, fontSize: '15px' }}>📝 Quizzes</h3>
            <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', background: 'rgba(215,255,62,0.12)', color: COLORS.accent }}>
              {progress.quizzesCompleted} done
            </span>
          </div>
          <p style={{ margin: '0 0 10px', color: COLORS.textMuted, fontSize: '13px', lineHeight: 1.6 }}>
            {progress.quizzesCompleted === 0 ? 'Take your first quiz to test your knowledge.' : `You've completed ${progress.quizzesCompleted} quiz${progress.quizzesCompleted > 1 ? 'zes' : ''}. Keep going!`}
          </p>
          {bar(Math.min(progress.quizzesCompleted * 33, 100), `linear-gradient(90deg, ${COLORS.accentDark}, ${COLORS.accent})`)}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
            <span style={{ fontSize: '12px', color: COLORS.textMuted }}>Progress</span>
            <span style={{ fontSize: '12px', fontWeight: '700', color: COLORS.accent }}>{Math.min(progress.quizzesCompleted * 33, 100)}%</span>
          </div>
        </div>
      </div>

      {/* QUIZ SCORES */}
      <div style={{ background: COLORS.card, borderRadius: '16px', padding: '20px', border: `1px solid ${COLORS.border}`, animation: 'fadeUp 0.5s ease 0.4s both', marginBottom: isMobile ? '80px' : '0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <h3 style={{ margin: 0, fontWeight: '800', color: COLORS.text, fontSize: '15px' }}>🏆 Quiz Score History</h3>
          {progress.quizScores.length > 0 && (
            <span style={{ padding: '5px 14px', borderRadius: '20px', fontWeight: '700', fontSize: '13px', background: avgScore >= 70 ? COLORS.successBg : COLORS.errorBg, color: avgScore >= 70 ? COLORS.success : COLORS.error }}>
              Avg: {avgScore}% {avgScore >= 70 ? '🎉' : '📖'}
            </span>
          )}
        </div>

        {progress.quizScores.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 20px' }}>
            <div style={{ fontSize: '44px', marginBottom: '12px' }}>📝</div>
            <p style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: '700', color: COLORS.text }}>No quizzes taken yet</p>
            <p style={{ margin: 0, color: COLORS.textMuted, fontSize: '13px' }}>Go to Quiz page and test your knowledge!</p>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {progress.quizScores.map((s, i) => (
                <div key={i} style={{
                  background: s >= 70 ? COLORS.successBg : COLORS.errorBg,
                  borderRadius: '14px', padding: '14px 16px', textAlign: 'center', minWidth: '76px',
                  border: `2px solid ${s >= 70 ? 'rgba(74,222,128,0.35)' : 'rgba(248,113,113,0.35)'}`,
                }}>
                  <div style={{ fontWeight: '800', fontSize: '20px', color: s >= 70 ? COLORS.success : COLORS.error }}>{s}%</div>
                  <div style={{ fontSize: '11px', color: COLORS.textMuted, marginTop: '2px', fontWeight: '600' }}>Quiz {i + 1}</div>
                  <div style={{ fontSize: '14px', marginTop: '4px' }}>{s >= 70 ? '🎉' : '📖'}</div>
                </div>
              ))}
            </div>
            <div style={{ background: COLORS.cardAlt, borderRadius: '12px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `1px solid ${COLORS.border}` }}>
              <div>
                <p style={{ margin: '0 0 2px', fontWeight: '700', color: COLORS.text, fontSize: '14px' }}>Average: {avgScore}%</p>
                <p style={{ margin: 0, color: COLORS.textMuted, fontSize: '12px' }}>{avgScore >= 70 ? '🎉 Excellent! Keep it up!' : '📖 Keep practicing!'}</p>
              </div>
              <div style={{ fontSize: '28px' }}>{avgScore >= 90 ? '🏆' : avgScore >= 70 ? '⭐' : '💪'}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}