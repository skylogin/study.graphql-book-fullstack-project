import { GraphQLSchema } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import { buildSchema } from 'type-graphql';

import { NotificationResolver } from '../resolvers/Notification';
import { FilmResolver } from '../resolvers/Film';
import { CutResolver } from '../resolvers/Cut';
import { UserResolver } from '../resolvers/User';
import { CutReviewResolver } from '../resolvers/CutReview';

export const createSchema = async (): Promise<GraphQLSchema> => {
  return buildSchema({
    resolvers: [
      FilmResolver,
      CutResolver,
      UserResolver,
      CutReviewResolver,
      NotificationResolver,
    ],
    pubSub: new PubSub(),
  });
};
