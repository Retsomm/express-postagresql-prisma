import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '部落格系統 API',
      version: '1.0.0',
      description: '使用者、文章、標籤的 RESTful API 文件',
    },
    servers: [
      // 用相對路徑而不是寫死 localhost，這樣不管部署到哪個網域，
      // Swagger UI 的「Try it out」都會打到目前這個網頁所在的主機
      { url: '/', description: '目前伺服器' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      // 新增這一段：定義可重複使用的資料結構
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: '小明' },
            email: { type: 'string', example: 'ming@example.com' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Post: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: '我的第一篇文章' },
            content: { type: 'string', example: '這是內文' },
            authorId: { type: 'integer', example: 1 },
          },
        },
        Tag: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: '技術' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string', example: '找不到資料' },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);