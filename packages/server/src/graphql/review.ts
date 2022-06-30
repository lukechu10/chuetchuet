import { IExecutableSchemaDefinition } from '@graphql-tools/schema';
import { gql } from 'apollo-server-express';

import { toObject } from '../database';
import { OrderModel } from '../database/models/order';
import { ReviewModel } from '../database/models/review';
import { UserModel } from '../database/models/user';
import {
  resolveNestedDocument,
  resolveNestedDocumentArray,
  resolveQueryAll,
  resolveQuerySingle
} from './utils';

export const typeDefs = gql`
  type Review {
    id: ID!
    createdAt: Date!
    updatedAt: Date!
    owner: User!
    orders: [Order!]!
    rating: Int!
    description: String
  }

  extend type Query {
    review(id: ID!): Review
    reviews: [Review!]!
  }

  extend type Mutation {
    addReview(
      ownerId: ID!
      orderIds: [ID!]!
      rating: Int!
      description: String
    ): Review
  }
`;

export const resolvers: IExecutableSchemaDefinition['resolvers'] = {
  Review: {
    owner: resolveNestedDocument(UserModel, 'ownerId'),
    orders: resolveNestedDocumentArray(OrderModel, 'orderIds')
  },
  Query: {
    review: resolveQuerySingle(ReviewModel),
    reviews: resolveQueryAll(ReviewModel)
  },
  Mutation: {
    async addReview(parent, args) {
      const { ownerId, orderIds, rating, description } = args;
      const obj = new ReviewModel({
        ownerId,
        orderIds,
        rating,
        description
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
