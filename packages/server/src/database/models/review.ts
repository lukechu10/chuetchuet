import { Model, model, models, Schema } from 'mongoose';

export interface Review {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: typeof Schema.Types.ObjectId;
  orderIds: typeof Schema.Types.ObjectId[];
  rating: number;
  description?: string;
}

export const schema = new Schema<Review>({
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  orderIds: [{ type: Schema.Types.ObjectId, ref: 'Product', required: true }],
  rating: { type: Number, required: true },
  description: String
});

export const ReviewModel: Model<Review> =
  models.Review ?? model<Review>('Review', schema);
