import Redis from "ioredis";

const redisHost = process.env.REDIS_HOST!;
const redisPort = process.env.REDIS_PORT!;

const cache = new Redis({
  host: redisHost,
  port: Number(redisPort)
});

export default cache;