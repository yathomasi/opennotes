const redis = require("redis");
const config = require("./config");

let redisClient;

if (config.NODE_ENV == "production") {
  redisClient = redis.createClient(config.REDIS_URL);
} else {
  redisClient = redis.createClient();
}
redisClient.on("connect", () => {
  console.log("Redis client connected");
});
redisClient.on("error", error => {
  console.log("Redis not connected", error);
});
module.exports = redisClient;
