// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const NODE_ENV = process.env.NODE_ENV || 'dev';
export const PORT = Number(process.env.PORT) || 4000;

export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_PORT = Number(process.env.DB_PORT) || 3306;
export const DB_PASSWORD = process.env.DB_PASSWORD || 'dbpassword';
export const DB_DATABASE = process.env.DB_DATABASE || 'graphql';
export const DB_USERNAME = process.env.DB_USERNAME || 'user';

export const REDIS_HOST = process.env.REDIS_HOST || 'redis://localhost';
export const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD || 'redispassword';

export const DEFAULT_JWT_SECRET_KEY =
  process.env.JWT_SECRET_KEY || 'secret-key';

export const REFRESH_JWT_SECRET_KEY =
  process.env.JWT_REFRESH_SECRET_KEY || 'secret-key2';
