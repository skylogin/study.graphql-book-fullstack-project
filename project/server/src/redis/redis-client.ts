import Redis from 'ioredis';

import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } from '../constants/constants';

const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
});

export default redis;
