import mongoose from 'mongoose';

const quizResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: String,
  score: Number,
  totalQuestions: Number,
  difficulty: String,
  questions: [Object],
  userAnswers: Object,
}, { timestamps: true });

export default mongoose.model('QuizResult', quizResultSchema);