import mongoose, { Schema, model, models } from "mongoose";

const CourseSchema = new Schema(
    {
        userId: { type: String, required: true, index: true },
        title: { type: String, required: true },
        itemType: { type: String, default: "" }, // E.g., 'Course', 'Habit', etc.
        milestoneId: { type: String, default: "" }, // Links back to a Goal/Milestone
        url: { type: String, default: "" },
        source: { type: String, default: "" }, // E.g., 'YouTube', 'Coursera'
        totalLessons: { type: Number, default: 0 }, // Made optional essentially by defaulting to 0
        completedLessons: { type: Number, default: 0 },
        category: { type: String, default: "Uncategorized" }, // Replaced strict union with standard string for custom categories
        consistencyGoal: { type: String, default: "" }, // 'every_day', 'few_times_week', etc.
        consistencyDetails: { type: Schema.Types.Mixed, default: "" }, // e.g. '15 minutes', frequency, or target date
        progressStyle: { type: String, default: "mark_done" }, // 'mark_done', 'count_sessions', etc.
        missedDaysTone: { type: String, default: "gentle" },
    },
    { timestamps: true }
);

const Course = models.Course || model("Course", CourseSchema);

export default Course;
