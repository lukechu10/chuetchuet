import { Model, model, models, Schema } from 'mongoose';

export interface BasketProduct {
  productId: typeof Schema.Types.ObjectId;
  quantity: number;
}

export interface Basket {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
  category: string;
  coverImage: string;
  images: string[];
  buyerPrice: number;
  products: BasketProduct[];
}

const schema = new Schema<Basket>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    coverImage: { type: String, required: true },
    images: [{ type: String, required: true }],
    buyerPrice: { type: Number, required: true },
    products: {
      type: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
          },
          quantity: { type: Number, required: true }
        }
      ],
      required: true
    }
  },
  { timestamps: true }
);

export const BasketModel: Model<Basket> =
  models.Basket ?? model<Basket>('Basket', schema);
