import { IExecutableSchemaDefinition } from '@graphql-tools/schema';
import { gql } from 'apollo-server-express';

import { toObject } from '../database';
import { BasketModel } from '../database/models/basket';
import { ProductModel } from '../database/models/product';
import {
  resolveNestedDocument,
  resolveQueryAll,
  resolveQuerySingle
} from './utils';

export const typeDefs = gql`
  enum Unit {
    bucket
  }

  """
  Information about a product that can be sold.
  """
  type Product {
    id: ID!
    createdAt: Date!
    updatedAt: Date!
    name: String!
    description: String!
    category: String!
    coverImage: String!
    images: [String!]!
    sellerPrice: Float!
    buyerPrice: Float!
    unit: Unit!
    availableQuantity: Int!
  }

  """
  A product that is inside a basket.
  """
  type BasketProduct {
    product: Product!
    quantity: Int!
  }

  input BasketProductInput {
    productId: ID!
    quantity: Int!
  }

  """
  A pre-made mix of products.
  """
  type Basket {
    id: ID!
    createdAt: Date!
    updatedAt: Date!
    name: String!
    description: String!
    category: String!
    coverImage: String!
    images: [String!]!
    buyerPrice: Float!
    products: [BasketProduct!]!
  }

  extend type Query {
    product(id: ID!): Product
    products: [Product!]!
    basket(id: ID!): Basket
    baskets: [Basket!]!
  }

  extend type Mutation {
    addProduct(
      createdAt: Date!
      updatedAt: Date!
      name: String!
      description: String!
      category: String!
      coverImage: String!
      images: [String!]!
      sellerPrice: Float!
      buyerPrice: Float!
      unit: Unit!
    ): Product
    addBasket(
      createdAt: Date!
      updatedAt: Date!
      name: String!
      description: String!
      category: String!
      coverImage: String!
      images: [String!]!
      buyerPrice: Float!
      products: [BasketProductInput]!
    ): Basket
  }
`;

export const resolvers: IExecutableSchemaDefinition['resolvers'] = {
  BasketProduct: {
    product: resolveNestedDocument(ProductModel, 'productId')
  },
  Query: {
    product: resolveQuerySingle(ProductModel),
    products: resolveQueryAll(ProductModel),
    basket: resolveQuerySingle(BasketModel),
    baskets: resolveQueryAll(BasketModel)
  },
  Mutation: {
    async addProduct(parent, args) {
      const {
        createdAt,
        updatedAt,
        name,
        description,
        category,
        coverImage,
        images,
        sellerPrice,
        buyerPrice,
        unit
      } = args;
      const obj = new ProductModel({
        createdAt,
        updatedAt,
        name,
        description,
        category,
        coverImage,
        images,
        sellerPrice,
        buyerPrice,
        unit,
        availableQuantity: 0
      });
      return obj
        .save()
        .then((result) => toObject(result))
        .catch((error) => {
          console.error(error);
        });
    },
    async addBasket(parent, args) {
      const {
        createdAt,
        updatedAt,
        name,
        description,
        category,
        coverImage,
        images,
        buyerPrice,
        products
      } = args;
      const obj = new BasketModel({
        createdAt,
        updatedAt,
        name,
        description,
        category,
        coverImage,
        images,
        buyerPrice,
        products
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
