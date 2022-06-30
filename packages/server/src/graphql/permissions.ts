import { ForbiddenError } from 'apollo-server-express';
import { allow, rule, shield } from 'graphql-shield';

const isLoggedin = rule({ cache: 'contextual' })(
  async (parent, args, { user }) => {
    if (user) return true;
    return new ForbiddenError('Not Authorized');
  }
);

const isOwner = rule({ cache: 'contextual' })(
  async (parent, args, { user }) => {
    if (!user) return new ForbiddenError('Not Authorized');
    if (user.isAdmin) return true;
    if (
      args.id !== user.id &&
      parent.id !== user.id &&
      parent.ownerId !== user.id
    )
      return new ForbiddenError('Not Authorized');
    return true;
  }
);

const isAdmin = rule({ cache: 'contextual' })(
  async (parent, args, { user }) => {
    if (user && user.isAdmin) return true;
    return new ForbiddenError('Not Authorized');
  }
);

export const permissions = shield({
  Query: {
    '*': allow
  },
  Mutation: {
    '*': isAdmin,
    login: allow,
    signup: allow,
    updateUser: isOwner,
    addProductOffer: isLoggedin,
    // updateProductOffer: isOwner,
    addOrder: isLoggedin,
    // updateOrder: isOwner,
    addReview: isLoggedin
    // updateReview: isOwner
  },
  AuthResult: {
    token: allow
  },
  User: {
    email: isOwner,
    emailVerified: isOwner,
    passwordHash: isOwner,
    phoneNumber: isOwner,
    address: isOwner
  },
  Product: isLoggedin,
  Basket: isLoggedin,
  ProductOffer: isOwner,
  Order: isOwner,
  Review: isLoggedin
});
