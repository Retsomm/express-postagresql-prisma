import swaggerJsdoc from 'swagger-jsdoc';
import { fileURLToPath } from 'url';
import { writeFileSync } from 'fs';
import path from 'path';

// Compute 用 Bun 把整個 app 打包成單一 bundle，routes/*.js 這些原始檔案
// 在部署後的環境裡並不存在（被打包進 bundle 了），所以不能在執行期用
// swagger-jsdoc 掃描檔案系統。改成在 build 階段（打包之前）先掃描一次、
// 把結果寫成 JSON，執行期只是 import 這個 JSON，會被 bundler 當成資料
// 內聯進 bundle，不依賴部署環境的檔案系統。
const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
  apis: [path.join(__dirname, '..', 'routes', '*.js')],
};

const spec = swaggerJsdoc(options);
const outPath = path.join(__dirname, '..', 'config', 'swagger.generated.json');
writeFileSync(outPath, JSON.stringify(spec, null, 2));

const pathCount = Object.keys(spec.paths || {}).length;
console.log(`Swagger spec generated: ${pathCount} path(s) -> ${outPath}`);
if (pathCount === 0) {
  throw new Error('Swagger spec 沒有掃到任何路由，routes/*.js 的 @openapi 註解可能沒被讀到，中止 build');
}
