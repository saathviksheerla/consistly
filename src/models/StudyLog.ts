import mongoose, { Schema, model, models } from 'mongoose';

const StudyLogSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    date: { type: String, required: true, index: true }, // YYYY-MM-DD
    minutes: { type: Number, required: true },
    notes: { type: String, default: '' },
    topics: [{ type: String }],
  },
  { timestamps: true },
);

const StudyLog = models.StudyLog || model('StudyLog', StudyLogSchema);

export default StudyLog;
