import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Groq from 'groq-sdk';
import User from './models/User.js';
import StudyPlan from './models/StudyPlan.js';
import QuizResult from './models/QuizResult.js';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function auth(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

async function callAI(prompt) {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 4000,
    temperature: 0.7,
  });
  return response.choices[0].message.content;
}

function extractJSON(text) {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/```json/gi, '').replace(/```/g, '').trim();
  const firstBrace = cleaned.search(/[\{\[]/);
  const lastBrace = Math.max(cleaned.lastIndexOf('}'), cleaned.lastIndexOf(']'));
  if (firstBrace !== -1 && lastBrace !== -1) cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  return JSON.parse(cleaned);
}

app.get('/', (req, res) => res.send('SmartEdu AI Backend Running ✅'));

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already registered. Please login.' });
    const user = await User.create({ name, email, password });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('register error:', err.message);
    res.status(500).json({ error: 'Registration failed. Try again.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'All fields required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Email not found. Please register.' });
    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ error: 'Wrong password. Try again.' });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('login error:', err.message);
    res.status(500).json({ error: 'Login failed. Try again.' });
  }
});

app.get('/api/history', auth, async (req, res) => {
  try {
    const plans = await StudyPlan.find({ userId: req.userId }).sort({ createdAt: -1 }).limit(5);
    const quizzes = await QuizResult.find({ userId: req.userId }).sort({ createdAt: -1 }).limit(10);
    res.json({ plans, quizzes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/study-plan', auth, async (req, res) => {
  try {
    const { examName, examDate, expectedMarks, subjects, weakTopics, dailyHours, language, level } = req.body;
    const prompt = `You are an expert educational planner for competitive exams in India.
Create a detailed personalized study plan for:
- Exam: ${examName}
- Exam Date: ${examDate || 'Not specified'}
- Target Score: ${expectedMarks || 'Maximum possible'}
- Subjects: ${subjects}
- Weak Topics: ${weakTopics || 'None'}
- Daily Study Hours: ${dailyHours}
- Current Level: ${level || 'beginner'}
- Language: ${language || 'English'}
Return ONLY valid JSON, no markdown:
{"title":"string","description":"string","totalDuration":"string","weeks":[{"week":1,"title":"string","topics":["string"],"goals":["string"]}]}`;
    const text = await callAI(prompt);
    const data = extractJSON(text);
    await StudyPlan.create({
      userId: req.userId, examName,
      subjects: subjects.split(',').map(s => s.trim()),
      level, dailyHours, planData: data,
    });
    res.json(data);
  } catch (err) {
    console.error('study-plan error:', err.message);
    res.status(500).json({ error: 'Failed to generate study plan', detail: err.message });
  }
});

app.post('/api/resources', auth, async (req, res) => {
  try {
    const { subjects, language } = req.body;
    const prompt = `Suggest learning resources for these subjects: ${subjects}
Language: ${language || 'English'}
Return ONLY valid JSON, no markdown:
{"resources":[{"title":"string","type":"video|article|book|course","subject":"string","description":"string"}]}`;
    const text = await callAI(prompt);
    const data = extractJSON(text);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate resources', detail: err.message });
  }
});

app.post('/api/quiz', auth, async (req, res) => {
  try {
    const { topic, numQuestions, difficulty, language } = req.body;
    const prompt = `Create exactly ${numQuestions || 5} multiple choice questions about: ${topic}
Difficulty: ${difficulty || 'medium'}
Language: ${language || 'English'}
IMPORTANT: Generate EXACTLY ${numQuestions || 5} questions.
Return ONLY valid JSON, no markdown:
{"questions":[{"question":"string","options":["string","string","string","string"],"correctAnswer":"string","explanation":"string"}]}`;
    const text = await callAI(prompt);
    const data = extractJSON(text);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate quiz', detail: err.message });
  }
});

app.post('/api/quiz/result', auth, async (req, res) => {
  try {
    const { subject, score, totalQuestions, difficulty } = req.body;
    await QuizResult.create({ userId: req.userId, subject, score, totalQuestions, difficulty });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/mentor', auth, async (req, res) => {
  try {
    const { message, history, language } = req.body;
    const messages = [
      { role: 'system', content: `You are a friendly AI mentor helping a student. Respond in ${language || 'English'}. Be clear, use numbered points or bullet points. Plain text only.` },
    ];
    if (Array.isArray(history)) {
      history.forEach(h => messages.push({
        role: h.role === 'user' ? 'user' : 'assistant',
        content: h.content
      }));
    }
    messages.push({ role: 'user', content: message });
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    });
    res.json({ reply: response.choices[0].message.content.trim() });
  } catch (err) {
    res.status(500).json({ error: 'AI server error', detail: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));