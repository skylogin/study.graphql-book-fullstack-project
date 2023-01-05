import { GraphQLSchema } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import { buildSchema } from 'type-graphql';

import { NotificationResolver } from '../resolvers/Notification';
import { FilmResolver } from '../resolvers/Film';
import { CutResolver } from '../resolvers/Cut';
import { UserResolver } from '../resolvers/User';
import { CutReviewResolver } from '../resolvers/CutReview';
import { CutDescriptionResolver } from '../resolvers/CutDescription';

export const createSchema = async (): Promise<GraphQLSchema> => {
  return buildSchema({
    resolvers: [
      FilmResolver,
      CutResolver,
      UserResolver,
      CutReviewResolver,
      NotificationResolver,
      CutDescriptionResolver,
    ],
    pubSub: new PubSub(),
  });
};
