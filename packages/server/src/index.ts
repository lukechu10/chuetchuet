import {
  IExecutableSchemaDefinition,
  makeExecutableSchema
} from '@graphql-tools/schema';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { applyMiddleware } from 'graphql-middleware';
import http from 'http';
import jwt from 'jsonwebtoken';

import { connectToDatabase } from './database';
import { resolvers, typeDefs } from './graphql';
import { permissions } from './graphql/permissions';

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
      if (typeof req.headers.authorization !== 'string') return;
      const user = jwt.decode(req.headers.authorization);
      if (!user || typeof user === 'string') return;
      return { user };
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
