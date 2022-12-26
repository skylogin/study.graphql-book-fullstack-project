import { Ctx, Query, Resolver, UseMiddleware } from 'type-graphql';

import { MyContext } from '../apollo/createApolloServer';
import { isAuthenticated } from '../middlewares/isAuthenticated';

import Notification from '../entities/Notification';

@Resolver(Notification)
export class NotificationResolver {
  @Query(() => [Notification], {
    description: '세션에 해당되는 유저의 모든 알림을 가져옵니다.',
  })
  @UseMiddleware(isAuthenticated)
  async notifications(
    @Ctx() { verifiedUser }: MyContext,
  ): Promise<Notification[]> {
    const notifications = await Notification.find({
      where: { userId: verifiedUser.userId },
      order: { createdAt: 'DESC' },
    });
    return notifications;
  }
}
