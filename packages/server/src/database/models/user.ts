import { Model, model, models, Schema } from 'mongoose';

export interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  avatar?: string;
  biography?: string;
  isSeller: boolean;
  isAdmin: boolean;
  email: string;
  emailVerified: boolean;
  passwordHash: string;
  phoneNumber?: string;
  address?: string;
}

const schema = new Schema<User>({
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  name: { type: String, required: true },
  avatar: String,
  biography: String,
  isSeller: { type: Boolean, required: true },
  isAdmin: { type: Boolean, required: true },
  email: { type: String, required: true },
  emailVerified: { type: Boolean, required: true },
  passwordHash: { type: String, required: true },
  phoneNumber: String,
  address: String
});

export const UserModel: Model<User> =
  models.User ?? model<User>('User', schema);
