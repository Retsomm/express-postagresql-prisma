# express-postgreSQL-prisma

使用 Express + PostgreSQL + Prisma 打造的後端 API 專案，包含使用者驗證、文章與標籤管理功能，並提供 Swagger API 文件。

## 技術棧

- [Express](https://expressjs.com/) 5
- [Prisma](https://www.prisma.io/) 7（搭配 `@prisma/adapter-pg`）
- PostgreSQL
- [Redis](https://redis.io/)
- JWT（`jsonwebtoken`）＋ `bcrypt` 密碼雜湊
- [Zod](https://zod.dev/) 資料驗證
- Swagger（`swagger-jsdoc` + `swagger-ui-express`）

## 專案結構

```
.
├── config/        # 設定檔（如 Swagger）
├── errors/        # 自訂錯誤類別
├── lib/           # 共用函式庫
├── middlewares/   # Express middleware
├── prisma/        # Prisma schema 與 migration
├── routes/        # API 路由（auth、users、posts、tags）
├── schemas/       # Zod 驗證 schema
├── utils/         # 工具函式
└── server.js      # 應用程式進入點
```

## 快速開始

### 安裝套件

```bash
npm install
```

### 環境變數

在專案根目錄建立 `.env` 檔案，設定資料庫連線等必要參數（可參考 `prisma.config.ts` 與 `prisma/` 目錄了解所需欄位）。

### 資料庫遷移

```bash
npx prisma migrate dev
```

### 啟動伺服器

```bash
node server.js
```

伺服器預設啟動於 `http://localhost:3000`。

## API 文件

啟動伺服器後，可至 `http://localhost:3000/api-docs` 查看 Swagger API 文件。

## 主要路由

- `/auth` — 使用者驗證（登入、註冊等）
- `/users` — 使用者管理
- `/posts` — 文章管理
- `/tags` — 標籤管理
