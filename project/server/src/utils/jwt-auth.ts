import jwt from 'jsonwebtoken';
import User from '../entities/User';

export const DEFAULT_JWT_SECRET_KEY = 'secret-key';

export interface JwtVerifiedUser {
  userId: User['id'];
}

export const createAccessToken = (user: User): string => {
  const userData: JwtVerifiedUser = { userId: user.id };
  const accessToken = jwt.sign(
    userData,
    process.env.JWT_SCRET_KEY || DEFAULT_JWT_SECRET_KEY,
    { expiresIn: '30m' },
  );

  return accessToken;
};
