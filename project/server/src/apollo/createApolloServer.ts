import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { GraphQLSchema } from 'graphql';

import { Request, Response } from 'express';

import { createCutVoteLoader } from '../dataloader/cutVoteLoader';

import {
  JwtVerifiedUser,
  verifyAccessTokenFromReqHeaders,
} from '../utils/jwt-auth';
import redis from '../redis/redis-client';

export interface MyContext {
  req: Request;
  res: Response;
  verifiedUser: JwtVerifiedUser;
  redis: typeof redis;
  cutVoteLoader: ReturnType<typeof createCutVoteLoader>;
}

const createApolloServer = async (
  schema: GraphQLSchema,
): Promise<ApolloServer> => {
  return new ApolloServer<MyContext>({
    schema,
    plugins: [ApolloServerPluginLandingPageLocalDefault()],
    context: ({ req, res }) => {
      const verified = verifyAccessTokenFromReqHeaders(req.headers);
      return {
        req,
        res,
        verifiedUser: verified,
        redis,
        cutVoteLoader: createCutVoteLoader(),
      };
    },
  });
};

export default createApolloServer;
