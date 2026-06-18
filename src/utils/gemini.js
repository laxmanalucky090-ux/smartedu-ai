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

// Token management
export const getToken = () => localStorage.getItem('smartedu_token');
export const setToken = (token) => localStorage.setItem('smartedu_token', token);
export const removeToken = () => localStorage.removeItem('smartedu_token');

const authHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

// Auth
export async function registerUser(name, email, password) {
  const res = await axios.post(`${API_BASE}/auth/register`, { name, email, password });
  setToken(res.data.token);
  return res.data.user;
}

export async function loginUser(email, password) {
  const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
  setToken(res.data.token);
  return res.data.user;
}

export async function getUserHistory() {
  const res = await axios.get(`${API_BASE}/history`, { headers: authHeaders() });
  return res.data;
}

// AI Functions
export async function generateStudyPlan(examName, examDate, expectedMarks, subjects, weakTopics, dailyHours, language, level) {
  const res = await axios.post(`${API_BASE}/study-plan`, {
    examName, examDate, expectedMarks, subjects, weakTopics, dailyHours, language, level
  }, { headers: authHeaders() });
  return res.data;
}

export async function generateResources(subjects, language) {
  const res = await axios.post(`${API_BASE}/resources`, { subjects, language }, { headers: authHeaders() });
  return res.data.resources;
}

export async function generateQuiz(subject, numQuestions, difficulty, language) {
  const res = await axios.post(`${API_BASE}/quiz`, {
    topic: subject, numQuestions, difficulty, language
  }, { headers: authHeaders() });
  return res.data.questions;
}

export async function saveQuizResult(subject, score, totalQuestions, difficulty) {
  await axios.post(`${API_BASE}/quiz/result`, {
    subject, score, totalQuestions, difficulty
  }, { headers: authHeaders() });
}

export async function mentorChat(message, history, language) {
  const res = await axios.post(`${API_BASE}/mentor`, { message, history, language }, { headers: authHeaders() });
  return res.data.reply;
}