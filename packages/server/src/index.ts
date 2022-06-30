import {
  IExecutableSchemaDefinition,
  makeExecutableSchema
} from '@graphql-tools/schema';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { applyMiddleware } from 'graphql-middleware';
import http from 'http';

import { connectToDatabase } from './database';
import { permissions } from './graphql/permissions';
import { resolvers } from './graphql/resolvers';
import { typeDefs } from './graphql/schema';

async function startApolloServer(
  typeDefs: IExecutableSchemaDefinition['typeDefs'],
  resolvers: IExecutableSchemaDefinition['resolvers']
) {
  await connectToDatabase();
  const app = express();
  const httpServer = http.createServer(app);
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const server = new ApolloServer({
    schema: applyMiddleware(schema, permissions),
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: ({ req }) => {
      // TODO: Authentication here
    }
  });
  await server.start();
  server.applyMiddleware({ app });
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer(typeDefs, resolvers);
