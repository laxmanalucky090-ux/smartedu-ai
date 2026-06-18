import mongoose from 'mongoose';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Groq from 'groq-sdk';

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }
  return JSON.parse(cleaned);
}

app.get('/', (req, res) => res.send('SmartEdu AI Backend Running ✅'));

app.post('/api/study-plan', async (req, res) => {
  try {
    const { examName, examDate, expectedMarks, subjects, weakTopics, dailyHours, language } = req.body;
    const prompt = `You are an expert educational planner for competitive exams in India.
Create a detailed personalized study plan for:
- Exam: ${examName}
- Exam Date: ${examDate || 'Not specified'}
- Target Score: ${expectedMarks || 'Maximum possible'}
- Subjects: ${subjects}
- Weak Topics: ${weakTopics || 'None'}
- Daily Study Hours: ${dailyHours}
- Language: ${language || 'English'}

Return ONLY valid JSON, no markdown, no extra text:
{"title":"string","description":"string","totalDuration":"string","weeks":[{"week":1,"title":"string","topics":["string"],"goals":["string"]}]}`;

    const text = await callAI(prompt);
    const data = extractJSON(text);
    res.json(data);
  } catch (err) {
    console.error('study-plan error:', err.message);
    res.status(500).json({ error: 'Failed to generate study plan', detail: err.message });
  }
});

app.post('/api/resources', async (req, res) => {
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
    console.error('resources error:', err.message);
    res.status(500).json({ error: 'Failed to generate resources', detail: err.message });
  }
});

app.post('/api/quiz', async (req, res) => {
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
    console.error('quiz error:', err.message);
    res.status(500).json({ error: 'Failed to generate quiz', detail: err.message });
  }
});

app.post('/api/mentor', async (req, res) => {
  try {
    const { message, history, language } = req.body;
    const messages = [
      { role: 'system', content: `You are a friendly AI mentor helping a student. Respond in ${language || 'English'}. Be clear and educational. Plain text only, no markdown.` },
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
    console.error('mentor error:', err.message);
    res.status(500).json({ error: 'AI server error', detail: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));