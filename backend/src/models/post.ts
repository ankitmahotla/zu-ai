import mongoose, { Document, Schema } from 'mongoose';

interface IPost extends Document {
  title: string;
  content: string;
  author: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Post = mongoose.model<IPost>('Post', PostSchema);