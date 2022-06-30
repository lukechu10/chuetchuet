import { IExecutableSchemaDefinition } from '@graphql-tools/schema';
import { ApolloError, gql } from 'apollo-server-express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';

import { toObject } from '../database';
import { AuthUser, User, UserModel } from '../database/models/user';

export const typeDefs = gql`
  """
  The result of a login/signup request.
  Holds a JWT (JSON Web Token) to be used in future requests when access-control is required.
  """
  type AuthResult {
    token: String!
  }

  extend type Mutation {
    login(email: String!, password: String!): AuthResult!
    signup(
      email: String!
      password: String!
      name: String!
      isSeller: Boolean!
      phoneNumber: String!
      address: String!
    ): AuthResult!
  }
`;

export const resolvers: IExecutableSchemaDefinition['resolvers'] = {
  Mutation: {
    async login(parent, args) {
      const { email, password } = args;
      const obj = await UserModel.findOne({ email }).exec();
      // Verify credentials.
      if (!obj) {
        throw new ApolloError('invalid credentials');
      }
      if (!(await bcrypt.compare(password, obj.passwordHash))) {
        throw new ApolloError('invalid credentials');
      }

      const token = tokenFromUser(obj);
      return { token };
    },
    async signup(parent, args) {
      const { email, password, name, isSeller, phoneNumber, address } = args;
      // Validate email.
      if (!validator.isEmail(email)) {
        throw new ApolloError('invalid email');
      }
      // Validate password.
      if (password.length <= 5) {
        // TODO: add some more password requirements and document them.
        throw new ApolloError('password must be at least 6 characters long');
      }

      // Check if email is already taken.
      const existingUser = await UserModel.findOne({ email }).exec();
      if (existingUser) {
        throw new ApolloError('email is already taken');
      }

      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const obj = new UserModel({
        email,
        name,
        isSeller,
        phoneNumber,
        address,
        emailVerified: false,
        isAdmin: false,
        passwordHash
      });
      obj
        .save()
        .then((result) => toObject(result))
        .catch((error) => {
          console.error(error);
        });
      const token = tokenFromUser(obj);
      return { token };
    }
  }
};

const JWT_SECRET = process.env.JWT_SECRET as string;

/**
 * Create a new [JSON Web Token](https://jwt.io/) from the given `User`.
 */
function tokenFromUser(user: User): string {
  const payload: AuthUser = {
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    isSeller: user.isSeller,
    isAdmin: user.isAdmin,
    email: user.email,
    emailVerified: user.emailVerified
  };
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '365 days'
  });
}
