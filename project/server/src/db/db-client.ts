import { Connection, createConnection } from 'typeorm';

import {
  NODE_ENV,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_USERNAME,
  DB_PASSWORD,
} from '../constants/constants';

import User from '../entities/User';
import { CutVote } from '../entities/CutVote';
import { CutReview } from '../entities/CutReview';

export const createDB = async (): Promise<Connection> =>
  createConnection({
    type: 'mysql',
    host: DB_HOST,
    port: DB_PORT,
    database: DB_DATABASE,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    logging: !(NODE_ENV === 'production'),
    synchronize: true,
    entities: [User, CutVote, CutReview],
  });
