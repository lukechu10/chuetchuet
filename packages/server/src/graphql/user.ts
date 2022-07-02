import { IExecutableSchemaDefinition } from '@graphql-tools/schema';
import { ApolloError, gql } from 'apollo-server-express';

import { toObject } from '../database';
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
    """
    Get self user (using auth token).
    """
    self: User
  }

  extend type Mutation {
    updateUser(
      id: ID!
      name: String
      avatar: String
      biography: String
      isSeller: Boolean
      email: String
      passwordHash: String
      phoneNumber: String
      address: String
    ): User!
  }
`;

export const resolvers: IExecutableSchemaDefinition['resolvers'] = {
  Query: {
    user: resolveQuerySingle(UserModel),
    users: resolveQueryAll(UserModel),
    async self(parent, args, context) {
      const id = context.user.id;
      return resolveQuerySingle(UserModel)(parent, { id });
    }
  },
  Mutation: {
    async updateUser(parent, args) {
      const {
        id,
        name,
        avatar,
        biography,
        isSeller,
        email,
        passwordHash,
        phoneNumber,
        address
      } = args;
      const user = await UserModel.findById(id);
      if (!user) return new ApolloError('User not found');
      if (name !== undefined) user.name = name;
      if (avatar !== undefined) user.avatar = avatar;
      if (biography !== undefined) user.biography = biography;
      if (isSeller !== undefined) user.isSeller = isSeller;
      if (email !== undefined) user.email = email;
      if (passwordHash !== undefined) user.passwordHash = passwordHash;
      if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
      if (address !== undefined) user.address = address;
      await user.save();
      return toObject(user);
    }
  }
};
