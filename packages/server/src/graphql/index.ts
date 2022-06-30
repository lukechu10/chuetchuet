/**
 * @file combine individual typeDefs and resolvers together.
 */

import _ from 'lodash';

import * as auth from './auth';
import * as base from './base';
import * as product from './product';
import * as review from './review';
import * as transaction from './transaction';
import * as user from './user';

export const resolvers = _.merge(
  {},
  base.resolvers,
  auth.resolvers,
  product.resolvers,
  review.resolvers,
  transaction.resolvers,
  user.resolvers
);

export const typeDefs = [
  base.typeDefs,
  auth.typeDefs,
  product.typeDefs,
  review.typeDefs,
  transaction.typeDefs,
  user.typeDefs
];
