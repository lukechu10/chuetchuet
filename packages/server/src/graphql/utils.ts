/**
 * Shared utilities for creating GraphQL typeDefs and resolvers.
 */

import { GraphQLResolveInfo } from 'graphql';
import { createSelectedFields } from 'graphql-fields-projection';
import { Model } from 'mongoose';

import { toObject } from '../database';

export function resolveNestedDocument<T>(model: Model<T>, idKey: string) {
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

export function resolveNestedDocumentArray<T>(model: Model<T>, idKey: string) {
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

export function resolveQuerySingle<T>(model: Model<T>) {
  return (parent: any, args: any) => {
    const { id } = args;
    return model
      .findById(id)
      .then((result) => (result ? toObject(result) : null));
  };
}

export function resolveQueryAll<T>(model: Model<T>) {
  return () => {
    return model
      .find()
      .then((results) => results.map((result) => toObject(result)));
  };
}
