import mongoose from 'mongoose';

const quizResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: String,
  score: Number,
  totalQuestions: Number,
  difficulty: String,
}, { timestamps: true });

export default mongoose.model('QuizResult', quizResultSchema);