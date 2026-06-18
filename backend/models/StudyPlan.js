import mongoose from 'mongoose';

const studyPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  examName: String,
  subjects: [String],
  level: String,
  dailyHours: String,
  planData: Object,
  resources: Array,
}, { timestamps: true });

export default mongoose.model('StudyPlan', studyPlanSchema);