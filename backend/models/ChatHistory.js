import mongoose from 'mongoose';

const chatHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  messages: Array,
}, { timestamps: true });

export default mongoose.model('ChatHistory', chatHistorySchema);