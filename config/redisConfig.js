const redis = require('redis');

// Initialize the Redis client
// By default, it connects to localhost:6379
const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
});

// Event listener for successful connection
redisClient.on('connect', () => {
    console.log('🔄 Connecting to Redis...');
});

redisClient.on('ready', () => {
    console.log('✅ Redis client is ready to use!');
});

// Event listener for errors (CRITICAL: Redis requires an error listener)
redisClient.on('error', (err) => {
    console.error('❌ Redis Client Error:', err);
});

// Self-invoking function to connect asynchronously
(async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.error('Could not connect to Redis:', err);
    }
})();

module.exports = redisClient;