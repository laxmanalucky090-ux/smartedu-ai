import axios from 'axios';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

export const LANGUAGES = [
  { code: 'English', name: 'English' },
  { code: 'Hindi', name: 'Hindi' },
  { code: 'Telugu', name: 'Telugu' },
  { code: 'Tamil', name: 'Tamil' },
  { code: 'Kannada', name: 'Kannada' },
  { code: 'Marathi', name: 'Marathi' },
];

export async function generateStudyPlan(examName, examDate, expectedMarks, subjects, weakTopics, dailyHours, language) {
  const res = await axios.post(`${API_BASE}/study-plan`, {
    examName, examDate, expectedMarks, subjects, weakTopics, dailyHours, language
  });
  return res.data;
}

export async function generateResources(subjects, language) {
  const res = await axios.post(`${API_BASE}/resources`, { subjects, language });
  return res.data.resources;
}

export async function generateQuiz(subject, numQuestions, difficulty, language) {
  const res = await axios.post(`${API_BASE}/quiz`, {
    topic: subject, numQuestions, difficulty, language
  });
  return res.data.questions;
}

export async function mentorChat(message, history, language) {
  const res = await axios.post(`${API_BASE}/mentor`, { message, history, language });
  return res.data.reply;
}