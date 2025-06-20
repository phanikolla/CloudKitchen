import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IMenuItem extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const menuItemSchema = new Schema<IMenuItem>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export const MenuItem = mongoose.model<IMenuItem>('MenuItem', menuItemSchema); 