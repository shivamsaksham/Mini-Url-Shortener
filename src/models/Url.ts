import mongoose, { Document, Schema } from 'mongoose';

export interface IUrl extends Document {
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  expiryDate?: Date;
  clickCount: number;
}

const urlSchema = new Schema<IUrl>({
  originalUrl: {
    type: String,
    required: true,
    trim: true,
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiryDate: {
    type: Date,
    default: null,
  },
  clickCount: {
    type: Number,
    default: 0,
  },
});

urlSchema.index({ shortCode: 1 });
urlSchema.index({ createdAt: -1 });

export const Url = mongoose.model<IUrl>('Url', urlSchema);
