import swaggerJsdoc from 'swagger-jsdoc';
import { fileURLToPath } from 'url';
import path from 'path';

// swagger-jsdoc 的 `apis` glob 是相對於執行時的 process.cwd() 解析，
// 不是相對於這個檔案。部署環境的工作目錄不一定等於專案根目錄，
// 用相對路徑在本機測得到、部署後卻可能掃不到任何路由檔（Schemas 正常但 Paths 是空的）。
// 改成從這個檔案自己的位置算出絕對路徑，就不受執行時的 cwd 影響。
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
  apis: [path.join(__dirname, '..', 'routes', '*.js')],
};

export const swaggerSpec = swaggerJsdoc(options);

// 暫時性診斷用，找出 Compute 部署環境為何掃不到 routes/*.js 的 JSDoc 之後會移除。
import fs from 'fs';
const routesDir = path.join(__dirname, '..', 'routes');
export const swaggerDebugInfo = {
  dirname: __dirname,
  cwd: process.cwd(),
  apisGlob: options.apis,
  routesDirExists: fs.existsSync(routesDir),
  routesDirFiles: fs.existsSync(routesDir) ? fs.readdirSync(routesDir) : null,
  pathCount: Object.keys(swaggerSpec.paths || {}).length,
};

// Compute 的 build 只會打包程式碼實際 import 的東西，swagger-ui-express 需要的
// swagger-ui-dist 靜態檔（css/js）不是用 import 讀取，打包後在部署環境找不到、永遠 404。
// 改成直接從 CDN 載入這些靜態資源，就不依賴部署環境有沒有把 node_modules 的檔案帶過去。
const SWAGGER_UI_VERSION = '5.32.12';

export const swaggerHtml = `<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8" />
  <title>部落格系統 API 文件</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@${SWAGGER_UI_VERSION}/swagger-ui.css" integrity="sha384-9Q2fpS+xeS4ffJy6CagnwoUl+4ldAYhOs9pgZuEKxypVModhmZFzeMlvVsAjf7uT" crossorigin="anonymous" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@${SWAGGER_UI_VERSION}/swagger-ui-bundle.js" integrity="sha384-aPw2h1Un96ObRq1fD7AOgyf0r9jgkhMD51uBltHKtT0++4LsgMUkQD52RFNWcAil" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@${SWAGGER_UI_VERSION}/swagger-ui-standalone-preset.js" integrity="sha384-m05NHMTwYzsIxuzXMYDard06UtAxQkr+gZ7tf01TGlpECbjtRVz8HSkSMCBiwMQQ" crossorigin="anonymous"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '/api-docs/swagger.json',
        dom_id: '#swagger-ui',
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
        plugins: [SwaggerUIBundle.plugins.DownloadUrl],
        layout: 'StandaloneLayout',
      });
    };
  </script>
</body>
</html>
`;