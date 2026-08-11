import { Worker } from 'bullmq';

const connection = { host: 'localhost', port: 6379 };

// 建立一個 Worker，專門監聽 'email' 這個佇列，有新任務就會自動觸發下面這個函式執行
const emailWorker = new Worker(
  'email',
  async (job) => {
    // job.name 對應到你在 add() 時傳的第一個參數，job.data 對應到你傳的資料
    if (job.name === 'send-welcome-email') {
      const { to, name } = job.data;

      console.log(`正在寄送歡迎信給 ${name} <${to}>...`);
      // 這裡放實際寄信的邏輯（例如呼叫 SendGrid、AWS SES 等服務）
      // 模擬寄信要花 2 秒
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log(`已成功寄送歡迎信給 ${to}`);
    }
  },
  { connection }
);

emailWorker.on('completed', (job) => {
  console.log(`任務 ${job.id} 完成`);
});

emailWorker.on('failed', (job, err) => {
  console.error(`任務 ${job.id} 失敗:`, err.message);
});

console.log('Email Worker 已啟動，開始監聽佇列...');