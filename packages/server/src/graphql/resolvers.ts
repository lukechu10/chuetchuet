import { IExecutableSchemaDefinition } from '@graphql-tools/schema';
import { ApolloError } from 'apollo-server-express';
import bcrypt from 'bcrypt';
import {
  GraphQLError,
  GraphQLResolveInfo,
  GraphQLScalarType,
  Kind
} from 'graphql';
import { createSelectedFields } from 'graphql-fields-projection';
import jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import validator from 'validator';

import { toObject } from '../database';
import { BasketModel } from '../database/models/basket';
import { OrderModel } from '../database/models/order';
import { ProductModel } from '../database/models/product';
import { ProductOfferModel } from '../database/models/productOffer';
import { ReviewModel } from '../database/models/review';
import { User, UserModel } from '../database/models/user';

function isIsoDate(value: string) {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(value)) return false;
  const date = new Date(value);
  return date.toISOString() === value;
}

const DateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'A Date Scalar',
  serialize(value) {
    if (value instanceof Date) {
      return value.toISOString();
    }
    throw new GraphQLError('Value is not a Date');
  },
  parseValue(value) {
    if (typeof value !== 'string') {
      throw new GraphQLError('Value is not a string');
    }
    if (!isIsoDate(value)) {
      throw new GraphQLError('Value is not a Date string');
    }
    return new Date(value);
  },
  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError('Value is not a string');
    }
    if (!isIsoDate(ast.value)) {
      throw new GraphQLError('Value is not a Date string');
    }
    return new Date(ast.value);
  }
});

function resolveNestedDocument<T>(model: Model<T>, idKey: string) {
  return (parent: any, args: any, context: any, info: GraphQLResolveInfo) => {
    const fields = createSelectedFields(info);
    if (fields.length === 1 && fields[0] === 'id') {
      return { id: parent[idKey] };
    }
    return model
      .findById(parent[idKey])
      .then((result) => (result ? toObject(result) : null));
  };
}

function resolveNestedDocumentArray<T>(model: Model<T>, idKey: string) {
  return (parent: any, args: any, context: any, info: GraphQLResolveInfo) => {
    const fields = createSelectedFields(info);
    if (fields.length === 1 && fields[0] === 'id') {
      return parent[idKey].map((id: string) => ({ id }));
    }
    return Promise.all(
      parent[idKey].map((id: string) =>
        model.findById(id).then((result) => (result ? toObject(result) : null))
      )
    );
  };
}

function resolveQuerySingle<T>(model: Model<T>) {
  return (parent: any, args: any) => {
    const { id } = args;
    return model
      .findById(id)
      .then((result) => (result ? toObject(result) : null));
  };
}

function resolveQueryAll<T>(model: Model<T>) {
  return () => {
    return model
      .find()
      .then((results) => results.map((result) => toObject(result)));
  };
}

export const resolvers: IExecutableSchemaDefinition['resolvers'] = {
  Date: DateScalar,
  BasketProduct: {
    product: resolveNestedDocument(ProductModel, 'productId')
  },
  ProductOffer: {
    owner: resolveNestedDocument(UserModel, 'ownerId'),
    product: resolveNestedDocument(ProductModel, 'productId')
  },
  Order: {
    owner: resolveNestedDocument(UserModel, 'ownerId'),
    product: resolveNestedDocument(ProductModel, 'productId')
  },
  Review: {
    owner: resolveNestedDocument(UserModel, 'ownerId'),
    orders: resolveNestedDocumentArray(OrderModel, 'orderIds')
  },
  Query: {
    user: resolveQuerySingle(UserModel),
    users: resolveQueryAll(UserModel),
    product: resolveQuerySingle(ProductModel),
    products: resolveQueryAll(ProductModel),
    basket: resolveQuerySingle(BasketModel),
    baskets: resolveQueryAll(BasketModel),
    productOffer: resolveQuerySingle(ProductOfferModel),
    productOffers: resolveQueryAll(ProductOfferModel),
    order: resolveQuerySingle(OrderModel),
    orders: resolveQueryAll(OrderModel),
    review: resolveQuerySingle(ReviewModel),
    reviews: resolveQueryAll(ReviewModel)
  },
  Mutation: {
    async addUser(parent, args) {
      const {
        createdAt,
        updatedAt,
        name,
        avatar,
        biography,
        isSeller,
        email,
        passwordHash,
        phoneNumber,
        address
      } = args;
      const obj = new UserModel({
        createdAt,
        updatedAt,
        name,
        avatar,
        biography,
        isSeller,
        isAdmin: false,
        email,
        emailVerified: false,
        passwordHash,
        phoneNumber,
        address
      });
      return obj
        .save()
        .then((result) => toObject(result))
        .catch((error) => {
          console.error(error);
        });
    },
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
    },
    async addProductOffer(parent, args) {
      const { createdAt, updatedAt, ownerId, productId, quantity, status } =
        args;
      const obj = new ProductOfferModel({
        createdAt,
        updatedAt,
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
      const {
        createdAt,
        updatedAt,
        ownerId,
        productId,
        pickupLocation,
        quantity,
        status
      } = args;
      const obj = new OrderModel({
        createdAt,
        updatedAt,
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
    },
    async addReview(parent, args) {
      const { createdAt, updatedAt, ownerId, orderIds, rating, description } =
        args;
      const obj = new ReviewModel({
        createdAt,
        updatedAt,
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
    },

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

      const createdAt = new Date();
      const obj = new UserModel({
        createdAt,
        updatedAt: createdAt,
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
async function tokenFromUser(user: User): Promise<string> {
  const payload = {
    name: user.name,
    email: user.email
  };
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '365 days'
  });
}
