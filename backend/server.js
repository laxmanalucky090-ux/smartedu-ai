import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Groq from 'groq-sdk';
import User from './models/User.js';
import StudyPlan from './models/StudyPlan.js';
import QuizResult from './models/QuizResult.js';
import ChatHistory from './models/ChatHistory.js';
import Feedback from './models/Feedback.js';

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

// ===== AUTH =====
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already registered. Please login.' });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('register error:', err.message);
    res.status(500).json({ error: 'Registration failed. Try again.', detail: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'All fields required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Email not found. Please register.' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Wrong password. Try again.' });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('login error:', err.message);
    res.status(500).json({ error: 'Login failed. Try again.', detail: err.message });
  }
});

// ===== STUDY PLAN =====
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
    const saved = await StudyPlan.create({
      userId: req.userId, examName,
      subjects: subjects.split(',').map(s => s.trim()),
      level, dailyHours, planData: data,
    });
    res.json({ ...data, _id: saved._id });
  } catch (err) {
    console.error('study-plan error:', err.message);
    res.status(500).json({ error: 'Failed to generate study plan', detail: err.message });
  }
});

app.get('/api/study-plan/history', auth, async (req, res) => {
  try {
    const plans = await StudyPlan.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ plans });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/study-plan/:id', auth, async (req, res) => {
  try {
    const plan = await StudyPlan.findOne({ _id: req.params.id, userId: req.userId });
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/study-plan/:id', auth, async (req, res) => {
  try {
    const result = await StudyPlan.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!result) return res.status(404).json({ error: 'Plan not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== RESOURCES =====
app.post('/api/resources', auth, async (req, res) => {
  try {
    const { subjects, examName, language } = req.body;
    const prompt = `You are an expert exam resource curator for Indian competitive exams.

Suggest REAL, well-known, specific learning resources for ${examName ? `the exam "${examName}"` : 'these subjects'} covering: ${subjects}

Give EXACT, specific resource names that genuinely exist and are commonly recommended:
- Real book titles with real author names (e.g. "Concepts of Physics by H.C. Verma", "NCERT Mathematics Class 12")
- Real, well-known YouTube channel names relevant to ${examName || 'this exam'} in India (e.g. "Physics Wallah", "Unacademy", "Khan Academy")
- Real official websites or platforms (e.g. NCERT, NPTEL, official exam board sites)

Language: ${language || 'English'}

Return ONLY valid JSON, no markdown:
{"resources":[{"title":"exact real name of book/channel/website","type":"book|youtube|website|course","subject":"string","description":"string explaining why this helps for the exam"}]}`;
    const text = await callAI(prompt);
    const data = extractJSON(text);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate resources', detail: err.message });
  }
});

// ===== QUIZ =====
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
    const { subject, score, totalQuestions, difficulty, questions, userAnswers } = req.body;
    const saved = await QuizResult.create({
      userId: req.userId, subject, score, totalQuestions, difficulty, questions, userAnswers
    });
    res.json({ success: true, _id: saved._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/quiz/history', auth, async (req, res) => {
  try {
    const quizzes = await QuizResult.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ quizzes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/quiz/:id', auth, async (req, res) => {
  try {
    const result = await QuizResult.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!result) return res.status(404).json({ error: 'Quiz not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ===== PYQs (Previous Year Questions) =====
app.post('/api/pyqs', auth, async (req, res) => {
  try {
    const { examName, subject, numQuestions, language } = req.body;
    const prompt = `You are an expert in Indian competitive exams. Generate exactly ${numQuestions || 5} realistic previous-year-style exam questions for:
- Exam: ${examName}
- Subject: ${subject}
- Language: ${language || 'English'}

These should match the actual difficulty, style, and format typically seen in real ${examName} previous year papers for ${subject}.

For each question, give the full step-by-step explanation of how to arrive at the answer, not just the final answer.

Return ONLY valid JSON, no markdown:
{"questions":[{"question":"string","options":["string","string","string","string"],"correctAnswer":"string","explanation":"detailed step-by-step explanation string","year":"approximate year this style of question commonly appears, e.g. 2021-2023"}]}`;
    const text = await callAI(prompt);
    const data = extractJSON(text);
    res.json(data);
  } catch (err) {
    console.error('pyqs error:', err.message);
    res.status(500).json({ error: 'Failed to generate PYQs', detail: err.message });
  }
});
// ===== AI MENTOR =====
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

// ===== CHAT HISTORY (matches ChatHistory.jsx: getChatHistory, deleteChat) =====
app.post('/api/chat-history', auth, async (req, res) => {
  try {
    const { title, messages } = req.body;
    if (!messages || messages.length === 0) return res.status(400).json({ error: 'No messages to save' });
    const chat = await ChatHistory.create({ userId: req.userId, title, messages });
    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/chat-history', auth, async (req, res) => {
  try {
    const chats = await ChatHistory.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/chat-history/:id', auth, async (req, res) => {
  try {
    const result = await ChatHistory.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!result) return res.status(404).json({ error: 'Chat not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== FEEDBACK =====
app.post('/api/feedback', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });
    await Feedback.create({ name, email, message });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== USER PROFILE =====
app.get('/api/user/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    const plans = await StudyPlan.countDocuments({ userId: req.userId });
    const quizzes = await QuizResult.countDocuments({ userId: req.userId });
    res.json({ user, stats: { plans, quizzes } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/user/profile', auth, async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(req.userId, { name }, { new: true }).select('-password');
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));