import { Connection, createConnection } from 'typeorm';

import User from '../entities/User';

export const createDB = async (): Promise<Connection> =>
  createConnection({
    type: 'mysql',
    host: '130.162.139.92',
    port: 3306,
    database: 'ghibli_graphql',
    username: 'ghibli',
    password: 'qwer1234',
    logging: !(process.env.NODE_ENV === 'production'),
    synchronize: true,
    entities: [User],
  });
