export interface User<IsSeller = false> {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  avatar?: string;
  biography?: string;
  isSeller: IsSeller;
  isAdmin: boolean;
  email: string;
  emailVerified: boolean;
  passwordHash: string;
  phoneNumber: IsSeller extends true ? string : string | undefined;
  address: IsSeller extends true ? string : string | undefined;
}

export interface Product {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
  coverImage: string;
  images: string[];
  sellerPrice: number;
  buyerPrice: number;
  unit: 'bucket';
}

export interface BasketProduct {
  product: Product;
  quantity: number;
}

export interface Basket {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
  coverImage: string;
  images: string[];
  buyerPrice: number;
  products: BasketProduct[];
}

export interface ProductOffer {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  owner: User;
  product: Product;
  quantity: number;
  status: 'pendingPickup' | 'shipping' | 'atRelayPoint';
}

export interface Order {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  owner: User;
  product: Product;
  pickupLocation: string;
  quantity: number;
  status: 'inCart' | 'atRelayPoint' | 'complete' | 'canceled';
}

export interface Review {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  owner: User;
  orders: Order[];
  rating: number;
  description?: string;
}
