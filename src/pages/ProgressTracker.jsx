export default function ProgressPage({ progress }) {
  const avgScore = progress.quizScores.length > 0
    ? Math.round(progress.quizScores.reduce((a, b) => a + b, 0) / progress.quizScores.length)
    : 0;

  const overall = Math.round(
    (progress.studyPlanGenerated ? 33 : 0) +
    (Math.min(progress.quizzesCompleted, 3) / 3 * 34) +
    (avgScore * 0.33)
  );

  const bar = (val, color) => (
    <div style={{ background: '#e2e8f0', borderRadius: '99px', height: '10px', overflow: 'hidden', marginTop: '10px' }}>
      <div style={{ width: `${val}%`, background: color, height: '100%', borderRadius: '99px', transition: 'width 1s ease' }} />
    </div>
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`}</style>

      <div style={{ marginBottom: '24px', animation: 'fadeUp 0.4s ease' }}>
        <h2 style={{ margin: '0 0 4px', fontWeight: '800', fontSize: '28px', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>📊 Progress Tracker</h2>
        <p style={{ margin: 0, color: '#64748b' }}>Track your learning journey</p>
      </div>

      {/* OVERALL PROGRESS */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
        borderRadius: '24px', padding: '36px 40px', marginBottom: '24px',
        display: 'flex', alignItems: 'center', gap: '40px',
        animation: 'fadeUp 0.5s ease 0.1s both',
        boxShadow: '0 8px 32px rgba(49,46,129,0.3)',
      }}>
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{
            width: '120px', height: '120px', borderRadius: '50%',
            background: `conic-gradient(#a78bfa ${overall * 3.6}deg, rgba(255,255,255,0.1) 0deg)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 0 8px rgba(167,139,250,0.1)',
          }}>
            <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: '#1e1b4b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <span style={{ fontSize: '24px', fontWeight: '900', color: 'white' }}>{overall}%</span>
            </div>
          </div>
        </div>
        <div>
          <p style={{ margin: '0 0 6px', color: '#a78bfa', fontSize: '13px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>OVERALL PROGRESS</p>
          <h2 style={{ margin: '0 0 10px', fontSize: '28px', fontWeight: '800', color: 'white' }}>
            {overall < 30 ? 'Just Getting Started 🚀' : overall < 60 ? 'Making Progress 📈' : overall < 90 ? 'Almost There! 🔥' : 'Outstanding! 🏆'}
          </h2>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.65)', fontSize: '15px', lineHeight: 1.6 }}>
            {overall < 30 ? 'Generate a study plan and take some quizzes to get started!' : 'You are doing great! Keep up the momentum.'}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* STUDY PLAN CARD */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #e0e7ff', animation: 'fadeUp 0.5s ease 0.2s both' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontWeight: '800', color: '#1e293b', fontSize: '17px' }}>📚 Study Plan</h3>
            <span style={{
              padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
              background: progress.studyPlanGenerated ? '#dcfce7' : '#fee2e2',
              color: progress.studyPlanGenerated ? '#15803d' : '#dc2626',
            }}>
              {progress.studyPlanGenerated ? '✅ Done' : '❌ Pending'}
            </span>
          </div>
          <p style={{ margin: '0 0 12px', color: '#475569', fontSize: '14px', lineHeight: 1.6 }}>
            {progress.studyPlanGenerated ? 'Your personalized study plan has been generated!' : 'Generate your study plan to get started on your journey.'}
          </p>
          {bar(progress.studyPlanGenerated ? 100 : 0, 'linear-gradient(90deg, #7c3aed, #2563eb)')}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Progress</span>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#7c3aed' }}>{progress.studyPlanGenerated ? '100%' : '0%'}</span>
          </div>
        </div>

        {/* QUIZZES CARD */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #e0e7ff', animation: 'fadeUp 0.5s ease 0.3s both' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontWeight: '800', color: '#1e293b', fontSize: '17px' }}>📝 Quizzes</h3>
            <span style={{ padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', background: '#fef3c7', color: '#d97706' }}>
              {progress.quizzesCompleted} done
            </span>
          </div>
          <p style={{ margin: '0 0 12px', color: '#475569', fontSize: '14px', lineHeight: 1.6 }}>
            {progress.quizzesCompleted === 0 ? 'Take your first quiz to test your knowledge and track scores.' : `You have completed ${progress.quizzesCompleted} quiz${progress.quizzesCompleted > 1 ? 'zes' : ''}. Keep going!`}
          </p>
          {bar(Math.min(progress.quizzesCompleted * 33, 100), 'linear-gradient(90deg, #f59e0b, #f97316)')}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Progress</span>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#f59e0b' }}>{Math.min(progress.quizzesCompleted * 33, 100)}%</span>
          </div>
        </div>
      </div>

      {/* QUIZ SCORE HISTORY */}
      <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #e0e7ff', animation: 'fadeUp 0.5s ease 0.4s both' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontWeight: '800', color: '#1e293b', fontSize: '17px' }}>🏆 Quiz Score History</h3>
          {progress.quizScores.length > 0 && (
            <span style={{ padding: '6px 16px', borderRadius: '20px', fontWeight: '700', fontSize: '14px', background: avgScore >= 70 ? '#dcfce7' : '#fee2e2', color: avgScore >= 70 ? '#15803d' : '#dc2626' }}>
              Avg: {avgScore}% {avgScore >= 70 ? '🎉' : '📖'}
            </span>
          )}
        </div>

        {progress.quizScores.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '52px', marginBottom: '16px' }}>📝</div>
            <p style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: '700', color: '#1e293b' }}>No quizzes taken yet</p>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Go to the Quiz page and test your knowledge!</p>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {progress.quizScores.map((s, i) => (
                <div key={i} style={{
                  background: s >= 70 ? 'linear-gradient(135deg, #dcfce7, #bbf7d0)' : 'linear-gradient(135deg, #fee2e2, #fecaca)',
                  borderRadius: '16px', padding: '18px 22px', textAlign: 'center', minWidth: '90px',
                  border: `2px solid ${s >= 70 ? '#86efac' : '#fca5a5'}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}>
                  <div style={{ fontWeight: '800', fontSize: '26px', color: s >= 70 ? '#15803d' : '#dc2626' }}>{s}%</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', fontWeight: '600' }}>Quiz {i + 1}</div>
                  <div style={{ fontSize: '16px', marginTop: '4px' }}>{s >= 70 ? '🎉' : '📖'}</div>
                </div>
              ))}
            </div>
            <div style={{ background: 'linear-gradient(135deg, #f0f4ff, #f8f0ff)', borderRadius: '14px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: '0 0 2px', fontWeight: '700', color: '#1e293b' }}>Average Score: {avgScore}%</p>
                <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>{avgScore >= 70 ? '🎉 Excellent performance! Keep it up!' : '📖 Keep practicing to improve your scores!'}</p>
              </div>
              <div style={{ fontSize: '36px' }}>{avgScore >= 90 ? '🏆' : avgScore >= 70 ? '⭐' : '💪'}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}