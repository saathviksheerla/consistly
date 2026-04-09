import mongoose, { Schema, model, models } from 'mongoose';

const BookmarkSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    category: { type: String, required: true },
    isPinned: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Bookmark = models.Bookmark || model('Bookmark', BookmarkSchema);

export default Bookmark;
