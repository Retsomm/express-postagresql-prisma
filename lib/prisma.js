import { PrismaClient } from '../generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// 整個專案共用同一個 PrismaClient 實例，不要每個檔案都各自 new 一個
// 因為每個 PrismaClient 都會建立自己的資料庫連線池，重複建立會浪費資源、甚至把資料庫連線數用光
const prisma = new PrismaClient({ adapter });

export default prisma;