import { createClient } from "redis";
import { config } from "../config";
import consola from "consola";

const redis = createClient({
  url: `redis://${config.REDIS_HOST}:${config.REDIS_PORT}`,
});

redis.on("error", (err) => consola.error(err));
redis.on("connect", () => consola.info("Redis connected"));
export { redis as redis };
