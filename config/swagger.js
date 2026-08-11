// swaggerSpec 是 build 階段由 scripts/generate-swagger.js 掃描 routes/*.js
// 的 JSDoc 註解、預先產生的靜態 JSON（詳見該檔案開頭的說明）。這裡用
// import 讀取而不是執行期呼叫 swagger-jsdoc，這樣 Bun 把整個 app 打包成
// bundle 時，這份 JSON 會被內聯進 bundle 裡，不依賴部署環境的檔案系統。
import swaggerSpec from './swagger.generated.json' with { type: 'json' };

export { swaggerSpec };

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
