import { gql } from 'apollo-server-express';

import { UserModel } from '../database/models/user';
import { resolveQueryAll, resolveQuerySingle } from './utils';

export const typeDefs = gql`
  """
  Basic information associated with a user.
  """
  type User {
    id: ID!
    createdAt: Date!
    updatedAt: Date!
    name: String!
    avatar: String
    biography: String
    isSeller: Boolean!
    isAdmin: Boolean!
    email: String!
    emailVerified: Boolean!
    # TODO: This should not be exposed under any circumstances.
    passwordHash: String!
    phoneNumber: String
    address: String
  }

  extend type Query {
    """
    Get an user by id.
    """
    user(id: ID!): User
    """
    Get a list of all users.
    """
    users: [User!]!
  }
`;

export const resolvers = {
  Query: {
    user: resolveQuerySingle(UserModel),
    users: resolveQueryAll(UserModel)
  }
};
