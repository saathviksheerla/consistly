import mongoose, { Schema, model, models } from 'mongoose';

const SettingsSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    reminderTime: { type: String, default: '18:00' }, // HH:mm format
    streakFreezeUsed: { type: Boolean, default: false },
    theme: { type: String, default: 'dark' },
  },
  { timestamps: true },
);

const Settings = models.Settings || model('Settings', SettingsSchema);

export default Settings;
