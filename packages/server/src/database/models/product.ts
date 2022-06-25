import { Model, model, models, Schema } from 'mongoose';

export interface Product {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
  category: string;
  coverImage: string;
  images: string[];
  sellerPrice: number;
  buyerPrice: number;
  unit: 'bucket';
  availableQuantity: number;
}

export const schema = new Schema<Product>({
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  coverImage: { type: String, required: true },
  images: { type: [String], required: true },
  sellerPrice: { type: Number, required: true },
  buyerPrice: { type: Number, required: true },
  unit: { type: String, enum: ['bucket'], required: true },
  availableQuantity: { type: Number, required: true }
});

export const ProductModel: Model<Product> =
  models.Product ?? model<Product>('Product', schema);
