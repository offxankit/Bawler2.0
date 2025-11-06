import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'owner' | 'client';
  createdAt: Date;
}

const UserSchema: Schema<IUser> = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  role: {
    type: String,
    enum: ['owner', 'client'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
