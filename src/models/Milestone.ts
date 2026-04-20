import mongoose, { Schema, model, models } from 'mongoose';

const MilestoneSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    targetDate: { type: String, required: true }, // YYYY-MM-DD
    linkedCourseIds: [{ type: String }], // Array for multiple courses
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Done'],
      default: 'Not Started',
      required: true,
    },
  },
  { timestamps: true },
);

const Milestone = models.Milestone || model('Milestone', MilestoneSchema);

export default Milestone;
