export const config = {
  API_PORT: 3000,
  REDIS_HOST: process.env.REDIS_HOST || "127.0.0.1",
  REDIS_PORT: process.env.REDIS_POR || 6379,
  debug: process.env.DEBUG === "1",
};
