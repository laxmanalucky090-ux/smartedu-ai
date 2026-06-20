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

// ===== AUTH =====
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

// ===== STUDY PLAN =====
export async function generateStudyPlan(examName, examDate, expectedMarks, subjects, weakTopics, dailyHours, language, level) {
  const res = await axios.post(`${API_BASE}/study-plan`, {
    examName, examDate, expectedMarks, subjects, weakTopics, dailyHours, language, level
  }, { headers: authHeaders() });
  return res.data;
}

export async function getStudyPlanHistory() {
  const res = await axios.get(`${API_BASE}/study-plan/history`, { headers: authHeaders() });
  return res.data.plans;
}

export async function getStudyPlanById(id) {
  const res = await axios.get(`${API_BASE}/study-plan/${id}`, { headers: authHeaders() });
  return res.data;
}

export async function deleteStudyPlan(id) {
  await axios.delete(`${API_BASE}/study-plan/${id}`, { headers: authHeaders() });
}

// ===== RESOURCES =====
export async function generateResources(subjects, examName, language) {
  const res = await axios.post(`${API_BASE}/resources`, { subjects, examName, language }, { headers: authHeaders() });
  return res.data.resources;
}

// ===== QUIZ =====
export async function generateQuiz(subject, numQuestions, difficulty, language) {
  const res = await axios.post(`${API_BASE}/quiz`, {
    topic: subject, numQuestions, difficulty, language
  }, { headers: authHeaders() });
  return res.data.questions;
}

export async function saveQuizResult(subject, score, totalQuestions, difficulty, questions, userAnswers) {
  const res = await axios.post(`${API_BASE}/quiz/result`, {
    subject, score, totalQuestions, difficulty, questions, userAnswers
  }, { headers: authHeaders() });
  return res.data;
}

export async function getUserProfile() {
  const res = await axios.get(`${API_BASE}/user/profile`, { headers: authHeaders() });
  return res.data;
}

export async function updateUserProfile(name) {
  const res = await axios.put(`${API_BASE}/user/profile`, { name }, { headers: authHeaders() });
  return res.data;
}
export async function getQuizHistory() {
  const res = await axios.get(`${API_BASE}/quiz/history`, { headers: authHeaders() });
  return res.data.quizzes;
}

export async function deleteQuiz(id) {
  await axios.delete(`${API_BASE}/quiz/${id}`, { headers: authHeaders() });
}

// ===== AI MENTOR =====
export async function mentorChat(message, history, language) {
  const res = await axios.post(`${API_BASE}/mentor`, { message, history, language }, { headers: authHeaders() });
  return res.data.reply;
}

export async function saveChatHistory(title, messages) {
  const res = await axios.post(`${API_BASE}/chat-history`, { title, messages }, { headers: authHeaders() });
  return res.data;
}

export async function getChatHistory() {
  const res = await axios.get(`${API_BASE}/chat-history`, { headers: authHeaders() });
  return res.data;
}

export async function deleteChat(id) {
  await axios.delete(`${API_BASE}/chat-history/${id}`, { headers: authHeaders() });
}

// ===== FEEDBACK =====
export async function sendFeedback(name, email, message) {
  const res = await axios.post(`${API_BASE}/feedback`, { name, email, message });
  return res.data;
}
export async function getUserHistory() {
  const res = await axios.get(`${API_BASE}/history`, { headers: authHeaders() });
  return res.data;
}