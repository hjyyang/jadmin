const Redis = require("ioredis");
const redis = {
  port: 6379, // Redis port
  host: "47.100.203.219", // Redis host
  prefix: "sam:", //存诸前缀
  password: "hjy8908581",
  ttl: 60 * 60 * 1, //过期时间
  family: 4,
  db: 0
};
const newRedis = new Redis(redis);
module.exports = newRedis;
