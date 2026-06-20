import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  email: String,
  message: String,
}, { timestamps: true });

export default mongoose.model('Feedback', feedbackSchema);