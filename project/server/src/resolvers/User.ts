import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { createWriteStream } from 'fs';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { IsEmail, IsString } from 'class-validator';
import {
  Arg,
  Field,
  InputType,
  Mutation,
  Resolver,
  ObjectType,
  Query,
  Ctx,
  UseMiddleware,
} from 'type-graphql';

import {
  createAccessToken,
  createRefreshToken,
  setRefreshTokenHeader,
} from '../utils/jwt-auth';

import { REFRESH_JWT_SECRET_KEY } from '../constants/constants';

import { MyContext } from '../apollo/createApolloServer';
import { isAuthenticated } from '../middlewares/isAuthenticated';

import User from '../entities/User';

@InputType()
export class SignUpInput {
  @Field() @IsEmail() email: string;

  @Field() @IsString() username: string;

  @Field() @IsString() password: string;
}

@InputType({ description: '로그인 인풋 데이터' })
export class LoginInput {
  @Field() @IsString() emailOrUsername: string;

  @Field() @IsString() password: string;
}

@ObjectType({ description: '필드 에러 타입' })
class FieldError {
  @Field() field: string;

  @Field() message: string;
}

@ObjectType({ description: '로그인 반환 데이터' })
class LoginResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;

  @Field({ nullable: true })
  accessToken?: string;
}

@ObjectType({ description: '액세스 토큰 새로고침 반환데이터' })
class RefreshAccessTokenResponse {
  @Field() accessToken: string;
}

@Resolver(User)
export class UserResolver {
  @UseMiddleware(isAuthenticated)
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
    if (!ctx.verifiedUser) return undefined;
    return User.findOne({ where: { id: ctx.verifiedUser.userId } });
  }

  @Mutation(() => User)
  async signUp(@Arg('signUpInput') signUpInput: SignUpInput): Promise<User> {
    const { email, username, password } = signUpInput;

    const hashedPw = await argon2.hash(password);
    const newUser = User.create({
      email,
      username,
      password: hashedPw,
    });

    await User.insert(newUser);
    return newUser;
  }

  @Mutation(() => LoginResponse)
  public async login(
    @Arg('loginInput') loginInput: LoginInput,
    @Ctx() { res, redis }: MyContext,
  ): Promise<LoginResponse> {
    const { emailOrUsername, password } = loginInput;

    // 유저 확인절차
    const user = await User.findOne({
      where: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });
    if (!user)
      return {
        errors: [
          { field: 'emailOrUsername', message: '해당하는 유저가 없습니다.' },
        ],
      };

    const isValid = await argon2.verify(user.password, password);
    if (!isValid)
      return {
        errors: [
          { field: 'password', message: '비밀번호를 올바르게 입력해주세요.' },
        ],
      };

    // 액세스, 리프레시 토큰 발급
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    await redis.set(String(user.id), refreshToken);
    setRefreshTokenHeader(res, refreshToken);

    return { user, accessToken };
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthenticated)
  async logout(
    @Ctx() { verifiedUser, res, redis }: MyContext,
  ): Promise<boolean> {
    if (verifiedUser) {
      setRefreshTokenHeader(res, '');
      await redis.del(String(verifiedUser.userId));
    }
    return true;
  }

  @Mutation(() => RefreshAccessTokenResponse, { nullable: true })
  async refreshAccessToken(
    @Ctx() { req, redis, res }: MyContext,
  ): Promise<RefreshAccessTokenResponse | null> {
    const refreshToken = req.cookies.refreshtoken;
    if (!refreshToken) return null;

    let tokenData: any = null;
    try {
      tokenData = jwt.verify(refreshToken, REFRESH_JWT_SECRET_KEY);
    } catch (e) {
      console.error(e);
      return null;
    }
    if (!tokenData) return null;

    const storedRefreshToken = await redis.get(String(tokenData.userId));
    if (!storedRefreshToken) return null;
    if (storedRefreshToken !== refreshToken) return null;

    const user = await User.findOne({ where: { id: tokenData.userId } });
    if (!user) return null;

    const newAccessToken = createAccessToken(user);
    const newRefreshToken = createRefreshToken(user);

    await redis.set(String(user.id), newRefreshToken);
    setRefreshTokenHeader(res, newRefreshToken);

    return { accessToken: newAccessToken };
  }

  @UseMiddleware(isAuthenticated)
  @Mutation(() => Boolean)
  async uploadProfileImage(
    @Ctx() { verifiedUser }: MyContext,
    @Arg('file', () => GraphQLUpload)
    { createReadStream, filename }: FileUpload,
  ): Promise<boolean> {
    const realFileName = verifiedUser.userId + filename;
    const filePath = `public/${realFileName}`;

    return new Promise((resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(filePath))
        .on('finish', async () => {
          await User.update(
            { id: verifiedUser.userId },
            { profileImage: realFileName },
          );
          return resolve(true);
        })
        .on('error', () => reject(Error('file upload failed'))),
    );
  }
}
