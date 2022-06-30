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
    // user = {
    //   id: '62b8b3c8bd56db611aa4b0b0'
    // };
    // console.log('info', parent, args, user);
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
    addUser: allow,
    updateUser: isOwner,
    addProductOffer: isLoggedin,
    // updateProductOffer: isOwner,
    addOrder: isLoggedin,
    // updateOrder: isOwner,
    addReview: isLoggedin
    // updateReview: isOwner
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
