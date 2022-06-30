import { Model, model, models, Schema } from 'mongoose';

export interface Order {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: typeof Schema.Types.ObjectId;
  productId: typeof Schema.Types.ObjectId;
  pickupLocation: string;
  quantity: number;
  status: 'inCart' | 'atRelayPoint' | 'complete' | 'canceled';
}

export const schema = new Schema<Order>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    pickupLocation: { type: String, required: true },
    quantity: { type: Number, required: true },
    status: {
      type: String,
      enum: ['inCart', 'atRelayPoint', 'complete', 'canceled'],
      required: true
    }
  },
  { timestamps: true }
);

export const OrderModel: Model<Order> =
  models.Order ?? model<Order>('Order', schema);
