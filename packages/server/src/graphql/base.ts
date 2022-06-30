import { IExecutableSchemaDefinition } from '@graphql-tools/schema';
import { gql } from 'apollo-server-express';
import { GraphQLError, GraphQLScalarType, Kind } from 'graphql';

export const typeDefs = gql`
  scalar Date

  type Query {
    """
    The current version of the API.

    During development, this version number should not be treated as "strictly" semver compliant.
    """
    apiVersion: String!
  }

  type Mutation
`;

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

export const resolvers: IExecutableSchemaDefinition['resolvers'] = {
  Query: {
    apiVersion() {
      return '0.1.0';
    }
  },
  Date: DateScalar
};
