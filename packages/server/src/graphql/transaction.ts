import { IExecutableSchemaDefinition } from '@graphql-tools/schema';
import { gql } from 'apollo-server-express';

import { toObject } from '../database';
import { OrderModel } from '../database/models/order';
import { ProductModel } from '../database/models/product';
import { ProductOfferModel } from '../database/models/productOffer';
import { UserModel } from '../database/models/user';
import {
  resolveNestedDocument,
  resolveQueryAll,
  resolveQuerySingle
} from './utils';

export const typeDefs = gql`
  enum ProductOfferStatus {
    pendingPickup
    shipping
    atRelayPoint
  }

  type ProductOffer {
    id: ID!
    createdAt: Date!
    updatedAt: Date!
    owner: User!
    product: Product!
    quantity: Int!
    status: ProductOfferStatus!
  }

  enum OrderStatus {
    inCart
    atRelayPoint
    complete
    canceled
  }

  type Order {
    id: ID!
    createdAt: Date!
    updatedAt: Date!
    owner: User!
    product: Product!
    pickupLocation: String!
    quantity: Int!
    status: OrderStatus!
  }

  extend type Query {
    productOffer(id: ID!): ProductOffer
    productOffers: [ProductOffer!]!
    order(id: ID!): Order
    orders: [Order!]!
  }

  extend type Mutation {
    addProductOffer(
      ownerId: ID!
      productId: ID!
      quantity: Int!
      status: ProductOfferStatus!
    ): ProductOffer
    addOrder(
      ownerId: ID!
      productId: ID!
      pickupLocation: String!
      quantity: Int!
      status: OrderStatus!
    ): Order
  }
`;

export const resolvers: IExecutableSchemaDefinition['resolvers'] = {
  ProductOffer: {
    owner: resolveNestedDocument(UserModel, 'ownerId'),
    product: resolveNestedDocument(ProductModel, 'productId')
  },
  Order: {
    owner: resolveNestedDocument(UserModel, 'ownerId'),
    product: resolveNestedDocument(ProductModel, 'productId')
  },
  Query: {
    productOffer: resolveQuerySingle(ProductOfferModel),
    productOffers: resolveQueryAll(ProductOfferModel),
    order: resolveQuerySingle(OrderModel),
    orders: resolveQueryAll(OrderModel)
  },
  Mutation: {
    async addProductOffer(parent, args) {
      const { ownerId, productId, quantity, status } = args;
      const obj = new ProductOfferModel({
        ownerId,
        productId,
        quantity,
        status
      });
      return obj
        .save()
        .then((result) => toObject(result))
        .catch((error) => {
          console.error(error);
        });
    },
    async addOrder(parent, args) {
      const { ownerId, productId, pickupLocation, quantity, status } = args;
      const obj = new OrderModel({
        ownerId,
        productId,
        pickupLocation,
        quantity,
        status
      });
      return obj
        .save()
        .then((result) => toObject(result))
        .catch((error) => {
          console.error(error);
        });
    }
  }
};
