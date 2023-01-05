import {
  Resolver,
  Arg,
  Args,
  ArgsType,
  Ctx,
  Field,
  InputType,
  Mutation,
  UseMiddleware,
  Int,
  FieldResolver,
  Root,
  Query,
} from 'type-graphql';
import { IsInt, IsString } from 'class-validator';

import { MyContext } from '../apollo/createApolloServer';
import { isAuthenticated } from '../middlewares/isAuthenticated';

import User from '../entities/User';
import { CutDescription } from '../entities/CutDescription';

@InputType()
class CreateOrUpdateCutDescriptionInput {
  @Field(() => Int, { description: '명장면 번호' })
  @IsInt()
  id: number;

  @Field({ description: '명장면 설명' })
  @IsString()
  contents: string;
}

@Resolver(CutDescription)
export class CutDescriptionResolver {
  @Query(() => CutDescription, { nullable: true })
  async cutDescription(
    @Arg('cutId', () => Int) id: number,
  ): Promise<CutDescription | undefined> {
    const cutDescription = await CutDescription.findOne({
      where: { id },
    });

    return cutDescription;
  }

  @Mutation(() => CutDescription, { nullable: true })
  @UseMiddleware(isAuthenticated)
  async createOrUpdateCutDescription(
    @Arg('cutDescriptionInput')
    cutDescriptionInput: CreateOrUpdateCutDescriptionInput,
    @Ctx() { verifiedUser }: MyContext,
  ): Promise<CutDescription | null> {
    if (!verifiedUser) return null;
    const { contents, id } = cutDescriptionInput;

    const prevCutDescription = await CutDescription.findOne({
      where: { id },
    });
    if (prevCutDescription) {
      const user = new User();
      user.id = verifiedUser.userId;
      prevCutDescription.user = user;
      prevCutDescription.contents = contents;
      return prevCutDescription.save();
    }

    const cutDescription = CutDescription.create({
      contents: cutDescriptionInput.contents,
      id: cutDescriptionInput.id,
      user: {
        id: verifiedUser.userId,
      },
    });
    return cutDescription.save();
  }

  @FieldResolver(() => User)
  async user(@Root() cutDescription: CutDescription): Promise<User> {
    return (await User.findOne(cutDescription.userId))!;
  }
}
