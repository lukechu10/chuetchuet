import { Model, model, models, Schema } from 'mongoose';

export interface AuthUser {
  id: string;
  name: string;
  avatar?: string;
  isSeller: boolean;
  isAdmin: boolean;
  email: string;
  emailVerified: boolean;
}

export interface User extends AuthUser {
  createdAt: Date;
  updatedAt: Date;
  biography?: string;
  passwordHash: string;
  phoneNumber?: string;
  address?: string;
}

const schema = new Schema<User>(
  {
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
  },
  { timestamps: true }
);

export const UserModel: Model<User> =
  models.User ?? model<User>('User', schema);
