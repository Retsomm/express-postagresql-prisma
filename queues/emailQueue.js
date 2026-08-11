import { Queue } from 'bullmq';

// 連線設定，指向你已經裝好的 Redis
const connection = { host: 'localhost', port: 6379 };

// 建立一個叫做 'email' 的佇列，之後所有「寄信」相關的任務都丟進這裡
export const emailQueue = new Queue('email', { connection });