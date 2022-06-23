import { Model, model, models, Schema } from 'mongoose';

export interface ProductOffer {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: typeof Schema.Types.ObjectId;
  productId: typeof Schema.Types.ObjectId;
  quantity: number;
  status: 'pendingPickup' | 'shipping' | 'atRelayPoint';
}

export const schema = new Schema<ProductOffer>({
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pendingPickup', 'shipping', 'atRelayPoint'],
    required: true
  }
});

export const ProductOfferModel: Model<ProductOffer> =
  models.ProductOffer ?? model<ProductOffer>('ProductOffer', schema);
