import 'reflect-metadata';
import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import { graphqlUploadExpress } from 'graphql-upload';

import { createDB } from './db/db-client';
import createApolloServer from './apollo/createApolloServer';

import { PORT, NODE_ENV } from './constants/constants';
import { createSchema } from './apollo/createSchema';
import { createSubscriptionServer } from './apollo/createSubscriptionServer';

async function main() {
  await createDB();
  const app = express();
  app.use(cookieParser());
  app.use(graphqlUploadExpress({ maxFileSize: 1024 * 1000 * 5, maxFiles: 1 }));
  app.use(express.static('public'));

  const httpServer = http.createServer(app);

  const schema = await createSchema();
  await createSubscriptionServer(schema, httpServer);
  const apolloServer = await createApolloServer(schema);

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: ['http://localhost:3000', 'https://studio.apollographql.com'],
      credentials: true,
    },
  });

  httpServer.listen(PORT || 4000, () => {
    if (NODE_ENV !== 'production') {
      console.log(`
				server started on => http://localhost:4000
				graphql playground => http://localhost:4000/graphql
			`);
    } else {
      console.log(`
				Production server Started...
			`);
    }
  });
}

main().catch((err) => console.error(err));
