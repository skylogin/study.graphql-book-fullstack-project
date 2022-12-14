import Redis from 'ioredis';

const redis = new Redis({
  host: '152.70.247.215',
  port: 6379,
  password: 'fpeltm#1234',
});

export default redis;
