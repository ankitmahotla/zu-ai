import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './user';

export interface IPost extends Document {
  title: string;
  content: string;
  author: IUser['_id'];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Post = mongoose.model<IPost>('Post', PostSchema);