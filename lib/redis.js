import { createClient } from 'redis';

// 跟 PrismaClient 一樣，整個專案共用同一個連線，不要每個檔案各自建立
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => console.error('Redis 連線錯誤:', err));

await redisClient.connect();

export default redisClient;