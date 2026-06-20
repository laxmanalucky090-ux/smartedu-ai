import mongoose from 'mongoose';

const studyPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  examName: { type: String, required: true },
  subjects: [String],
  level: String,
  dailyHours: String,
  planData: Object,
}, { timestamps: true });

export default mongoose.model('StudyPlan', studyPlanSchema);