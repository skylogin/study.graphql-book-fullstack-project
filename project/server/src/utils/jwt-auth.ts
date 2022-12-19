import jwt from 'jsonwebtoken';

import { AuthenticationError } from 'apollo-server-express';
import { IncomingHttpHeaders } from 'http';
import { Response } from 'express';

import {
  NODE_ENV,
  DEFAULT_JWT_SECRET_KEY,
  REFRESH_JWT_SECRET_KEY,
} from '../constants/constants';

import User from '../entities/User';

export interface JwtVerifiedUser {
  userId: User['id'];
}

const createToken = (user: User, token: string, expire: string) => {
  const userData: JwtVerifiedUser = { userId: user.id };
  return jwt.sign(userData, token, { expiresIn: expire });
};

export const createAccessToken = (user: User): string => {
  const expire = '10s';
  return createToken(user, DEFAULT_JWT_SECRET_KEY, expire);
};

export const createRefreshToken = (user: User): string => {
  const expire = '14d';
  return createToken(user, REFRESH_JWT_SECRET_KEY, expire);
};

export const setRefreshTokenHeader = (
  res: Response,
  refreshToken: string,
): void => {
  res.cookie('refreshtoken', refreshToken, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'lax',
  });
};

export const verifyAccessToken = (
  accessToken?: string,
): JwtVerifiedUser | null => {
  if (!accessToken) return null;
  try {
    const verified = jwt.verify(
      accessToken,
      DEFAULT_JWT_SECRET_KEY,
    ) as JwtVerifiedUser;

    return verified;
  } catch (err) {
    console.error('access_token expired: ', err.expiredAt);
    throw new AuthenticationError('access token expired');
  }
};

export const verifyAccessTokenFromReqHeaders = (
  headers: IncomingHttpHeaders,
): JwtVerifiedUser | null => {
  const { authorization } = headers;
  if (!authorization) return null;

  const accessToken = authorization.split(' ')[1];
  try {
    return verifyAccessToken(accessToken);
  } catch {
    return null;
  }
};
