import { Connection, createConnection } from 'typeorm';

import User from '../entities/User';

export const createDB = async (): Promise<Connection> =>
  createConnection({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: 3306,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    logging: !(process.env.NODE_ENV === 'production'),
    synchronize: true,
    entities: [User],
  });
